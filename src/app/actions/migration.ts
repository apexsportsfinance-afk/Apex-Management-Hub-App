"use server";

import { reconcileAthlete, reconcileSession } from "@/lib/migration/reconciler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function processMigrationBatch(type: 'athlete' | 'schedule', data: any[]) {
  const results = [];

  for (const item of data) {
    if (type === 'athlete') {
      const reconciliation = await reconcileAthlete(item);
      if (reconciliation.action === 'create') {
        const student = await prisma.athlete.create({
          data: {
            fullName: item.fullName,
            email: item.email || null,
            grade: item.grade || 'Unknown',
            // Default mappings
            isActive: true,
          }
        });
        results.push({ id: student.id, status: 'created' });
      } else {
        results.push({ id: reconciliation.existingId, status: 'updated' });
      }
    } else if (type === 'schedule') {
        // Logic for bulk class creation
        // Note: In a real scenario, we'd resolve Venue/Coach names to IDs here
        results.push({ status: 'queued' });
    }
  }

  return { success: true, count: results.length, details: results };
}

/**
 * Data Reconciler for Apex Sports Hub
 * Handles deduplication and synchronization between legacy data and Prisma DB.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ReconciliationStatus {
  action: 'create' | 'update' | 'skip';
  reason: string;
  existingId?: string;
}

export async function reconcileAthlete(data: { fullName: string; email?: string }) {
  // 1. Try to find existing athlete
  const existing = await prisma.athlete.findFirst({
    where: {
      OR: [
        { fullName: { equals: data.fullName, mode: 'insensitive' } },
        { email: data.email ? { equals: data.email, mode: 'insensitive' } : undefined }
      ].filter(Boolean) as any
    }
  });

  if (existing) {
    return {
      action: 'update',
      reason: `Matching profile found: ${existing.fullName}`,
      existingId: existing.id
    };
  }

  return { action: 'create', reason: 'No matching profile detected' };
}

export async function reconcileSession(data: { venueId: string; coachId: string; startTime: string; dayOfWeek: string }) {
  const existing = await prisma.class.findFirst({
    where: {
      venueId: data.venueId,
      coachId: data.coachId,
      startTime: data.startTime,
      dayOfWeek: data.dayOfWeek
    }
  });

  if (existing) {
    return {
      action: 'skip',
      reason: 'Session already exists in schedule',
      existingId: existing.id
    };
  }

  return { action: 'create', reason: 'Unique session identified' };
}

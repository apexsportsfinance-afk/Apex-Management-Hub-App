/**
 * Smart Data Classifier for Apex Sports Hub
 * Analyzes unstructured headers from legacy exports (Okra, CSV, Excel)
 * and identifies the target system model.
 */

export type MigrationTarget = 'athlete' | 'payment' | 'schedule' | 'package' | 'unknown';

interface ClassificationRule {
  target: MigrationTarget;
  keywords: string[];
  weight: number;
}

const RULES: ClassificationRule[] = [
  {
    target: 'athlete',
    keywords: ['name', 'guardian', 'parent', 'student', 'email', 'phone', 'dob', 'gender', 'emergency'],
    weight: 0, // Calculated dynamically
  },
  {
    target: 'payment',
    keywords: ['amount', 'invoice', 'paid', 'transaction', 'receipt', 'date', 'method', 'currency', 'total'],
    weight: 0,
  },
  {
    target: 'schedule',
    keywords: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'coach', 'venue', 'court', 'pool'],
    weight: 0,
  },
  {
    target: 'package',
    keywords: ['expiry', 'package', 'sessions', 'remaining', 'left', 'usage', 'credits', 'bundle'],
    weight: 0,
  }
];

export function classifySheetHeaders(headers: string[]): { target: MigrationTarget; confidence: number } {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  const scores: Record<MigrationTarget, number> = {
    athlete: 0,
    payment: 0,
    schedule: 0,
    package: 0,
    unknown: 0
  };

  normalizedHeaders.forEach(header => {
    RULES.forEach(rule => {
      if (rule.keywords.some(k => header.includes(k))) {
        scores[rule.target]++;
      }
    });
  });

  // Calculate high score
  let bestTarget: MigrationTarget = 'unknown';
  let maxScore = 0;

  (Object.keys(scores) as MigrationTarget[]).forEach(target => {
    if (scores[target] > maxScore) {
      maxScore = scores[target];
      bestTarget = target;
    }
  });

  // Confidence is percentage of identified headers belonging to best target vs total hits
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? (maxScore / totalScore) * 100 : 0;

  return { target: bestTarget, confidence: Math.round(confidence) };
}

/**
 * AI PDF Extraction Engine for Apex Sports Hub
 * Simulates LLM-based extraction for unstructured/scanned legacy reports.
 */

export interface AIExtractedResult {
  category: 'payment' | 'athlete' | 'attendance';
  entities: any[];
  confidence: number;
}

export function processRawTextWithAI(rawText: string): AIExtractedResult {
  // Heuristic Simulation: Analyze patterns in the "messy" text
  const lines = rawText.split('\n');
  const entities: any[] = [];
  
  // 1. Detection Phase: Guess category based on pattern density
  const hasCurrency = /AED|QAR|SAR|\$|Total|Paid/.test(rawText);
  const hasDates = /\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}/.test(rawText);
  const hasNames = /[A-Z][a-z]+ [A-Z][a-z]+/.test(rawText);

  let category: 'payment' | 'athlete' | 'attendance' = 'attendance';
  if (hasCurrency) category = 'payment';
  else if (hasNames && !hasCurrency) category = 'athlete';

  // 2. Extraction Phase: Fuzzy mapping
  lines.forEach(line => {
    if (category === 'payment') {
      // Look for [Name] [Amount] [Date]
      const amountMatch = line.match(/(\d+\.?\d*)/);
      const nameMatch = line.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
      if (amountMatch && nameMatch) {
        entities.push({
          name: nameMatch[0],
          amount: parseFloat(amountMatch[0]),
          date: new Date().toLocaleDateString(), // Placeholder for extracted date
          status: 'paid'
        });
      }
    } else if (category === 'athlete') {
      // Look for [Name] [Email/Phone]
      const nameMatch = line.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
      const emailMatch = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
      if (nameMatch) {
        entities.push({
          fullName: nameMatch[0],
          email: emailMatch ? emailMatch[0] : 'N/A',
          parentName: 'Extracted'
        });
      }
    }
  });

  return {
    category,
    entities,
    confidence: entities.length > 5 ? 85 : 60 // Simulated confidence
  };
}

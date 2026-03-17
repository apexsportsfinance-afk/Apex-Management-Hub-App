async function run() {
  const fs = await import('fs');
  const { parseCompetitionFile } = await import('./src/lib/CoachHeatParser.js');
  
  const filePath = "c:\\Users\\Administrator\\Downloads\\heat_sheet-1773684874825.htm";
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const mockFile = {
    name: 'heat_sheet-1773684874825.htm',
    text: async () => fileContent,
    arrayBuffer: async () => new TextEncoder().encode(fileContent).buffer
  };

  try {
    const results = await parseCompetitionFile(mockFile, 'heat_sheet');
    const targetName = "carla sameh";
    const alternateName = "sameh, carla";
    
    let limit = 5;
    let printed = 0;
    console.log(`\n============ TOTAL PARSED RECORDS: ${results.length} ============`);
    console.log(`\nFirst few records in general:\n`);
    for (const r of results) {
        if (printed >= limit) break;
        console.log(r);
        printed++;
    }

    const relevantResults = results.filter(r => 
      r.athleteName && (
        r.athleteName.toLowerCase().includes(targetName) ||
        r.athleteName.toLowerCase().includes(alternateName) || 
        r.athleteName.toLowerCase().includes("carla")
      )
    );

    console.log(`\n============ EXTRACTION REPORT FOR "CARLA SAMEH" ============`);
    console.log(`\nFound ${relevantResults.length} entries for Carla Sameh.\n`);
    
    relevantResults.forEach((r, idx) => {
      console.log(`Occurrence ${idx + 1}:`);
      console.log(r);
      console.log('------------------------------------------------------');
    });

  } catch (err) {
    console.error("Test failed:", err);
  }
}

run();

#!/usr/bin/env node
// Diagnostic script to check test file loading

const fs = require('fs');
const path = require('path');

console.log('=== Test File Diagnostic ===\n');

const testFiles = [
  'src/__tests__/lib/educational-content.test.ts',
  'src/__tests__/hooks/use-educational-dismissal.test.ts',
];

testFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  console.log(`\nFile: ${file}`);
  console.log(`Full Path: ${fullPath}`);
  console.log(`Exists: ${fs.existsSync(fullPath)}`);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`Lines: ${lines.length}`);
    console.log(`Size: ${content.length} bytes`);
    console.log(`Encoding: UTF-8`);
    console.log(`Has BOM: ${content.charCodeAt(0) === 0xFEFF ? 'Yes' : 'No'}`);
    
    // Check for test blocks
    const describeMatches = content.match(/describe\s*\(/g) || [];
    const itMatches = content.match(/\b(it|test)\s*\(/g) || [];
    
    console.log(`describe( count: ${describeMatches.length}`);
    console.log(`it/test( count: ${itMatches.length}`);
    
    // First few lines
    console.log(`\nFirst 3 lines:`);
    lines.slice(0, 3).forEach((line, i) => {
      console.log(`  ${i + 1}: ${line.substring(0, 80)}`);
    });
    
    // Check imports
    const importLines = lines.filter(l => l.includes('import'));
    console.log(`\nImport lines (${importLines.length}):`);
    importLines.forEach(line => {
      console.log(`  ${line.substring(0, 100)}`);
    });
  }
});

console.log('\n=== Diagnostic Complete ===');

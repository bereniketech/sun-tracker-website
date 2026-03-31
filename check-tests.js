const fs = require('fs');
const path = require('path');

const testFiles = [
  'src/__tests__/lib/educational-content.test.ts',
  'src/__tests__/hooks/use-educational-dismissal.test.ts',
];

console.log('Checking test files...\n');

for (const file of testFiles) {
  const filePath = path.join(__dirname, file);
  console.log(`File: ${file}`);
  console.log(`Exists: ${fs.existsSync(filePath)}`);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`Size: ${content.length} bytes`);
    console.log(`Has describe: ${content.includes('describe(')}`);
    console.log(`Has it: ${content.includes('it(')}`);
    
    // Count describe and it blocks
    const describeCount = (content.match(/describe\(/g) || []).length;
    const itCount = (content.match(/it\(/g) || []).length;
    console.log(`describe() blocks: ${describeCount}`);
    console.log(`it() blocks: ${itCount}`);
  }
  console.log('---');
}

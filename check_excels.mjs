import xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const files = fs.readdirSync('..').filter(f => f.endsWith('.xlsx'));
for (const file of files) {
  console.log(`Reading ${file}`);
  const workbook = xlsx.readFile(path.join('..', file));
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  console.log(`Rows: ${data.length}`);
  
  // check for Speliotopoulos
  const spels = data.filter(r => r.some(c => String(c).includes('Speliotopoulos')));
  console.log(`Speliotopoulos occurrences: ${spels.length}`);
}

import xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const files = fs.readdirSync('c:/Users/keitaro/Desktop/DVC_JA_Rating_Project').filter(f => f.endsWith('.xlsx'));
for (const file of files) {
  console.log(`\n--- ${file} ---`);
  const workbook = xlsx.readFile(path.join('c:/Users/keitaro/Desktop/DVC_JA_Rating_Project', file));
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  console.log("Row 0:", data[0]);
  console.log("Row 1:", data[1]);
}

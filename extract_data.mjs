import xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const parentDir = path.join('..');
const rawData = [];

// Helper to safely get string
const gs = (val) => val === undefined || val === null ? "" : String(val).trim();
const gn = (val) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

// 1. 授業評価シート.xlsx
console.log("Reading 授業評価シート.xlsx...");
let wb1 = xlsx.readFile(path.join(parentDir, '授業評価シート.xlsx'));
let data1 = xlsx.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]], { header: 1 });
for (let i = 2; i < data1.length; i++) {
  const row = data1[i];
  if (row.length === 0) continue;
  rawData.push({
    term: gs(row[0]), course: gs(row[1]), num: gs(row[2]), profName: gs(row[3]),
    igetc: gs(row[4]), credits: gs(row[5]), classType: gs(row[6]),
    ratingProf: gn(row[7]), ratingClass: gn(row[8]), ratingEasy: gn(row[9]),
    grading: gs(row[10]), testFormat: gs(row[11]), comment: gs(row[12]), syllabus: gs(row[13])
  });
}

// 2. 授業評価シートアンケート【2025】（回答）.xlsx
console.log("Reading 授業評価シートアンケート【2025】（回答）.xlsx...");
let wb2 = xlsx.readFile(path.join(parentDir, '授業評価シートアンケート【2025】（回答）.xlsx'));
let data2 = xlsx.utils.sheet_to_json(wb2.Sheets[wb2.SheetNames[0]], { header: 1 });
for (let i = 1; i < data2.length; i++) {
  const row = data2[i];
  if (row.length === 0) continue;
  rawData.push({
    term: gs(row[0]), course: gs(row[1]), num: gs(row[2]), profName: gs(row[3]),
    igetc: "", credits: gs(row[4]), classType: gs(row[5]),
    ratingProf: gn(row[6]), ratingClass: gn(row[7]), ratingEasy: gn(row[8]),
    grading: gs(row[9]), testFormat: "", comment: gs(row[11]), syllabus: gs(row[10])
  });
}

// 3. （新）授業評価シート2022.xlsx
console.log("Reading （新）授業評価シート2022.xlsx...");
let wb3 = xlsx.readFile(path.join(parentDir, '（新）授業評価シート2022.xlsx'));
let data3 = xlsx.utils.sheet_to_json(wb3.Sheets[wb3.SheetNames[0]], { header: 1 });
for (let i = 1; i < data3.length; i++) {
  const row = data3[i];
  if (row.length === 0) continue;
  let commentStr = gs(row[14]);
  if (gs(row[17])) commentStr += "\n" + gs(row[17]);
  
  rawData.push({
    term: gs(row[3]), course: gs(row[4]), num: gs(row[5]), profName: gs(row[8]),
    igetc: gs(row[7]), credits: gs(row[6]), classType: gs(row[10]),
    ratingProf: gn(row[11]), ratingClass: gn(row[11]), ratingEasy: gn(row[12]),
    grading: gs(row[16]), testFormat: gs(row[15]), comment: commentStr, syllabus: ""
  });
}

fs.writeFileSync('raw_data.json', JSON.stringify(rawData, null, 2));
console.log(`Total extracted rows: ${rawData.length}`);

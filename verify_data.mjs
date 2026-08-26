import * as fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('raw_data.json', 'utf8'));
const processedData = JSON.parse(fs.readFileSync('src/data.json', 'utf8'));

const headers = rawData[0];
const rawRows = rawData.slice(1);

let totalRaw = rawRows.length;
let totalProcessed = processedData.length;

let droppedRows = 0;
let droppedReasons = { emptyRow: 0, missingCourseAndProf: 0 };

let courseTransformations = {};
let profTransformations = {};

rawRows.forEach((row, i) => {
  if (row.length === 0) {
    droppedRows++;
    droppedReasons.emptyRow++;
    return;
  }
  
  const rawCourse = row[1] || "";
  const rawCourseNum = row[2] || "";
  const rawProf = row[3] || "";
  
  // Find matching processed row
  const processed = processedData.find(p => p.id === i);
  
  if (!processed) {
    droppedRows++;
    droppedReasons.missingCourseAndProf++;
    return;
  }
  
  const rawCombinedCourse =  .trim();
  const processedCourse = processed.courseFull;
  
  if (rawCombinedCourse.toLowerCase() !== processedCourse.toLowerCase() && rawCombinedCourse !== "") {
    if (!courseTransformations[rawCombinedCourse]) {
      courseTransformations[rawCombinedCourse] = new Set();
    }
    courseTransformations[rawCombinedCourse].add(processedCourse);
  }
  
  if (rawProf.trim() !== processed.profName && rawProf.trim() !== "") {
    if (!profTransformations[rawProf.trim()]) {
      profTransformations[rawProf.trim()] = new Set();
    }
    profTransformations[rawProf.trim()].add(processed.profName);
  }
});

const report = {
  totalRaw,
  totalProcessed,
  droppedRows,
  droppedReasons,
  courseTransformations: Object.fromEntries(
    Object.entries(courseTransformations)
      .map(([k, v]) => [k, Array.from(v)])
      .slice(0, 50)
  ),
  profTransformations: Object.fromEntries(
    Object.entries(profTransformations)
      .map(([k, v]) => [k, Array.from(v)])
      .slice(0, 50)
  )
};

console.log(JSON.stringify(report, null, 2));

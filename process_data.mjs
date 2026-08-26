import * as fs from 'fs';
import stringSimilarity from 'string-similarity';

const rawData = JSON.parse(fs.readFileSync('raw_data.json', 'utf8'));
const reviews = [];

// Dictionary mapping common full names to DVC catalog abbreviations
const courseAbbreviations = {
  'anthropology': 'ANTHR',
  'antholopology': 'ANTHR',
  'architecture': 'ARCHI',
  'architectual history': 'ARCHI',
  'business statistics': 'BUS',
  'business': 'BUS',
  'accounting': 'BUSAC',
  'busac': 'BUSAC',
  'biology': 'BIOSC',
  'chemistry': 'CHEM',
  'computer science': 'COMSC',
  'comsci': 'COMSC',
  'communication': 'COMM',
  'economics': 'ECON',
  'english': 'ENGL',
  'history': 'HIST',
  'mathematics': 'MATH',
  'physics': 'PHYS',
  'psychology': 'PSYCH',
  'psych': 'PSYCH',
  'psyc': 'PSYCH',
  'sociology': 'SOCIO',
  'political science': 'POLSC',
  'music': 'MUSIC',
  'art': 'ART',
  'japanese': 'JAPN'
};

const ccnExactMapping = {
  'BIOSC 101': { course: 'BIOL', num: 'C1001' },
  'BIOSC 102': { course: 'BIOL', num: 'C1000' },
  'COMM 120': { course: 'COMM', num: 'C1000' },
  'ECON 220': { course: 'ECON', num: 'C2002' },
  'ECON 221': { course: 'ECON', num: 'C2001' },
  'ENGL 122': { course: 'ENGL', num: 'C1000' },
  'ENGL 122L': { course: 'ENGL', num: 'C1000E' },
  'ENGL 123': { course: 'ENGL', num: 'C1003' },
  'ENGL 126': { course: 'ENGL', num: 'C1001' },
  'ENGL 150': { course: 'ENGL', num: 'C1002' },
  'HIST 120': { course: 'HIST', num: 'C1001' },
  'HIST 121': { course: 'HIST', num: 'C1002' },
  'MATH 142': { course: 'STAT', num: 'C1000' },
  'MATH 142L': { course: 'STAT', num: 'C1000E' },
  'POLSC 120': { course: 'POLS', num: 'C1000' },
  'PSYCH 101': { course: 'PSYC', num: 'C1000' }
};

const ccnPrefixMapping = {
  'BIOSC': 'BIOL',
  'POLSC': 'POLS',
  'PSYCH': 'PSYC'
};

function normalizeCourse(rawCourse, rawCourseNum) {
  let course = String(rawCourse || "").trim().toLowerCase();
  let num = String(rawCourseNum || "").trim().toLowerCase();
  
  let combined = `${course} ${num}`.replace(/fall|spring|summer|winter/gi, '').trim();
  
  const match = combined.match(/([a-z]+)[^0-9]*(\d+[a-z]*)/);
  if (match) {
    let alpha = match[1];
    let numeric = match[2];
    for (const [full, abbr] of Object.entries(courseAbbreviations)) {
      if (combined.includes(full)) {
        alpha = abbr.toLowerCase();
        break;
      }
    }
    course = alpha.toUpperCase();
    num = numeric.toUpperCase();
  } else {
    course = course.toUpperCase().replace(/[^A-Z]/g, '');
    num = num.toUpperCase().replace(/[^0-9A-Z]/g, '');
  }

  const fullParsed = `${course} ${num}`;
  if (ccnExactMapping[fullParsed]) {
    course = ccnExactMapping[fullParsed].course;
    num = ccnExactMapping[fullParsed].num;
  } else if (ccnPrefixMapping[course]) {
    course = ccnPrefixMapping[course];
  }
  return { course, num, courseFull: `${course} ${num}` };
}

function baseCleanProfName(profName) {
  if (!profName) return "";
  let name = String(profName).trim();
  name = name.replace(/\.$/, '');
  if (name.includes(',')) {
    const parts = name.split(',');
    name = `${parts[1].trim()} ${parts[0].trim()}`;
  }
  name = name.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  return name;
}

function buildGlobalAndSubjectAliases(rawData) {
  const allNamesSet = new Set();
  const subjectGroups = {};
  
  rawData.forEach(row => {
    const { course } = normalizeCourse(row.course, row.num);
    const profName = baseCleanProfName(row.profName);
    if (profName === '力学と波動' || profName === 'English122al' || profName === '33') return;
    
    if (profName) {
      allNamesSet.add(profName);
      if (course) {
        if (!subjectGroups[course]) subjectGroups[course] = new Set();
        subjectGroups[course].add(profName);
      }
    }
  });

  const dynamicAliases = {};
  const allNames = Array.from(allNamesSet).sort((a, b) => b.length - a.length);

  // 1. GLOBAL MATCHING (Rule A & C)
  for (let i = 0; i < allNames.length; i++) {
    const masterName = allNames[i];
    if (dynamicAliases[masterName]) continue;

    for (let j = i + 1; j < allNames.length; j++) {
      const shortName = allNames[j];
      if (dynamicAliases[shortName]) continue;

      let isMatch = false;
      const masterParts = masterName.split(' ');
      const masterLast = masterParts[masterParts.length - 1];
      const shortParts = shortName.split(' ');
      const shortLast = shortParts[shortParts.length - 1];

      // Rule A: Initial & Last Name Match (Global)
      if (masterLast === shortLast) {
        if (shortParts.length === 2 && shortParts[0].length === 1 && masterParts[0].startsWith(shortParts[0])) {
          isMatch = true;
        }
        if (shortParts.length === 1) {
          isMatch = true;
        }
      }

      // Rule C: Fuzzy Matching (Global)
      if (!isMatch) {
        const sim = stringSimilarity.compareTwoStrings(shortName.toLowerCase(), masterName.toLowerCase());
        const simLast = stringSimilarity.compareTwoStrings(shortName.toLowerCase(), masterLast.toLowerCase());
        if (sim >= 0.82 || simLast >= 0.85) {
          isMatch = true;
        }
      }

      if (isMatch) {
        dynamicAliases[shortName] = masterName;
      }
    }
  }

  // 2. SUBJECT-RESTRICTED MATCHING (Rule B for Nicknames)
  for (const [subject, namesSet] of Object.entries(subjectGroups)) {
    const names = Array.from(namesSet).sort((a, b) => b.length - a.length);
    for (let i = 0; i < names.length; i++) {
      const masterName = names[i];
      const actualMaster = dynamicAliases[masterName] || masterName;
      
      for (let j = i + 1; j < names.length; j++) {
        const shortName = names[j];
        if (dynamicAliases[shortName]) continue;

        let isMatch = false;
        const masterParts = actualMaster.split(' ');
        const masterLast = masterParts[masterParts.length - 1];

        // Rule B: Prefix Match for nicknames
        if (shortName.length >= 4) {
          const cleanShort = shortName.replace(/\s+/g, '').toLowerCase();
          const cleanMasterLast = masterLast.toLowerCase();
          
          let prefixMatchLength = 0;
          for (let k = 0; k < Math.min(cleanShort.length, cleanMasterLast.length); k++) {
            if (cleanShort[k] === cleanMasterLast[k]) {
              prefixMatchLength++;
            } else {
              break;
            }
          }
          if (prefixMatchLength >= 4) {
            isMatch = true;
          }
        }

        if (isMatch) {
          dynamicAliases[shortName] = actualMaster;
        }
      }
    }
  }
  
  return dynamicAliases;
}

const dynamicAliases = buildGlobalAndSubjectAliases(rawData);

function normalizeProf(rawProfName, courseAbbr) {
  let name = baseCleanProfName(rawProfName);
  if (!name) return "";
  
  const customAliases = {
    'フランクオルテガ': 'Frank Ortega',
    '力学と波動': 'Unknown (Data Error)',
    'English122al': 'Unknown (Data Error)',
    '33': 'Unknown (Data Error)',
  };
  
  if (customAliases[name]) {
    return customAliases[name];
  }
  
  if (name === 'Evan Large' && courseAbbr === 'PHYS') {
    return 'Unknown (Data Error)';
  }
  
  if (dynamicAliases[name]) {
    name = dynamicAliases[name];
  }
  
  return name;
}

// -------------------------------------------------------------------
// メイン処理とコース名のバックフィル
// -------------------------------------------------------------------

// Step 1: Normalize all rows
const intermediateReviews = rawData.map((row, index) => {
  const { course, num, courseFull } = normalizeCourse(row.course, row.num);
  const profName = normalizeProf(row.profName, course);
  
  return {
    id: index,
    term: row.term || "",
    course,
    courseNum: num,
    courseFull,
    profName,
    igetc: row.igetc || "",
    credits: row.credits || "",
    classType: row.classType || "",
    ratingProf: row.ratingProf || 0,
    ratingClass: row.ratingClass || 0,
    ratingEasy: row.ratingEasy || 0,
    grading: row.grading || "",
    testFormat: row.testFormat || "",
    syllabus: row.syllabus || "",
    comment: row.comment || ""
  };
}).filter(r => r.course || r.profName);

// Step 2: Build a dictionary of ProfName -> Most common Course Subject
const profToCourse = {};
intermediateReviews.forEach(r => {
  if (r.profName && r.course) {
    if (!profToCourse[r.profName]) profToCourse[r.profName] = {};
    profToCourse[r.profName][r.course] = (profToCourse[r.profName][r.course] || 0) + 1;
  }
});

const getMostCommonCourse = (profName) => {
  if (!profToCourse[profName]) return "";
  let maxCount = 0;
  let bestCourse = "";
  for (const [course, count] of Object.entries(profToCourse[profName])) {
    if (count > maxCount) {
      maxCount = count;
      bestCourse = course;
    }
  }
  return bestCourse;
};

// Step 3: Backfill missing courses
intermediateReviews.forEach(r => {
  if (r.course === "" && r.profName) {
    const inferredCourse = getMostCommonCourse(r.profName);
    if (inferredCourse) {
      r.course = inferredCourse;
      // Re-evaluate courseFull
      r.courseFull = `${inferredCourse} ${r.courseNum}`.trim();
    }
  }
});

fs.writeFileSync('src/data.json', JSON.stringify(intermediateReviews, null, 2));
console.log(`Formatted and normalized ${intermediateReviews.length} reviews saved to src/data.json`);

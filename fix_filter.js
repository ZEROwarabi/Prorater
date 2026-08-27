const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const target = `      if (activeTab === \u0027course\u0027) {
        let data = initialData;
        // Filter by GE Area if active
        if (geFilter.length > 0) {
          data = data.filter(r => geFilter.includes(r.course.toUpperCase()));
        }
        // Filter by text search if present
        if (searchCourse) {
          const exactPrefixMatch = uniqueCourses.find(uc => uc.toLowerCase() === searchCourse.toLowerCase());
          if (exactPrefixMatch) {
            data = data.filter(r => r.course === exactPrefixMatch);
          } else {
            data = data.filter(r => r.courseFull.toLowerCase().includes(searchCourse.toLowerCase()) || r.course.toLowerCase().includes(searchCourse.toLowerCase()));
          }
        }
        if (!searchProf) return initialData;
        return initialData.filter(r => r.profName.toLowerCase().includes(searchProf.toLowerCase()));
      }`;

const replacement = `      if (activeTab === \u0027course\u0027) {
        let data = initialData;
        // Filter by GE Area if active
        if (geFilter.length > 0) {
          data = data.filter(r => geFilter.includes(r.course.toUpperCase()));
        }
        // Filter by text search if present
        if (searchCourse) {
          const exactPrefixMatch = uniqueCourses.find(uc => uc.toLowerCase() === searchCourse.toLowerCase());
          if (exactPrefixMatch) {
            data = data.filter(r => r.course === exactPrefixMatch);
          } else {
            data = data.filter(r => r.courseFull.toLowerCase().includes(searchCourse.toLowerCase()) || r.course.toLowerCase().includes(searchCourse.toLowerCase()));
          }
        }
        return data;
      } else {
        if (!searchProf) return initialData;
        return initialData.filter(r => r.profName.toLowerCase().includes(searchProf.toLowerCase()));
      }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync("src/app/ClientPage.tsx", code);
    console.log("Fixed!");
} else {
    console.log("Target not found!");
}

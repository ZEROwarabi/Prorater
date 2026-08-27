const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const target = `      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        data = data.filter(r => 
          r.course.toLowerCase().includes(q) ||
          (courseFullNames[r.course] && courseFullNames[r.course].toLowerCase().includes(q)) ||
          r.profName.toLowerCase().includes(q)
        );
      }`;

const replacement = `      if (searchQuery) {
        const tokens = searchQuery.toLowerCase().split(/\\s+/).filter(Boolean);
        data = data.filter(r => {
          const courseStr = r.course.toLowerCase();
          const courseFullStr = (courseFullNames[r.course] || "").toLowerCase();
          const profStr = r.profName.toLowerCase();
          const matchTarget = (targetStr) => tokens.every(token => targetStr.includes(token));
          
          return matchTarget(courseStr) || matchTarget(courseFullStr) || matchTarget(profStr);
        });
      }`;

code = code.replace(target, replacement);
fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Fixed search logic!");


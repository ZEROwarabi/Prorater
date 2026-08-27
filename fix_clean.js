const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

// 1. Remove the activeTab ? ( ... ) : ( ... ) from Search Area
const searchAreaEndRegex = /<\/div>\s*\)\}\s*<\/>\s*\)\s*:\s*\([\s\S]*?<\/datalist>\s*<\/>\s*\)\}/;
code = code.replace(searchAreaEndRegex, "</div>\n              )}"); // Wait, this is tricky.

// Just do it carefully with indexOf
const startIdx = code.indexOf("              </>\n            ) : (\n              <>\n                <input");
const endIdx = code.indexOf("          {/* Results Area */}");
if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + "        </div>\n\n" + code.substring(endIdx);
}

// 2. Remove activeTab condition from COURSE RESULTS
const courseResultsRegex = /\{activeTab === \u0027course\u0027 && \(\s*(Object\.keys\(courseGrouped\)\.length === 0[\s\S]*?\)\s*\)\}/;
code = code.replace(courseResultsRegex, (match, p1) => {
  return p1;
});
code = code.replace(/\{activeTab === \u0027course\u0027 && \(/, ""); // fallback

// 3. Update the "Not found" text
code = code.replace(/Object\.keys\(courseGrouped\)\.length === 0 \? \(/, "Object.keys(courseGrouped).length === 0 && (searchQuery || geFilter.length > 0) ? (");

// 4. Remove PROFESSOR RESULTS entirely
const profResultsStart = code.indexOf("{/* PROFESSOR RESULTS */}");
const profResultsEnd = code.indexOf("</main>", profResultsStart);
if (profResultsStart !== -1 && profResultsEnd !== -1) {
  code = code.substring(0, profResultsStart) + code.substring(profResultsEnd);
}

fs.writeFileSync("src/app/ClientPage.tsx", code);


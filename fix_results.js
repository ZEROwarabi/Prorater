const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

// 1. Quick Tags Section condition
code = code.replace(/\{\(!searchCourse && geFilter\.length === 0\) \? \(/g, "{(!searchQuery && geFilter.length === 0) ? (");
code = code.replace(/setSearchCourse\(""\);/g, "setSearchQuery(\"\");");
code = code.replace(/setSearchCourse\(subj\);/g, "setSearchQuery(subj);");

// 2. Remove ternary close and searchProf block
const ternaryEndMatch = code.match(/\s*\) : \([\s\S]*?<\/div>/);
if (ternaryEndMatch) {
  // We need to carefully remove the else block of the ternary
  // The else block is ) : ( <> ...searchProf... </> )} </div>
  const startIdx = code.indexOf(") : (", code.indexOf("Cal-GETC / IGETC エリアから探す"));
  if (startIdx !== -1) {
    // Wait, the ) : ( was replaced by } in the earlier step?
    // Let us just replace the rest of the search area.
  }
}

// Write back
fs.writeFileSync("src/app/ClientPage.tsx", code);


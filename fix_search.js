const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const startStr = "{activeTab === \u0027course\u0027 ? (";
const endStr = "</datalist>";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `<input 
                type="text" 
                list="search-suggestions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="教授名、科目名、分野名を入力"
                className="w-full max-w-3xl mx-auto block bg-transparent border-b border-[#1a162d]/20 py-4 text-3xl md:text-5xl font-serif font-light focus:outline-none focus:border-[#1a162d] transition-colors text-center text-[#1a162d] placeholder:text-[#1a162d]/20"
              />
              <datalist id="search-suggestions">
                {uniqueCourses.map(c => <option key={c} value={c} />)}
                {uniqueProfs.map(p => <option key={p} value={p} />)}
              </datalist>`;
  
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex + endStr.length);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Replaced search area!");
} else {
  console.log("Target not found!");
}


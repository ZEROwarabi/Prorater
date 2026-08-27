const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

// Remove the top-10 slice
code = code.replace(/return Object\.keys\(counts\)\.sort\(\(a, b\) => counts\[b\] - counts\[a\]\)\.slice\(0, 10\);/, "return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);");

const targetStart = `{uniqueCourses.map(subj => (
                      <button`;
const replacement = `                    {Object.entries({
                      "💻 理系・IT (STEM)": ["MATH", "COMSC", "STAT", "PHYS", "PHYSC", "CHEM", "BIOL", "ASTRO", "ENGIN", "OCEAN", "CIS", "PTEC"],
                      "📚 文系・語学 (Humanities)": ["ENGL", "ESL", "HIST", "PHILO", "HUMAN", "SPAN", "SPANISH", "FRANCE", "JAPAN", "CHIN", "ITAL", "SIGN", "COMM", "INTD"],
                      "🌍 社会科学 (Social Sciences)": ["ECON", "PSYC", "PHYCH", "SOCIO", "ANTHR", "POLS", "GEOG", "SOCSC", "ETHNIC", "ADJUS", "ECE"],
                      "💼 ビジネス (Business)": ["BUS", "BUSAC", "BUSMG", "BUSMK", "MARKETING", "ENTERPRENEURSHIP"],
                      "🎨 芸術・デザイン (Arts)": ["ART", "MUSIC", "MUSX", "DRAMA", "ARCHI", "IDSGN", "FTVE", "DANCE"],
                      "💪 体育・その他 (Others)": ["HSCI", "KNACT", "KNICA", "KNCMB", "ENACT", "COUNS", "COUNSELING", "AUSER", "SEARCH", "TUTOR"]
                    }).map(([catName, subjects]) => {
                      const availableSubjs = subjects.filter(s => uniqueCourses.includes(s));
                      if (availableSubjs.length === 0) return null;
                      return (
                        <div key={catName} className="mb-6">
                          <div className="text-center text-[10px] tracking-widest text-[#8c8a99] font-bold mb-3">{catName}</div>
                          <div className="flex flex-wrap justify-center gap-2">
                            {availableSubjs.map(subj => (
                              <button 
                                key={subj}
                                onClick={() => { setSearchCourse(subj); setGeFilter([]); }} 
                                className="px-4 py-1.5 rounded-full border text-xs font-medium tracking-wide transition-colors shadow-sm border-[#1a162d]/15 text-[#3a3845] hover:border-[#1a162d] hover:text-[#1a162d] bg-white/50"
                              >
                                {courseFullNames[subj] || subj}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {/* Catch all remaining subjects not in categories */}
                    {(() => {
                      const categorized = ["MATH", "COMSC", "STAT", "PHYS", "PHYSC", "CHEM", "BIOL", "ASTRO", "ENGIN", "OCEAN", "CIS", "PTEC", "ENGL", "ESL", "HIST", "PHILO", "HUMAN", "SPAN", "SPANISH", "FRANCE", "JAPAN", "CHIN", "ITAL", "SIGN", "COMM", "INTD", "ECON", "PSYC", "PHYCH", "SOCIO", "ANTHR", "POLS", "GEOG", "SOCSC", "ETHNIC", "ADJUS", "ECE", "BUS", "BUSAC", "BUSMG", "BUSMK", "MARKETING", "ENTERPRENEURSHIP", "ART", "MUSIC", "MUSX", "DRAMA", "ARCHI", "IDSGN", "FTVE", "DANCE", "HSCI", "KNACT", "KNICA", "KNCMB", "ENACT", "COUNS", "COUNSELING", "AUSER", "SEARCH", "TUTOR"];
                      const others = uniqueCourses.filter(s => !categorized.includes(s));
                      if (others.length === 0) return null;
                      return (
                        <div className="mb-6">
                          <div className="text-center text-[10px] tracking-widest text-[#8c8a99] font-bold mb-3">その他未分類</div>
                          <div className="flex flex-wrap justify-center gap-2">
                            {others.map(subj => (
                              <button 
                                key={subj}
                                onClick={() => { setSearchCourse(subj); setGeFilter([]); }} 
                                className="px-4 py-1.5 rounded-full border text-xs font-medium tracking-wide transition-colors shadow-sm border-[#1a162d]/15 text-[#3a3845] hover:border-[#1a162d] hover:text-[#1a162d] bg-white/50"
                              >
                                {courseFullNames[subj] || subj}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
`;

const lines = code.split("\\n");
let startIdx = -1;
let endIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{uniqueCourses.map(subj => (")) {
    startIdx = i;
  }
  if (startIdx !== -1 && i > startIdx && lines[i].includes("))}")) {
    endIdx = i;
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx + 1, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", lines.join("\\n"));
  console.log("Updated categories!");
} else {
  console.log("Could not find array map loop");
}


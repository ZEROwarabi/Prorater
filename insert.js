const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const target = `{(!searchCourse && geFilter.length === 0) ? (

                  <div className="text-center mb-6 text-xs tracking-[0.2em] text-[#5a5866] font-medium uppercase">Cal-GETC / IGETC エリアから探す</div>`;

const replacement = `{(!searchCourse && geFilter.length === 0) ? (
                <div className="mt-12 animate-fade-in-up">
                  <div className="text-center mb-6 text-xs tracking-[0.2em] text-[#5a5866] font-medium uppercase">主要な分野から探す</div>
                  
                  <div className="w-full max-w-5xl mx-auto px-4 mb-10">
                    {Object.entries({
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
                        <div key={catName} className="mb-8">
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
                    
                    {(() => {
                      const categorized = ["MATH", "COMSC", "STAT", "PHYS", "PHYSC", "CHEM", "BIOL", "ASTRO", "ENGIN", "OCEAN", "CIS", "PTEC", "ENGL", "ESL", "HIST", "PHILO", "HUMAN", "SPAN", "SPANISH", "FRANCE", "JAPAN", "CHIN", "ITAL", "SIGN", "COMM", "INTD", "ECON", "PSYC", "PHYCH", "SOCIO", "ANTHR", "POLS", "GEOG", "SOCSC", "ETHNIC", "ADJUS", "ECE", "BUS", "BUSAC", "BUSMG", "BUSMK", "MARKETING", "ENTERPRENEURSHIP", "ART", "MUSIC", "MUSX", "DRAMA", "ARCHI", "IDSGN", "FTVE", "DANCE", "HSCI", "KNACT", "KNICA", "KNCMB", "ENACT", "COUNS", "COUNSELING", "AUSER", "SEARCH", "TUTOR"];
                      const others = uniqueCourses.filter(s => !categorized.includes(s));
                      if (others.length === 0) return null;
                      return (
                        <div className="mb-8">
                          <div className="text-center text-[10px] tracking-widest text-[#8c8a99] font-bold mb-3">その他</div>
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
                      );
                    })()}
                  </div>

                  <div className="text-center mb-6 text-xs tracking-[0.2em] text-[#5a5866] font-medium uppercase">Cal-GETC / IGETC エリアから探す</div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Inserted correctly!");
} else {
  console.log("Target not found!");
}


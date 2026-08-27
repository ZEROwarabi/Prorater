const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const targetStart = "{/* Quick Tags Section";
const lines = code.split("\n");
const startIndex = lines.findIndex(l => l.includes(targetStart));

let endIndex = -1;
for (let i = startIndex; i < lines.length; i++) {
  if (lines[i].includes("</>") && lines[i+1] && lines[i+1].includes(")}")) {
    endIndex = i + 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `              {/* Quick Tags Section */}
              {(!searchCourse && geFilter.length === 0) ? (
                <div className="mt-12 animate-fade-in-up">
                  <div className="text-center mb-6 text-xs tracking-[0.2em] text-[#5a5866] font-medium uppercase">主要な分野から探す</div>
                  <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-4xl mx-auto px-4">
                    {uniqueCourses.map(subj => (
                      <button 
                        key={subj}
                        onClick={() => { setSearchCourse(subj); setGeFilter([]); }} 
                        className="px-5 py-2 rounded-full border text-xs font-medium tracking-wide transition-colors shadow-sm border-[#1a162d]/15 text-[#3a3845] hover:border-[#1a162d] hover:text-[#1a162d] bg-white/50"
                      >
                        {courseFullNames[subj] || subj}
                      </button>
                    ))}
                  </div>

                  <div className="text-center mb-6 text-xs tracking-[0.2em] text-[#5a5866] font-medium uppercase">Cal-GETC / IGETC エリアから探す</div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { label: \u0027Area 1 (English)\u0027, keywords: [\u0027ENGL\u0027, \u0027COMM\u0027] },
                      { label: \u0027Area 2 (Math)\u0027, keywords: [\u0027MATH\u0027, \u0027BUS\u0027, \u0027STAT\u0027, \u0027BUSAC\u0027] },
                      { label: \u0027Area 3 (Arts & Humanities)\u0027, keywords: [\u0027ART\u0027, \u0027ARTHS\u0027, \u0027MUSIC\u0027, \u0027DRAMA\u0027, \u0027HIST\u0027, \u0027HUMAN\u0027, \u0027PHILO\u0027, \u0027ENGL\u0027, \u0027SPAN\u0027, \u0027JAPAN\u0027, \u0027JAPN\u0027] },
                      { label: \u0027Area 4 (Social Sciences)\u0027, keywords: [\u0027ANTHR\u0027, \u0027ECON\u0027, \u0027SOCIO\u0027, \u0027POLS\u0027, \u0027PSYCH\u0027, \u0027PSYC\u0027, \u0027HIST\u0027, \u0027GEOG\u0027, \u0027ETHNIC\u0027, \u0027ETHN\u0027] },
                      { label: \u0027Area 5A (Physical Sciences)\u0027, keywords: [\u0027ASTRO\u0027, \u0027CHEM\u0027, \u0027GEOG\u0027, \u0027GEOL\u0027, \u0027OCEAN\u0027, \u0027PHYS\u0027, \u0027PHYSC\u0027] },
                      { label: \u0027Area 5B (Biological Sciences)\u0027, keywords: [\u0027ANTHR\u0027, \u0027BIOSC\u0027, \u0027BIOL\u0027, \u0027PSYC\u0027, \u0027PSYCH\u0027] },
                      { label: \u0027Area 6 (Ethnic Studies)\u0027, keywords: [\u0027ETHNIC\u0027, \u0027ETHN\u0027] },
                    ].map(area => (
                      <button 
                        key={area.label}
                        onClick={() => { setSearchCourse(""); setGeFilter(area.keywords); }} 
                        className="px-5 py-2 rounded-full border text-xs font-medium tracking-wide transition-colors shadow-sm border-[#1a162d]/15 text-[#3a3845] hover:bg-[#1a162d] hover:border-[#1a162d] hover:text-white bg-white/50"
                      >
                        {area.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex justify-center animate-fade-in-up">
                  <button 
                    onClick={() => { setSearchCourse(""); setGeFilter([]); }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#1a162d] bg-[#1a162d] text-white text-xs font-bold tracking-widest transition-all hover:bg-transparent hover:text-[#1a162d] shadow-sm hover:shadow"
                  >
                    <X size={14} />
                    <span>フィルターをクリア</span>
                  </button>
                </div>
              )}
            </>
          )}`;
  
  lines.splice(startIndex, endIndex - startIndex + 1, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", lines.join("\n"));
  console.log("Fixed tags UI!");
} else {
  console.log("Target not found", startIndex, endIndex);
}


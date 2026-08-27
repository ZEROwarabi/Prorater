const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const targetRegex = /<div key=\{searchQuery \+ geFilter\.join\(\x27,\x27\)\} className="animate-fade-in-up flex flex-col lg:flex-row items-start gap-12" style=\{\{ animationDuration: \x270\.8s\x27 \}\}>[\s\S]*?\{\/\* Right Content Area \*\/\}\s*<div className="flex-1 min-w-0 w-full space-y-32">/;

const replacement = `<div key={searchQuery + geFilter.join(\u0027,\u0027)} className="animate-fade-in-up flex flex-col gap-12" style={{ animationDuration: \u00270.8s\u0027 }}>
                  {/* Sticky Top Tabs */}
                  {Object.keys(courseGrouped).length > 1 && (
                    <div className="w-full sticky top-0 z-40 bg-[#ecebe8]/90 backdrop-blur-md py-4 -mx-6 px-6 lg:-mx-12 lg:px-12 border-b border-[#1a162d]/10 flex gap-3 overflow-x-auto scrollbar-hide shadow-sm">
                      {Object.keys(courseGrouped).sort().map(course => (
                        <button
                          key={course}
                          onClick={() => setActiveCourseTab(course)}
                          className={\`shrink-0 px-6 py-3 text-sm font-bold tracking-widest rounded-full transition-all whitespace-nowrap flex items-center gap-3 \${activeCourseTab === course ? \u0027bg-[#1a162d] text-white shadow-md\u0027 : \u0027bg-white/60 text-[#8c8a99] hover:bg-white hover:shadow hover:text-[#1a162d]\u0027}\`}
                        >
                          <span>{course}</span>
                          <span className={\`text-[10px] font-sans px-2 py-0.5 rounded-full \${activeCourseTab === course ? \u0027bg-white/20 text-white\u0027 : \u0027bg-[#1a162d]/5 text-[#8c8a99]\u0027}\`}>
                            {Object.keys(courseGrouped[course]).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Content Area */}
                  <div className="w-full space-y-32">`;

if (code.match(targetRegex)) {
  code = code.replace(targetRegex, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Fixed tabs to horizontal sticky!");
} else {
  console.log("Regex not matched!");
}


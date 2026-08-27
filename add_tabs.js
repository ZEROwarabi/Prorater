const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const targetRegex = /<div key=\{searchQuery \+ geFilter\.join\(\x27,\x27\)\} className="space-y-32 animate-fade-in-up" style=\{\{ animationDuration: \x270\.8s\x27 \}\}>\s*\{Object\.entries\(courseGrouped\)\.map\(\(\[course, profGroups\]\) => \{/;

const replacement = `<div key={searchQuery + geFilter.join(\u0027,\u0027)} className="animate-fade-in-up flex flex-col lg:flex-row items-start gap-12" style={{ animationDuration: \u00270.8s\u0027 }}>
                  {/* Left Sidebar (Tabs) */}
                  {Object.keys(courseGrouped).length > 1 && (
                    <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-8 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                      <div className="text-xs font-bold tracking-widest text-[#8c8a99] mb-4 uppercase px-4 hidden lg:block">科目を選択</div>
                      {Object.keys(courseGrouped).sort().map(course => (
                        <button
                          key={course}
                          onClick={() => setActiveCourseTab(course)}
                          className={\`px-4 py-3 text-left text-sm font-bold tracking-widest rounded-xl transition-all whitespace-nowrap flex justify-between items-center \${activeCourseTab === course ? \u0027bg-[#1a162d] text-white shadow-md\u0027 : \u0027bg-transparent text-[#8c8a99] hover:bg-white hover:shadow hover:text-[#1a162d]\u0027}\`}
                        >
                          <span>{course}</span>
                          <span className={\`text-xs font-sans \${activeCourseTab === course ? \u0027opacity-80\u0027 : \u0027opacity-60\u0027}\`}>
                            {Object.keys(courseGrouped[course]).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Right Content Area */}
                  <div className="flex-1 min-w-0 w-full space-y-32">
                    {Object.entries(courseGrouped)
                      .filter(([course]) => Object.keys(courseGrouped).length <= 1 || course === activeCourseTab)
                      .map(([course, profGroups]) => {`;

if (code.match(targetRegex)) {
  code = code.replace(targetRegex, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Added tabs!");
} else {
  console.log("Regex not matched!");
}


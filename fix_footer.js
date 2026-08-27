const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const targetRegex = /<div className="flex flex-col items-center gap-2 max-w-sm mx-auto">[\s\S]*?<\/div>/;

const replacement = `<div className="flex flex-col gap-3 max-w-lg mx-auto">
            {Object.entries(
              initialData.reduce((acc, r) => {
                const match = String(r.term || "").match(/(\\d{4})\\s+(Spring|Summer|Fall|Winter)/i);
                if (match) {
                  const year = match[1];
                  const season = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase();
                  if (!acc[year]) acc[year] = {};
                  acc[year][season] = (acc[year][season] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, Record<string, number>>)
            ).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(([year, seasons]) => {
              const seasonOrder: Record<string, number> = { "Fall": 4, "Summer": 3, "Spring": 2, "Winter": 1 };
              const sortedSeasons = Object.entries(seasons).sort((a, b) => seasonOrder[b[0]] - seasonOrder[a[0]]);
              return (
                <div key={year} className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1a162d]/10 pb-1.5 px-2 gap-1 md:gap-4">
                  <span className="font-bold text-[#1a162d] text-[11px] tracking-widest text-left md:text-center w-12">{year}</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 justify-end flex-1">
                    {sortedSeasons.map(([season, count]) => (
                      <span key={season} className="text-[10px] tracking-widest text-[#5a5866]">
                        {season} <strong className="text-[#1a162d]">{count}</strong><span className="text-[9px]">件</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Footer updated!");


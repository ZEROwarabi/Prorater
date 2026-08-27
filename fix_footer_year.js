const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const targetRegex = /<div className="flex flex-col gap-3 max-w-lg mx-auto">[\s\S]*?<\/footer>/;

const replacement = `<div className="flex flex-col gap-1 max-w-[200px] mx-auto">
            {Object.entries(
              initialData.reduce((acc, r) => {
                const match = String(r.term || "").match(/(\\d{4})\\s+(Spring|Summer|Fall|Winter)/i);
                if (match) {
                  const year = match[1];
                  acc[year] = (acc[year] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(([year, count]) => (
              <div key={year} className="flex justify-between items-center border-b border-[#1a162d]/10 pb-1.5 px-2">
                <span className="font-bold text-[#1a162d] text-[11px] tracking-widest">{year}</span>
                <span className="text-[10px] tracking-widest text-[#5a5866]">
                  <strong className="text-[#1a162d]">{String(count)}</strong><span className="text-[9px] ml-1">件</span>
                </span>
              </div>
            ))}
          </div>
        </footer>`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Footer updated to year only!");


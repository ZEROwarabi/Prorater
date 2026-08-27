const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

// 1. Change h-[480px] to min-h-[480px] h-full
code = code.replace(
  /className="flex flex-col group relative h-\[480px\] bg-white\/40 p-8 border border-\[#1a162d\]\/5 hover:border-\[#1a162d\]\/20 transition-all rounded-3xl shadow-sm cursor-pointer hover:shadow-md"/,
  \`className="flex flex-col group relative min-h-[480px] h-full bg-white/40 p-8 border border-[#1a162d]/5 hover:border-[#1a162d]/20 transition-all rounded-3xl shadow-sm cursor-pointer hover:shadow-md"\`
);

// 2. Remove button from header and simplify header
const headerRegex = /<div className="flex justify-between items-start mb-6 border-b border-\[#1a162d\]\/10 pb-4 gap-4 relative">\\s*<div className="flex-1 min-w-0">\\s*<h4[\\s\\S]*?<\/div>\\s*\{\/\* Compare Action \*\/\}[\\s\\S]*?<\/button>\\s*<\/div>/;

const newHeader = `<div className="mb-6 border-b border-[#1a162d]/10 pb-4 relative">
          <h4 
            onClick={() => setSelectedProfDetails({ profName, reviews })}
            className="text-3xl font-serif text-[#1a162d] cursor-pointer hover:text-[#5a5866] transition-colors leading-tight break-words"
          >
            {profName}
          </h4>
          <div className="mt-2 text-xs text-[#8c8a99] tracking-widest">
            {reviews.length}件のレビュー
          </div>
        </div>`;

code = code.replace(headerRegex, newHeader);

// 3. Add button to footer
const footerRegex = /<div className="text-right mt-3 pt-3 border-t border-\[#1a162d\]\/10 shrink-0 cursor-pointer" onClick=\{\(\) => setSelectedProfDetails\(\{ profName, reviews \}\)\}>\\s*<span className="text-xs uppercase tracking-widest text-\[#1a162d\] font-bold hover:text-\[#5a5866\] transition-colors">詳細をすべて見る &rarr;<\/span>\\s*<\/div>/;

const newFooter = `<div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1a162d]/10 shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleCompare(profName, reviews); }}
            className={\`px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest transition-all z-10 flex items-center gap-2 \${isComparing ? \u0027bg-[#1a162d] border-[#1a162d] text-white shadow-md\u0027 : \u0027bg-white border-[#1a162d]/20 text-[#5a5866] hover:border-[#1a162d] hover:text-[#1a162d] hover:bg-gray-50\u0027}\`}
          >
            {isComparing ? (
              <>
                <Check size={12} strokeWidth={3} />
                <span>比較中</span>
              </>
            ) : (
              <>
                <Plus size={12} strokeWidth={3} />
                <span>比較する</span>
              </>
            )}
          </button>
          <div className="cursor-pointer" onClick={() => setSelectedProfDetails({ profName, reviews })}>
            <span className="text-sm uppercase tracking-widest text-[#1a162d] font-bold hover:text-[#5a5866] transition-colors">詳細を見る &rarr;</span>
          </div>
        </div>`;

code = code.replace(footerRegex, newFooter);

fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Moved button and updated height!");


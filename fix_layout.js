const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const targetRegex = /\{\/\* Compare Action \*\/\}\s*<button[\s\S]*?<\/button>\s*<div className="mb-6 border-b border-\[#1a162d\]\/10 pb-4 pr-12 relative">\s*<h4[\s\S]*?<\/div>/;

const replacement = `<div className="flex justify-between items-start mb-6 border-b border-[#1a162d]/10 pb-4 gap-4 relative">
          <div className="flex-1 min-w-0">
            <h4 
              onClick={() => setSelectedProfDetails({ profName, reviews })}
              className="text-3xl font-serif text-[#1a162d] cursor-pointer hover:text-[#5a5866] transition-colors leading-tight break-words"
            >
              {profName}
            </h4>
            <div className="mt-2 text-xs text-[#8c8a99] tracking-widest">
              {reviews.length}件のレビュー
            </div>
          </div>
          
          {/* Compare Action */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleCompare(profName, reviews); }}
            className={\`shrink-0 px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest transition-all z-10 flex items-center gap-2 \${isComparing ? \u0027bg-[#1a162d] border-[#1a162d] text-white shadow-md\u0027 : \u0027bg-white border-[#1a162d]/20 text-[#5a5866] hover:border-[#1a162d] hover:text-[#1a162d] hover:bg-gray-50\u0027}\`}
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
        </div>`;

if (code.match(targetRegex)) {
  code = code.replace(targetRegex, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Fixed layout!");
} else {
  console.log("Could not find regex!");
}


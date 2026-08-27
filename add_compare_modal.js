const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const targetRegex = /<div className="mb-12 border-b border-\[#1a162d\]\/10 pb-8">\s*<h2 className="text-5xl md:text-7xl font-serif text-\[#1a162d\]">\{selectedProfDetails\.profName\}<\/h2>\s*<div className="mt-4 text-sm tracking-\[0\.2em\] text-\[#8c8a99\] uppercase">全 \{selectedProfDetails\.reviews\.length\} 件のレビュー<\/div>\s*<\/div>/;

const replacement = `<div className="mb-12 border-b border-[#1a162d]/10 pb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h2 className="text-5xl md:text-7xl font-serif text-[#1a162d] break-words">{selectedProfDetails.profName}</h2>
                  <div className="mt-4 text-sm tracking-[0.2em] text-[#8c8a99] uppercase">全 {selectedProfDetails.reviews.length} 件のレビュー</div>
                </div>
                {(() => {
                  const isComparing = compareList.some(p => p.profName === selectedProfDetails.profName);
                  return (
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleCompare(selectedProfDetails.profName, selectedProfDetails.reviews); }}
                      className={\`shrink-0 px-6 py-2.5 rounded-full border text-sm font-bold tracking-widest transition-all z-10 flex items-center justify-center gap-2 w-fit \${isComparing ? \u0027bg-[#1a162d] border-[#1a162d] text-white shadow-md\u0027 : \u0027bg-transparent border-[#1a162d]/20 text-[#5a5866] hover:border-[#1a162d] hover:text-[#1a162d]\u0027}\`}
                    >
                      {isComparing ? (
                        <>
                          <Check size={16} strokeWidth={3} />
                          <span>比較中</span>
                        </>
                      ) : (
                        <>
                          <Plus size={16} strokeWidth={3} />
                          <span>比較リストに追加</span>
                        </>
                      )}
                    </button>
                  );
                })()}
              </div>`;

if (code.match(targetRegex)) {
  code = code.replace(targetRegex, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Added compare button to modal!");
} else {
  console.log("Could not find regex!");
}


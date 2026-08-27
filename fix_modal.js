const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const targetStart = "              {/* Right Column: Rating Distribution */}";
const lines = code.split("\n");
let startIdx = lines.findIndex(l => l.includes(targetStart));
let endIdx = -1;

for (let i = startIdx; i < lines.length; i++) {
  if (lines[i].includes("総レビュー数:") || lines[i].includes("総レビュー数")) {
    // skip forward to the end of the div
    endIdx = i + 2;
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `              {/* Right Column: Rating Distribution */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-xs tracking-widest text-[#1a162d] uppercase whitespace-nowrap">評価分布</h3>
                  <div className="flex-1 h-[1px] bg-[#1a162d]/10"></div>
                  <div className="flex gap-2">
                    <button onClick={() => setModalTab(\u0027easy\u0027)} className={\`text-[10px] px-3 py-1 rounded-full border transition-colors \${modalTab === \u0027easy\u0027 ? \u0027bg-[#1a162d] text-white border-[#1a162d]\u0027 : \u0027text-[#8c8a99] border-[#1a162d]/20 hover:border-[#1a162d] hover:text-[#1a162d]\u0027}\`}>Aの易しさ</button>
                    <button onClick={() => setModalTab(\u0027prof\u0027)} className={\`text-[10px] px-3 py-1 rounded-full border transition-colors \${modalTab === \u0027prof\u0027 ? \u0027bg-[#1a162d] text-white border-[#1a162d]\u0027 : \u0027text-[#8c8a99] border-[#1a162d]/20 hover:border-[#1a162d] hover:text-[#1a162d]\u0027}\`}>教授の質</button>
                    <button onClick={() => setModalTab(\u0027cls\u0027)} className={\`text-[10px] px-3 py-1 rounded-full border transition-colors \${modalTab === \u0027cls\u0027 ? \u0027bg-[#1a162d] text-white border-[#1a162d]\u0027 : \u0027text-[#8c8a99] border-[#1a162d]/20 hover:border-[#1a162d] hover:text-[#1a162d]\u0027}\`}>授業の質</button>
                  </div>
                </div>
                <div className="space-y-4">
                  {(() => {
                    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                    let totalValid = 0;
                    selectedProfDetails.reviews.forEach(r => {
                      let rawVal = 0;
                      if (modalTab === \u0027easy\u0027) rawVal = r.ratingEasy;
                      else if (modalTab === \u0027prof\u0027) rawVal = r.ratingProf;
                      else if (modalTab === \u0027cls\u0027) rawVal = r.ratingClass;
                      
                      const val = Math.round(rawVal);
                      if (val >= 1 && val <= 5) {
                        dist[val]++;
                        totalValid++;
                      }
                    });
                    
                    const labels = { 5: \u0027最高\u0027, 4: \u0027良い\u0027, 3: \u0027普通\u0027, 2: \u0027微妙\u0027, 1: \u0027最悪\u0027 };
                    
                    return [5, 4, 3, 2, 1].map(score => {
                      const count = dist[score];
                      const percentage = totalValid > 0 ? (count / totalValid) * 100 : 0;
                      return (
                        <div key={score} className="flex items-center gap-4 group">
                          <div className="w-16 text-right shrink-0">
                            <span className="text-xs font-medium text-[#1a162d]">{score}</span>
                            <span className="text-[10px] text-[#8c8a99] ml-2">{labels[score]}</span>
                          </div>
                          <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden border border-[#1a162d]/5">
                            <div 
                              className="h-full bg-[#1a162d] rounded-full transition-all duration-1000 ease-out group-hover:bg-[#3a3845]"
                              style={{ width: \`\${percentage}%\` }}
                            ></div>
                          </div>
                          <div className="w-6 text-right text-xs font-serif text-[#1a162d]">{count}</div>
                        </div>
                      );
                    });
                  })()}
                  <div className="text-[10px] text-right mt-6 tracking-widest text-[#8c8a99]">
                    総レビュー数: {selectedProfDetails.reviews.length}件
                  </div>
                </div>
              </div>`;

  lines.splice(startIdx, endIdx - startIdx + 1, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", lines.join("\n"));
  console.log("Fixed tabs!");
} else {
  console.log("Target not found", startIdx, endIdx);
}


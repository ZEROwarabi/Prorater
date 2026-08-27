const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const target = `              )}
            </>
          )}
        </div>`;

const replacement = `              )}
            </>
          ) : (
            <>
              <input 
                type="text" 
                list="profs"
                value={searchProf}
                onChange={(e) => setSearchProf(e.target.value)}
                placeholder="教授の名前を入力"
                className="w-full bg-transparent border-b border-[#1a162d]/20 py-4 text-3xl md:text-5xl font-serif font-light focus:outline-none focus:border-[#1a162d] transition-colors text-center text-[#1a162d] placeholder:text-[#1a162d]/20"
              />
              <datalist id="profs">
                {uniqueProfs.map(p => <option key={p} value={p} />)}
              </datalist>
            </>
          )}
        </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Fixed syntax error!");
} else {
  console.log("Target not found!");
}


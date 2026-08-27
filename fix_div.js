const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const t = /<\/div>\s*\);\s*\}\)}\s*<\/div>\s*\)\}/;

const r = `                    </div>
                  );
                })}
                </div>
              </div>
            )}`;

if (code.match(t)) {
  code = code.replace(t, r);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Fixed!");
} else {
  console.log("Not found");
}

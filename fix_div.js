const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

code = code.replace(
\`                    </div>
                  );
                })}
              </div>
            )}\`,
\`                    </div>
                  );
                })}
                </div>
              </div>
            )}\`
);

fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Fixed extra div!");


const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

code = code.replace(/{term} : <span className="font-bold text-\\[#1a162d\\]">{count}<\/span>件/g, "{String(term)} : <span className=\\"font-bold text-[#1a162d]\\">{String(count)}</span>件");

fs.writeFileSync("src/app/ClientPage.tsx", code);


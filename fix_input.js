const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

code = code.replace(/list="search-suggestions"/g, "autoComplete=\"off\"");

const start = code.indexOf("<datalist id=\"search-suggestions\">");
const end = code.indexOf("</datalist>") + "</datalist>".length;
if(start !== -1 && end !== -1) {
  code = code.substring(0, start) + code.substring(end);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Fixed!");
} else {
  console.log("Not found");
}

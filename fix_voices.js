const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const targetRegex = /\{selectedProfDetails\.reviews\.filter\(r => r\.comment\)\.map\(\(r, i\) => \(/;

const replacement = `{selectedProfDetails.reviews
                      .filter(r => r.comment && r.comment.trim().length > 1)
                      .filter((r, i, arr) => arr.findIndex(x => x.comment === r.comment) === i)
                      .map((r, i) => (`;

if (code.match(targetRegex)) {
  code = code.replace(targetRegex, replacement);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Deduplicated comments!");
} else {
  console.log("Could not find regex!");
}


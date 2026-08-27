const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

code = code.replace(/useState<SortOption>\(\u0027easy\u0027\)/g, "useState<SortOption>(\u0027easyRating\u0027)");
code = code.replace(/{courseFullNames\[subj\] \|\| subj}/g, "{String(courseFullNames[subj as keyof typeof courseFullNames] || subj)}");
code = code.replace(/dist\[val\]\+\+;/g, "dist[val as keyof typeof dist]++;");
code = code.replace(/const count = dist\[score\];/g, "const count = dist[score as keyof typeof dist];");
code = code.replace(/labels\[score\]/g, "labels[score as keyof typeof labels]");

fs.writeFileSync("src/app/ClientPage.tsx", code);


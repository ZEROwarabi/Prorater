const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

// 1. Change default sorting state
code = code.replace(/useState<SortOption>\(\u0027easyRating\u0027\)/, "useState<SortOption>(\u0027reviews\u0027)");

// 2. We need a helper to get term score
const helper = `
  const getTermScore = (term: string) => {
    const match = String(term || "").match(/(\\d{4})\\s+(Spring|Summer|Fall|Winter)/i);
    if (!match) return 0;
    const year = parseInt(match[1]);
    const seasonStr = match[2].toLowerCase();
    let season = 0;
    if (seasonStr === "spring") season = 1;
    else if (seasonStr === "summer") season = 2;
    else if (seasonStr === "fall") season = 3;
    else if (seasonStr === "winter") season = 4;
    return year * 10 + season;
  };
`;

code = code.replace("  const calculateAverages = (reviews: Review[]) => {", helper + "\\n  const calculateAverages = (reviews: Review[]) => {");

// 3. Inner parseTerm replacement
const innerParseTerm = /const parseTerm = \(t: string\) => \{[\s\S]*?return \{ year, season \};\s*\};\s*const termA = parseTerm\(a\.term\);\s*const termB = parseTerm\(b\.term\);\s*if \(termB\.year !== termA\.year\) return termB\.year - termA\.year;\s*return termB\.season - termA\.season;/g;
code = code.replace(innerParseTerm, `const scoreA = getTermScore(a.term);
                          const scoreB = getTermScore(b.term);
                          return scoreB - scoreA;`);

// 4. Tie-breaker for reviews sort
code = code.replace(/if \(sortBy === \u0027reviews\u0027\) return b\.reviews\.length - a\.reviews\.length;/g, `if (sortBy === \u0027reviews\u0027) {
                          if (b.reviews.length !== a.reviews.length) return b.reviews.length - a.reviews.length;
                          const latestA = a.reviews[0] ? getTermScore(a.reviews[0].term) : 0;
                          const latestB = b.reviews[0] ? getTermScore(b.reviews[0].term) : 0;
                          return latestB - latestA;
                        }`);

fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Fixed sorting logic!");


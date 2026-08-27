const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

code = code.replace(/<span className="absolute -right-8 top-1/g, `<span className="absolute -right-8 bottom-1`);

code = code.replace(/<div className="w-full max-w-5xl mx-auto px-4 mb-10">/g, `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 w-full max-w-5xl mx-auto px-4 mb-16">`);

code = code.replace(/<div key={catName} className="mb-8">/g, `<div key={catName} className="flex flex-col">`);
code = code.replace(/<div className="text-center text-\\[10px\\] tracking-widest text-\\[#8c8a99\\] font-bold mb-3">{catName}<\\/div>/g, `<div className="text-left text-[10px] tracking-widest text-[#8c8a99] font-bold mb-3">{catName}</div>`);
code = code.replace(/<div className="flex flex-wrap justify-center gap-2">/g, `<div className="flex flex-wrap justify-start gap-2">`);

code = code.replace(/<div className="mb-8">\\s*<div className="text-center text-\\[10px\\] tracking-widest text-\\[#8c8a99\\] font-bold mb-3">その他<\\/div>/, `<div className="flex flex-col">\n                          <div className="text-left text-[10px] tracking-widest text-[#8c8a99] font-bold mb-3">その他</div>`);

code = code.replace(/<div className="space-y-32">/g, `<div className="space-y-32 animate-fade-in-up" style={{ animationDuration: \u00270.8s\u0027 }}>`);

fs.writeFileSync("src/app/ClientPage.tsx", code);


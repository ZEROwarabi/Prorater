const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const oldBtnClass = "className={\`shrink-0 px-6 py-3 text-sm font-bold tracking-widest rounded-full transition-all whitespace-nowrap flex items-center gap-3 \${activeCourseTab === course ? \x27bg-[#1a162d] text-white shadow-md\x27 : \x27bg-white/60 text-[#8c8a99] hover:bg-white hover:shadow hover:text-[#1a162d]\x27}\`}";
const newBtnClass = "className={\`shrink-0 px-6 py-3 text-sm font-bold tracking-widest rounded-full transition-all duration-300 whitespace-nowrap flex items-center gap-3 \${activeCourseTab === course ? \x27bg-white/80 backdrop-blur-md text-[#1a162d] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60\x27 : \x27bg-transparent text-[#8c8a99] hover:bg-white/50 hover:text-[#1a162d]\x27}\`}";

const oldBadgeClass = "className={\`text-[10px] font-sans px-2 py-0.5 rounded-full \${activeCourseTab === course ? \x27bg-white/20 text-white\x27 : \x27bg-[#1a162d]/5 text-[#8c8a99]\x27}\`}";
const newBadgeClass = "className={\`text-[10px] font-sans px-2 py-0.5 rounded-full \${activeCourseTab === course ? \x27bg-[#1a162d]/10 text-[#1a162d] font-bold\x27 : \x27bg-[#1a162d]/5 text-[#8c8a99]\x27}\`}";

if (code.includes(oldBtnClass) && code.includes(oldBadgeClass)) {
  code = code.replace(oldBtnClass, newBtnClass);
  code = code.replace(oldBadgeClass, newBadgeClass);
  fs.writeFileSync("src/app/ClientPage.tsx", code);
  console.log("Fixed style!");
} else {
  console.log("Not found!");
}


const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

// 1. Add modalMounted state
if (!code.includes("const [modalMounted")) {
  code = code.replace(
    /const \[modalTab, setModalTab\] = useState<\u0027easy\u0027\|\u0027prof\u0027\|\u0027cls\u0027>\(\u0027easy\u0027\);/,
    `const [modalTab, setModalTab] = useState<\u0027easy\u0027|\u0027prof\u0027|\u0027cls\u0027>(\u0027easy\u0027);\n  const [modalMounted, setModalMounted] = useState(false);\n\n  useEffect(() => {\n    if (selectedProfDetails) {\n      const t = setTimeout(() => setModalMounted(true), 50);\n      return () => clearTimeout(t);\n    } else {\n      setModalMounted(false);\n    }\n  }, [selectedProfDetails]);`
  );
}

// 2. Change width logic in the modal
code = code.replace(
  /className="h-full bg-\[#1a162d\] rounded-full transition-all duration-1000 ease-out group-hover:bg-\[#3a3845\]"\s*style=\{\{ width: `\$\{percentage\}%` \}\}/g,
  `className="h-full bg-[#1a162d] rounded-full transition-all duration-1000 ease-out group-hover:bg-[#3a3845]"
                                style={{ width: modalMounted ? \`\${percentage}%\` : \u00270%\u0027 }}`
);

fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Fixed modal anim");


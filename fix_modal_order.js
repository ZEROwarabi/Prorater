const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

// Remove it from the top
code = code.replace(/const \[modalMounted, setModalMounted\] = useState\(false\);\s*useEffect\(\(\) => \{\s*if \(selectedProfDetails\) \{\s*const t = setTimeout\(\(\) => setModalMounted\(true\), 50\);\s*return \(\) => clearTimeout\(t\);\s*\} else \{\s*setModalMounted\(false\);\s*\}\s*\}, \[selectedProfDetails\]\);/, "");

// Add it below selectedProfDetails
code = code.replace(
  /const \[selectedProfDetails, setSelectedProfDetails\] = useState<\{profName: string, reviews: Review\[\]\} \| null>\(null\);/,
  `const [selectedProfDetails, setSelectedProfDetails] = useState<{profName: string, reviews: Review[]} | null>(null);\n  const [modalMounted, setModalMounted] = useState(false);\n\n  useEffect(() => {\n    if (selectedProfDetails) {\n      const t = setTimeout(() => setModalMounted(true), 50);\n      return () => clearTimeout(t);\n    } else {\n      setModalMounted(false);\n    }\n  }, [selectedProfDetails]);`
);

fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Fixed order!");


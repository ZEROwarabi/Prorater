const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

const target = `export default function ClientPage({ initialData }: { initialData: Review[] }) {`;

const replacement = `export default function ClientPage({ initialData: rawData }: { initialData: Review[] }) {
  // Fix typos on the fly
  const initialData = useMemo(() => {
    return rawData.map(r => {
      let p = r.profName || "";
      if (p === "Elizabeth Matlook") p = "Elizabeth Matlock";
      return { ...r, profName: p };
    });
  }, [rawData]);`;

code = code.replace(target, replacement);
fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Fixed typo!");


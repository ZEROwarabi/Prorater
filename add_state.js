const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

code = code.replace(
  `  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>(\x27reviews\x27);
  const [geFilter, setGeFilter] = useState<string[]>([]);`,
  `  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>(\x27reviews\x27);
  const [activeCourseTab, setActiveCourseTab] = useState<string | null>(null);
  const [geFilter, setGeFilter] = useState<string[]>([]);`
);

code = code.replace(
  `    return groups;
  }, [filteredData]);

  const profGrouped = useMemo(() => {`,
  `    return groups;
  }, [filteredData]);

  useEffect(() => {
    const keys = Object.keys(courseGrouped);
    if (keys.length > 0 && (!activeCourseTab || !keys.includes(activeCourseTab))) {
      setActiveCourseTab(keys[0]);
    } else if (keys.length === 0) {
      setActiveCourseTab(null);
    }
  }, [courseGrouped, activeCourseTab]);

  const profGrouped = useMemo(() => {`
);

fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Added state!");


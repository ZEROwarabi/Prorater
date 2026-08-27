const fs = require("fs");
let css = fs.readFileSync("src/app/globals.css", "utf8");

if (!css.includes("fade-in-up")) {
  css += `\n
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;
  fs.writeFileSync("src/app/globals.css", css);
  console.log("Added fade-in-up to globals.css");
} else {
  console.log("Already exists");
}


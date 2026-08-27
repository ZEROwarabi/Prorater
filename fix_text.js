const fs = require("fs");
let code = fs.readFileSync("src/app/ClientPage.tsx", "utf8");

code = code.replace(/alert\([^)]+\)/g, "alert(\"比較できるのは最大4名までです。\")");
code = code.replace(/<span>比.*<\/span>/g, "<span>比較する</span>");
code = code.replace(/<span>比.*めE\/span>/g, "<span>比較中</span>");
code = code.replace(/>Aの取り.*<\/span>/g, ">Aの取りやすさ</span>");
code = code.replace(/>学生.*声<\/span>/g, ">学生の声</span>");
code = code.replace(/刁.*・科目から探.*( {2,})/g, "分野・科目から探す$1");
code = code.replace(/教授名から探.*( {2,})/g, "教授名から探す$1");
code = code.replace(/placeholder=\"科目名.*\"/g, "placeholder=\"科目名や分野を入力\"");
code = code.replace(/placeholder=\"教授の名前を.*\"/g, "placeholder=\"教授の名前を入力\"");
code = code.replace(/>主要な刁.*探.*<\/div>/g, ">主要な分野から探す</div>");
code = code.replace(/>閉じめE.*<\/button>/g, ">閉じる / 選択クリア</button>");
code = code.replace(/>Cal-GETC.*探.*<\/div>/g, ">Cal-GETC / IGETC エリアから探す</div>");
code = code.replace(/>結果が見つかりません.*<\/div>/g, ">結果が見つかりません。</div>");
code = code.replace(/{sortedProfs\.length}名.*教授/g, "{sortedProfs.length}名の教授");
code = code.replace(/>並べ替.*<\/span>/g, ">並べ替え</span>");
code = code.replace(/>レビュー数の多い人気.*Top 20/g, ">レビュー数の多い人気の教授 Top 20");
code = code.replace(/{compareList\.length}名.*比.*/g, "{compareList.length}名の教授を比較");
code = code.replace(/>比.*めE/g, ">比較中");
code = code.replace(/const labels = { 5: \u0027.*\u0027, 4: \u0027.*\u0027, 3: \u0027.*\u0027, 2: \u0027.*\u0027, 1: \u0027.*\u0027 };/, "const labels = { 5: \u0027最高\u0027, 4: \u0027良い\u0027, 3: \u0027普通\u0027, 2: \u0027微妙\u0027, 1: \u0027最悪\u0027 };");
code = code.replace(/>教授の比.*<\/h2>/g, ">教授の比較</h2>");
code = code.replace(/>Aの取り.*さ.*評価.*/g, ">Aの取りやすさの評価分布</h4>");
code = code.replace(/教授の質・評価.*<span/g, "教授の質・評価分布 <span");

fs.writeFileSync("src/app/ClientPage.tsx", code);
console.log("Fixed!");


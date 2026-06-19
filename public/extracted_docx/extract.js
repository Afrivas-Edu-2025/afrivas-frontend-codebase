const fs = require('fs');
const xml = fs.readFileSync('c:/Users/dell/Documents/PROJECTS/EDWARD/AFRIVAS/frontend/public/extracted_docx/word/document.xml', 'utf8');

const pRegex = /<w:p\b[^>]*>(.*?)<\/w:p>/g;
const tRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/g;
const paragraphs = [];

let pMatch;
while ((pMatch = pRegex.exec(xml)) !== null) {
  const pContent = pMatch[1];
  const tTexts = [];
  let tMatch;
  while ((tMatch = tRegex.exec(pContent)) !== null) {
    tTexts.push(tMatch[1]);
  }
  if (tTexts.length > 0) {
    paragraphs.push(tTexts.join(''));
  } else {
    paragraphs.push('');
  }
}

fs.writeFileSync('c:/Users/dell/Documents/PROJECTS/EDWARD/AFRIVAS/frontend/public/extracted_docx/extracted_text.txt', paragraphs.join('\n'));
console.log('Extracted paragraphs:', paragraphs.length);

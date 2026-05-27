const { parseCSV, parseTXT, validateAndResolveQuestion } = require('../utils/testParser');

console.log("=== Testing CSV Parser ===");
const sampleCSV = `Type,Question Text,Points,Option A,Option B,Option C,Option D,Correct Answer
MCQ,"What is 2 + 2?",5,"3","4","5","6","4"
MULTIPLE_SELECT,"Select prime numbers",5,"2","4","5","9","A|C"
DESCRIPTIVE,"What is photosynthesis?",10,,,,""
`;

const csvQuestions = parseCSV(sampleCSV);
console.log("Parsed CSV count:", csvQuestions.length);

const validatedCsv = csvQuestions.map((q, idx) => validateAndResolveQuestion(q, idx));

console.log("Validated Q1 (MCQ):", validatedCsv[0]);
// Q1 should have option texts, and correctAnswer should be "4" (exact match)
if (validatedCsv[0].correctAnswer !== "4") {
  console.error("FAIL: Q1 correctAnswer should be '4'");
} else {
  console.log("PASS: Q1 correctAnswer is correct!");
}

console.log("Validated Q2 (Multi-Select):", validatedCsv[1]);
// Q2 rawCorrect was "A|C". A corresponds to "2", C corresponds to "5".
// So correctAnswer should be ["2", "5"]
if (JSON.stringify(validatedCsv[1].correctAnswer) !== JSON.stringify(["2", "5"])) {
  console.error("FAIL: Q2 correctAnswer should be ['2', '5']");
} else {
  console.log("PASS: Q2 correctAnswer mapped correctly!");
}

console.log("\n=== Testing TXT Parser ===");
const sampleTXT = `Question 1
Type: MCQ
Points: 5
Text: What is the capital of France?
Options:
- Paris
- London
- Berlin
- Rome
Correct Answer: A

Question 2
Type: MULTIPLE_SELECT
Points: 10
Text: Select all prime numbers.
Options:
- 2
- 4
- 5
- 9
Correct Answer: 2|5
`;

const txtQuestions = parseTXT(sampleTXT);
console.log("Parsed TXT count:", txtQuestions.length);

const validatedTxt = txtQuestions.map((q, idx) => validateAndResolveQuestion(q, idx));
console.log("Validated Q1 (MCQ Letter Match):", validatedTxt[0]);
// Q1 rawCorrect was "A". Option A is "Paris". So correctAnswer should be "Paris".
if (validatedTxt[0].correctAnswer !== "Paris") {
  console.error("FAIL: Q1 correctAnswer should be 'Paris'");
} else {
  console.log("PASS: Q1 correctAnswer mapped correctly!");
}

console.log("Validated Q2 (Multi-Select Text Match):", validatedTxt[1]);
if (JSON.stringify(validatedTxt[1].correctAnswer) !== JSON.stringify(["2", "5"])) {
  console.error("FAIL: Q2 correctAnswer should be ['2', '5']");
} else {
  console.log("PASS: Q2 correctAnswer mapped correctly!");
}

console.log("\n=== Testing Errors ===");
const invalidQ = {
  type: 'MCQ',
  text: '',
  points: -1,
  options: ['A', '', 'C'], // invalid length and empty option
  rawCorrect: 'X' // not in options
};
const validatedInvalid = validateAndResolveQuestion(invalidQ, 0);
console.log("Errors captured for invalid question:", validatedInvalid.validationErrors);
if (validatedInvalid.validationErrors.length === 4) {
  console.log("PASS: All 4 errors captured successfully!");
} else {
  console.error(`FAIL: Expected 4 errors, got ${validatedInvalid.validationErrors.length}`);
}

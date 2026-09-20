const fs = require('fs');

const p = 'src/services/api/submission.ts';
let code = fs.readFileSync(p, 'utf8');
code = code.replace(/export const INITIAL_SUBMISSION_HISTORY: SubmissionVersionRecord\[\] = \[[\s\S]*?\];/, 'export const INITIAL_SUBMISSION_HISTORY: SubmissionVersionRecord[] = [];');
fs.writeFileSync(p, code);
console.log("Submissions cleared.");

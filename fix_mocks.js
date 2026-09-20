const fs = require('fs');

// 1. Leaderboard
const lbPath = 'src/data/mock/leaderboard.ts';
let lb = fs.readFileSync(lbPath, 'utf8');
lb = lb.replace(/export const MOCK_LEADERBOARD: LeaderboardEntry\[\] = \[[\s\S]*?\];/, 'export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];');
fs.writeFileSync(lbPath, lb);

// 2. Profile
const profPath = 'src/data/mock/profile.ts';
let prof = fs.readFileSync(profPath, 'utf8');
prof = prof.replace(/roundPerformance: \[[\s\S]*?\],/, 'roundPerformance: [],');
prof = prof.replace(/submissions: \[[\s\S]*?\],/, 'submissions: [],');
prof = prof.replace(/achievements: \[[\s\S]*?\],/, 'achievements: [],');
prof = prof.replace(/equityCurve: \[[\s\S]*?\]/, 'equityCurve: []');
fs.writeFileSync(profPath, prof);

// 3. Teams
const teamsPath = 'src/data/mock/teams.ts';
let teams = fs.readFileSync(teamsPath, 'utf8');
teams = teams.replace(/export const MOCK_TEAMS: TeamProfile\[\] = \[[\s\S]*?\];/, 'export const MOCK_TEAMS: TeamProfile[] = [];');
fs.writeFileSync(teamsPath, teams);

console.log("Mock data cleared.");

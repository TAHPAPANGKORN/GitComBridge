import { ContributionData } from "@/lib/types";

export function generateStatsSVG(
  githubData: ContributionData,
  gitlabData: ContributionData,
  theme: string = "dark",
  username: string = "User"
): string {
  const contributions = { ...githubData };
  Object.entries(gitlabData).forEach(([date, count]) => {
    contributions[date] = (contributions[date] || 0) + count;
  });

  const dates = Object.keys(contributions).sort();
  const totalCommits = Object.values(contributions).reduce((a, b) => a + b, 0);

  // Calculate Streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date().toISOString().split("T")[0];

  dates.forEach((date, i) => {
    if (contributions[date] > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });

  // Most Active Day
  const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  dates.forEach(date => {
    const day = new Date(date).getDay();
    dayCounts[day] += contributions[date];
  });
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const mostActiveDay = days[dayCounts.indexOf(Math.max(...dayCounts))];

  // Theme Colors
  const isLight = theme === "light";
  const bg = isLight ? "#ffffff" : "#0d1117";
  const text = isLight ? "#1f2328" : "#e6edf3";
  const accent = "#7c3aed"; // Purple

  return `
    <svg width="450" height="200" viewBox="0 0 450 200" xmlns="http://www.w3.org/2000/svg">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&amp;display=swap');
        .stat-label { font: 400 12px 'Inter', sans-serif; fill: ${text}; opacity: 0.6; }
        .stat-value { font: 700 16px 'Inter', sans-serif; fill: ${text}; }
        .title { font: 900 18px 'Inter', sans-serif; fill: ${accent}; }
      </style>
      <rect width="100%" height="100%" fill="${bg}" rx="16" stroke="${accent}" stroke-opacity="0.2" />
      
      <text x="25" y="35" class="title">${username}'s Stats</text>
      
      <g transform="translate(25, 65)">
        <text x="0" y="0" class="stat-label">Total Contributions</text>
        <text x="0" y="20" class="stat-value">${totalCommits.toLocaleString()}</text>
        
        <text x="200" y="0" class="stat-label">Longest Streak</text>
        <text x="200" y="20" class="stat-value">${longestStreak} Days 🔥</text>
      </g>
      
      <g transform="translate(25, 125)">
        <text x="0" y="0" class="stat-label">Most Active Day</text>
        <text x="0" y="20" class="stat-value">${mostActiveDay}</text>
        
        <text x="200" y="0" class="stat-label">Current Streak</text>
        <text x="200" y="20" class="stat-value">${tempStreak} Days</text>
      </g>
      
      <line x1="25" y1="45" x2="425" y2="45" stroke="${accent}" stroke-opacity="0.1" />
    </svg>
  `;
}

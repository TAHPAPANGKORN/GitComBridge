import { ContributionData } from "@/lib/types";
import { mergeContributions } from "./data-merger";

export type ThemeName = "dark" | "light" | "ocean" | "sunset" | "neon" | "dracula" | "nord";

interface ThemeColors {
  bg: string;
  text: string;
  empty: string;
  github: [string, string, string, string];
  gitlab: [string, string, string, string];
  merged: [string, string, string, string];
  glow?: string; // for neon
}

const THEMES: Record<ThemeName, ThemeColors> = {
  // ── Free Themes ──────────────────────────────────────────────
  dark: {
    bg: "#0d1117", text: "#8b949e", empty: "#161b22",
    github:  ["#0e4429", "#006d32", "#26a641", "#39d353"],
    gitlab:  ["#4a1a15", "#812a1d", "#b53523", "#e24329"],
    merged:  ["#2d1a4d", "#4c2889", "#6b4fbb", "#9a70ff"],
  },
  light: {
    bg: "#ffffff", text: "#57606a", empty: "#ebedf0",
    github:  ["#9be9a8", "#40c463", "#30a14e", "#216e39"],
    gitlab:  ["#ffd6d1", "#ff8a7a", "#e24329", "#a11d0a"],
    merged:  ["#d8b4fe", "#a855f7", "#7c3aed", "#5b21b6"],
  },
  // ── Pro Themes ───────────────────────────────────────────────
  ocean: {
    bg: "#0a1628", text: "#64b5f6", empty: "#0d2137",
    github:  ["#0d3b6e", "#1565c0", "#1976d2", "#42a5f5"],
    gitlab:  ["#1a237e", "#283593", "#3949ab", "#5c6bc0"],
    merged:  ["#004d40", "#00695c", "#00897b", "#26c6da"],
  },
  sunset: {
    bg: "#1a0a0a", text: "#f48fb1", empty: "#2d1515",
    github:  ["#7f0000", "#b71c1c", "#e53935", "#ff5252"],
    gitlab:  ["#4a148c", "#7b1fa2", "#ab47bc", "#ce93d8"],
    merged:  ["#e65100", "#f57c00", "#fb8c00", "#ffb74d"],
  },
  neon: {
    bg: "#000000", text: "#00ff41", empty: "#0a0a0a",
    github:  ["#003300", "#006600", "#00bb00", "#00ff41"],
    gitlab:  ["#330033", "#660066", "#bb00bb", "#ff00ff"],
    merged:  ["#003333", "#006666", "#00bbbb", "#00ffff"],
    glow: "0 0 6px",
  },
  dracula: {
    bg: "#282a36", text: "#6272a4", empty: "#3d3f4e",
    github:  ["#1e5128", "#2ea44f", "#3fb950", "#56d364"],
    gitlab:  ["#6272a4", "#bd93f9", "#ff79c6", "#ff92df"],
    merged:  ["#44475a", "#6272a4", "#8be9fd", "#caa9fa"],
  },
  nord: {
    bg: "#2e3440", text: "#4c566a", empty: "#3b4252",
    github:  ["#2d4a1e", "#3d6b2a", "#4e8c37", "#a3be8c"],
    gitlab:  ["#3b2a3b", "#5a3d5c", "#7e5a81", "#b48ead"],
    merged:  ["#2a3f4f", "#3b5c73", "#4c7d9a", "#81a1c1"],
  },
};

export function generateSVG(
  githubData: ContributionData,
  gitlabData: ContributionData,
  theme: ThemeName = "dark",
  userTier: "free" | "pro" = "free"   // ← Server passes this, never trust client
): string {
  // Silently enforce tier server-side (already validated in API route, but defense-in-depth)
  const resolvedTheme: ThemeName =
    (theme === "dark" || theme === "light") ? theme
    : userTier === "pro" ? theme
    : "dark";

  const colors = THEMES[resolvedTheme];

  mergeContributions(githubData, glDataWrapper(gitlabData)); // merge for type check

  const getLevelColor = (count: number, type: "github" | "gitlab" | "merged"): string => {
    if (count === 0) return colors.empty;
    const level = count >= 10 ? 3 : count >= 6 ? 2 : count >= 3 ? 1 : 0;
    return colors[type][level];
  };

  const cellSize = 10;
  const gap = 2;
  const leftPadding = 30;
  const topPadding = 30;
  const width = 53 * (cellSize + gap) + leftPadding + 20;
  const graphHeight = 7 * (cellSize + gap) + topPadding + 10;
  const watermarkHeight = userTier === "free" ? 14 : 0;
  const footerHeight = 35;
  const totalHeight = graphHeight + footerHeight + watermarkHeight;

  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - 365);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let monthLabels = "";
  let lastMonth = -1;

  const dayLabels = `
    <text x="10" y="${topPadding + (cellSize + gap) * 1 + 8}" class="text day-label">Mon</text>
    <text x="10" y="${topPadding + (cellSize + gap) * 3 + 8}" class="text day-label">Wed</text>
    <text x="10" y="${topPadding + (cellSize + gap) * 5 + 8}" class="text day-label">Fri</text>
  `;

  let cells = "";
  for (let col = 0; col < 53; col++) {
    const colDate = new Date(startDate);
    colDate.setDate(startDate.getDate() + col * 7);

    if (colDate.getMonth() !== lastMonth) {
      monthLabels += `<text x="${col * (cellSize + gap) + leftPadding}" y="20" class="text month-label">${months[colDate.getMonth()]}</text>`;
      lastMonth = colDate.getMonth();
    }

    for (let row = 0; row < 7; row++) {
      const currentDate = new Date(colDate);
      currentDate.setDate(colDate.getDate() + row);
      if (currentDate > now) continue;

      const dateStr = currentDate.toISOString().split("T")[0];
      const ghCount = githubData[dateStr] || 0;
      const glCount = gitlabData[dateStr] || 0;
      const totalCount = ghCount + glCount;

      let color = colors.empty;
      if (ghCount > 0 && glCount > 0) color = getLevelColor(totalCount, "merged");
      else if (ghCount > 0) color = getLevelColor(ghCount, "github");
      else if (glCount > 0) color = getLevelColor(glCount, "gitlab");

      const glowAttr = colors.glow ? ` filter="url(#neon-glow)"` : "";
      cells += `<rect x="${col * (cellSize + gap) + leftPadding}" y="${row * (cellSize + gap) + topPadding}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2"${color !== colors.empty ? glowAttr : ""} />`;
    }
  }

  // Watermark for free tier (defense-in-depth)
  const watermark = userTier === "free"
    ? `<text x="${width / 2}" y="${totalHeight - 3}" text-anchor="middle" 
        font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" 
        font-size="8" fill="${colors.text}" opacity="0.5">
        gitcombrigde.vercel.app
      </text>`
    : "";

  // Neon glow filter
  const neonFilter = resolvedTheme === "neon" ? `
    <defs>
      <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>` : "";

  return `<svg width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${totalHeight}" fill="${colors.bg}" rx="8" />
    ${neonFilter}
    <style>
      .text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 600; fill: ${colors.text}; }
      .month-label { font-weight: 400; }
      .day-label { font-weight: 400; }
      .label-small { font-size: 8px; font-weight: 400; }
    </style>
    ${monthLabels}
    ${dayLabels}
    ${cells}
    <!-- Legend -->
    <g transform="translate(${leftPadding}, ${graphHeight + footerHeight - 15})">
      <rect width="8" height="8" fill="${colors.github[2]}" rx="1" />
      <text x="12" y="7" class="text label-small">GitHub</text>
      <rect x="55" width="8" height="8" fill="${colors.gitlab[2]}" rx="1" />
      <text x="67" y="7" class="text label-small">GitLab</text>
      <rect x="110" width="8" height="8" fill="${colors.merged[2]}" rx="1" />
      <text x="122" y="7" class="text label-small">Merged</text>
      <g transform="translate(${53 * (cellSize + gap) - 100}, 0)">
        <text x="-25" y="7" class="text label-small">Less</text>
        <rect x="-5" width="8" height="8" fill="${colors.empty}" rx="1" />
        <rect x="5" width="8" height="8" fill="${colors.github[1]}" rx="1" />
        <rect x="15" width="8" height="8" fill="${colors.github[2]}" rx="1" />
        <rect x="25" width="8" height="8" fill="${colors.github[3]}" rx="1" />
        <text x="38" y="7" class="text label-small">More</text>
      </g>
    </g>
    ${watermark}
  </svg>`;
}

function glDataWrapper(data: any) {
  return data || {};
}

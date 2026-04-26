import { ContributionData } from "@/lib/types";
import { mergeContributions } from "./data-merger";

export type ThemeName = "dark" | "light" | "ocean" | "sunset" | "neon" | "monokai" | "sakura";
export type CellSize = "S" | "M" | "L" | "XL";
export type GraphLayout = "horizontal" | "vertical";

interface ThemeColors {
  bg: string;
  text: string;
  empty: string;
  github: [string, string, string, string, string];
  gitlab: [string, string, string, string, string];
  merged: [string, string, string, string, string];
}

const THEMES: Record<ThemeName, ThemeColors> = {
  dark: {
    bg: "#0d1117", text: "#8b949e", empty: "#161b22",
    github:  ["#0e4429", "#006d32", "#26a641", "#39d353", "#a1eba0"],
    gitlab:  ["#4a1a15", "#812a1d", "#b53523", "#e24329", "#ff8f7e"],
    merged:  ["#2d1a4d", "#4c2889", "#6b4fbb", "#9a70ff", "#c8b2ff"],
  },
  light: {
    bg: "#ffffff", text: "#475569", empty: "#ebedf0",
    github:  ["#9be9a8", "#7bc96f", "#40c463", "#30a14e", "#216e39"],
    gitlab:  ["#ffdfc4", "#ffb380", "#ff8c42", "#e65100", "#bf360c"],
    merged:  ["#e9d5ff", "#c084fc", "#a855f7", "#9333ea", "#7e22ce"],
  },
  ocean: {
    bg: "#0a1628", text: "#64b5f6", empty: "#0d2137",
    github:  ["#0d3b6e", "#1565c0", "#1976d2", "#1e88e5", "#42a5f5"],
    gitlab:  ["#1a237e", "#283593", "#3949ab", "#5c6bc0", "#7986cb"],
    merged:  ["#004d40", "#00695c", "#00897b", "#26c6da", "#4dd0e1"],
  },
  sunset: {
    bg: "#1a0f0f", text: "#ff8a65", empty: "#2d1a1a",
    github:  ["#4a2a1a", "#7a3a1a", "#a3491a", "#ff5722", "#ff7043"],
    gitlab:  ["#4a1a1a", "#811d1d", "#b52323", "#f44336", "#ef5350"],
    merged:  ["#2d1a4d", "#4c2889", "#6b4fbb", "#9a70ff", "#b388ff"],
  },
  neon: {
    bg: "#000000", text: "#00ffcc", empty: "#1a1a1a",
    github:  ["#003322", "#006644", "#009966", "#00cc88", "#00ffcc"],
    gitlab:  ["#330000", "#660000", "#990000", "#cc0000", "#ff0000"],
    merged:  ["#220033", "#440066", "#660099", "#8800cc", "#cc00ff"],
  },
  monokai: {
    bg: "#272822", text: "#f8f8f2", empty: "#3e3d32",
    github:  ["#4a4a1a", "#7a7a1a", "#a3a31a", "#e6db74", "#f0e68c"],
    gitlab:  ["#4a2a1a", "#7a4a1a", "#a36a1a", "#fd971f", "#ffb347"],
    merged:  ["#2d1a4d", "#4c2889", "#6b4fbb", "#ae81ff", "#d7beff"],
  },
  sakura: {
    bg: "#160912", text: "#f472b6", empty: "#2d1424",
    github:  ["#4a1a3a", "#7a1a5a", "#a31a7a", "#ec4899", "#f472b6"],
    gitlab:  ["#4a1a1a", "#7a1a1a", "#a31a1a", "#f43f5e", "#fb7185"],
    merged:  ["#2d1a4d", "#4c2889", "#6b4fbb", "#d946ef", "#e879f9"],
  },
};

const CELL_SIZES: Record<CellSize, number> = {
  S: 7,
  M: 10,
  L: 15,
  XL: 22,
};

export interface SVGOptions {
  theme?: ThemeName;
  weeks?: number;
  cellSize?: CellSize;
  layout?: GraphLayout;
  title?: string;
  hideWatermark?: boolean;
}

export function generateSVG(
  githubData: ContributionData,
  gitlabData: ContributionData,
  options: SVGOptions = {},
  userTier: "free" | "pro" = "free"
): string {
  const isPro = userTier === "pro";
  
  const theme = (options.theme && isPro) || options.theme === "dark" || options.theme === "light" 
    ? (options.theme as ThemeName) 
    : "light";
  const weeks = isPro ? (options.weeks || 52) : 52;
  const cellSizeVal = isPro ? CELL_SIZES[options.cellSize || "M"] : CELL_SIZES.L;
  const layout = isPro ? (options.layout || "horizontal") : "horizontal";
  const title = isPro ? (options.title || "") : "";
  const hideWatermark = isPro && options.hideWatermark;

  const colors = THEMES[theme] || THEMES.light;
  const gap = Math.max(2, Math.round(cellSizeVal * 0.2));
  
  const isVertical = layout === "vertical";
  const leftPadding = isVertical ? 75 : 40; // More space for months in vertical
  const topPadding = title ? 60 : 40;
  const footerHeight = isVertical ? 65 : 40; // Taller footer for vertical
  const watermarkHeight = (!hideWatermark && !isPro) ? 15 : 0;
  
  const mainWidth = isVertical ? (7 * (cellSizeVal + gap) + 10) : (weeks * (cellSizeVal + gap) + 10);
  const mainHeight = isVertical ? (weeks * (cellSizeVal + gap) + 10) : (7 * (cellSizeVal + gap) + 10);
  
  const width = mainWidth + leftPadding + 40;
  const height = mainHeight + topPadding + footerHeight + watermarkHeight;

  const contributions = mergeContributions(githubData, gitlabData);
  const counts = Object.values(contributions).filter(c => c > 0);
  const maxVal = counts.length > 0 ? Math.max(...counts) : 1;

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    // 5 active levels (1-5)
    if (count <= Math.ceil(maxVal * 0.10)) return 1;
    if (count <= Math.ceil(maxVal * 0.30)) return 2;
    if (count <= Math.ceil(maxVal * 0.50)) return 3;
    if (count <= Math.ceil(maxVal * 0.75)) return 4;
    return 5;
  };

  const getCellColor = (date: string) => {
    const count = contributions[date] || 0;
    const level = getLevel(count);
    if (level === 0) return colors.empty;
    
    const idx = level - 1; // 0-4 index for the 5-color arrays
    if (gitlabData[date] && githubData[date]) return colors.merged[idx];
    if (gitlabData[date]) return colors.gitlab[idx];
    return colors.github[idx];
  };

  let gridItems = "";
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startDate = new Date();
  startDate.setDate(now.getDate() - (weeks * 7) + (6 - dayOfWeek));

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (w * 7) + d);
      const dateStr = currentDate.toISOString().split("T")[0];
      
      const x = isVertical ? leftPadding + d * (cellSizeVal + gap) : leftPadding + w * (cellSizeVal + gap);
      const y = isVertical ? topPadding + w * (cellSizeVal + gap) : topPadding + d * (cellSizeVal + gap);
      const color = getCellColor(dateStr);
      gridItems += `<rect x="${x}" y="${y}" width="${cellSizeVal}" height="${cellSizeVal}" fill="${color}" rx="${Math.max(1, cellSizeVal * 0.12)}" />\n`;
    }
  }

  let labels = "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Mon", "Wed", "Fri"];
  
  if (isVertical) {
    // Days Header (Narrow)
    days.forEach((day, i) => {
      const x = leftPadding + (i * 2 + 1) * (cellSizeVal + gap);
      labels += `<text x="${x + cellSizeVal/2}" y="${topPadding - 8}" font-size="8" fill="${colors.text}" text-anchor="middle" font-weight="bold">${day}</text>\n`;
    });

    // Vertical Month Labels
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (w * 7));
      const month = currentDate.getMonth();
      if (month !== lastMonth) {
        const y = topPadding + w * (cellSizeVal + gap) + (cellSizeVal * 0.7);
        labels += `<text x="${leftPadding - 15}" y="${y}" font-size="9" fill="${colors.text}" text-anchor="end" font-weight="bold">${months[month]}</text>\n`;
        lastMonth = month;
      }
    }
  } else {
    days.forEach((day, i) => {
      const y = topPadding + (i * 2 + 1) * (cellSizeVal + gap) + (cellSizeVal * 0.7);
      labels += `<text x="${leftPadding - 10}" y="${y}" font-size="9" fill="${colors.text}" text-anchor="end" font-weight="bold">${day}</text>\n`;
    });

    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (w * 7));
      const month = currentDate.getMonth();
      if (month !== lastMonth) {
        const x = leftPadding + w * (cellSizeVal + gap);
        labels += `<text x="${x}" y="${topPadding - 10}" font-size="9" fill="${colors.text}" font-weight="bold">${months[month]}</text>\n`;
        lastMonth = month;
      }
    }
  }

  const neonFilter = theme === "neon" ? `<defs><filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs>` : "";

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&amp;display=swap'); text { font-family: 'Inter', sans-serif; }</style>
      ${neonFilter}
      <rect width="100%" height="100%" fill="${colors.bg}" rx="8" />
      ${title ? `<text x="20" y="35" font-size="18" font-weight="900" fill="${colors.text}">${title}</text>` : ""}
      <g ${theme === "neon" ? 'filter="url(#neon-glow)"' : ""}>${gridItems}</g>
      ${labels}
      
      <g transform="translate(${leftPadding}, ${height - footerHeight - watermarkHeight + 15})">
        ${isVertical ? `
          <!-- Vertical Layout Footer: Spaced Out -->
          <g>
            <text x="0" y="5" font-size="8" fill="${colors.text}" font-weight="bold">GH</text>
            <rect x="18" y="-4" width="8" height="8" fill="${colors.github[4]}" rx="1.5" />
            
            <text x="40" y="5" font-size="8" fill="${colors.text}" font-weight="bold">GL</text>
            <rect x="58" y="-4" width="8" height="8" fill="${colors.gitlab[4]}" rx="1.5" />
            
            <text x="80" y="5" font-size="8" fill="${colors.text}" font-weight="bold">MG</text>
            <rect x="98" y="-4" width="8" height="8" fill="${colors.merged[4]}" rx="1.5" />
          </g>
          <g transform="translate(0, 25)">
            <text x="0" y="5" font-size="8" fill="${colors.text}" opacity="0.5">Less</text>
            <rect x="25" y="-4" width="8" height="8" fill="${colors.empty}" rx="1.5" />
            <rect x="35" y="-4" width="8" height="8" fill="${colors.github[1]}" rx="1.5" />
            <rect x="45" y="-4" width="8" height="8" fill="${colors.github[4]}" rx="1.5" />
            <text x="60" y="5" font-size="8" fill="${colors.text}" opacity="0.5">More</text>
          </g>
        ` : `
          <!-- Horizontal Layout Footer -->
          <text x="0" y="10" font-size="9" fill="${colors.text}" font-weight="bold">GitHub</text>
          <rect x="35" y="2" width="8" height="8" fill="${colors.github[4]}" rx="2" />
          <text x="60" y="10" font-size="9" fill="${colors.text}" font-weight="bold">GitLab</text>
          <rect x="95" y="2" width="8" height="8" fill="${colors.gitlab[4]}" rx="2" />
          <text x="120" y="10" font-size="9" fill="${colors.text}" font-weight="bold">Merged</text>
          <rect x="155" y="2" width="8" height="8" fill="${colors.merged[4]}" rx="2" />
          
          <g transform="translate(${mainWidth - 85}, 0)">
            <text x="0" y="10" font-size="8" fill="${colors.text}" opacity="0.5">Less</text>
            <rect x="25" y="2" width="8" height="8" fill="${colors.empty}" rx="1.5" />
            <rect x="35" y="2" width="8" height="8" fill="${colors.github[2]}" rx="1.5" />
            <rect x="45" y="2" width="8" height="8" fill="${colors.github[4]}" rx="1.5" />
            <text x="60" y="10" font-size="8" fill="${colors.text}" opacity="0.5">More</text>
          </g>
        `}
      </g>
      ${!isPro ? `<text x="${width / 2}" y="${height - 10}" font-size="8" fill="${colors.text}" opacity="0.3" text-anchor="middle">Powered by GitComBridge</text>` : ""}
    </svg>
  `;
}

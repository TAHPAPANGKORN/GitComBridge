import { ContributionData } from "@/lib/types";
import { mergeContributions } from "./data-merger";

export type ThemeName = "dark" | "light" | "ocean" | "sunset" | "neon" | "monokai" | "sakura" | "matcha" | "snow" | "daydream" | "latte" | "ruby";
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
    github: ["#0e4429", "#006d32", "#26a641", "#39d353", "#50fa7b"],
    gitlab: ["#4a1a15", "#812a1d", "#b53523", "#e24329", "#ff5555"],
    merged: ["#2d1a4d", "#4c2889", "#6b4fbb", "#9a70ff", "#bd93f9"],
  },
  light: {
    bg: "#ffffff", text: "#57606a", empty: "#ebedf0",
    github: ["#9be9a8", "#40c463", "#30a14e", "#216e39", "#195127"],
    gitlab: ["#ffd6d1", "#ff8a7a", "#e24329", "#a11d0a", "#7a1205"],
    merged: ["#d8b4fe", "#a855f7", "#7c3aed", "#5b21b6", "#4c1d95"],
  },

  ocean: {
    bg: "#0a1628", text: "#64b5f6", empty: "#112240",
    github: ["#0d3b6e", "#115293", "#1976d2", "#2196f3", "#64b5f6"],
    gitlab: ["#1a237e", "#283593", "#3949ab", "#5c6bc0", "#8c9eff"],
    merged: ["#004d40", "#00695c", "#00897b", "#00bfa5", "#1de9b6"],
  },

  sunset: {
    bg: "#1a0f0f", text: "#ffb74d", empty: "#2d1a1a",
    github: ["#4e200c", "#8d3813", "#d8561c", "#ff7043", "#ff9e80"],
    gitlab: ["#4a1111", "#8b1c1c", "#d32f2f", "#ef5350", "#ff8a80"],
    merged: ["#4a144a", "#7b1fa2", "#ab47bc", "#e066ff", "#ea80fc"],
  },

  neon: {
    bg: "#050505", text: "#00ffcc", empty: "#141414",
    github: ["#003322", "#006644", "#00cc88", "#00ffcc", "#aaffff"],
    gitlab: ["#330011", "#660022", "#cc0044", "#ff0055", "#ff6699"],
    merged: ["#110033", "#220066", "#4400cc", "#7700ff", "#b366ff"],
  },

  monokai: {
    bg: "#272822", text: "#f8f8f2", empty: "#3e3d32",
    github: ["#2b3618", "#4d6521", "#74982a", "#a6e22e", "#c4f068"],
    gitlab: ["#38111d", "#741b39", "#b92055", "#f92672", "#fc689d"],
    merged: ["#1b343a", "#295b68", "#4292a8", "#66d9ef", "#9aebfa"],
  },


  matcha: {
    bg: "#1e201e", text: "#e0e0c5", empty: "#2c302c",
    github: ["#283618", "#384a20", "#4c6926", "#606c38", "#a3b18a"],
    gitlab: ["#4a2c11", "#754013", "#bc6c25", "#dda15e", "#fefae0"],
    merged: ["#183630", "#215247", "#2d7a68", "#40a38d", "#7acfc0"],
  },

  // Pro Light Themes
  sakura: {
    bg: "#fff5f8", text: "#885566", empty: "#ffe4ee",
    github: ["#ffcce0", "#ffa6c9", "#ff80b3", "#ff599c", "#f03284"],
    gitlab: ["#ffd9d6", "#ffb3ad", "#fc8880", "#eb5d54", "#cc3e35"],
    merged: ["#e8dcff", "#c8b3fa", "#a88cf0", "#8663de", "#633eb3"],
  },

  snow: {
    bg: "#ffffff", text: "#334155", empty: "#f1f5f9",
    github: ["#dcfce7", "#86efac", "#4ade80", "#16a34a", "#14532d"],
    gitlab: ["#fee2e2", "#fca5a5", "#f87171", "#dc2626", "#7f1d1d"],
    merged: ["#e0f2fe", "#7dd3fc", "#38bdf8", "#0284c7", "#0c4a6e"],
  },
  latte: {
    bg: "#faf8f5", text: "#4a3018", empty: "#ebe3d5",
    github: ["#eedfc8", "#d2b48c", "#a67b5b", "#8b4513", "#5c3a21"],
    gitlab: ["#fde0c6", "#f8b179", "#f28532", "#c95200", "#8a3800"],
    merged: ["#e4dcf1", "#c1aee2", "#9e80d3", "#744bbf", "#4b2a85"],
  },
  daydream: {
    bg: "#f4f9fb", text: "#3b5b71", empty: "#e1eef4",
    github: ["#dcf0f7", "#aedcf0", "#7ac4e8", "#45abdf", "#1c8cc5"],
    gitlab: ["#fae3eb", "#f0b6cb", "#e685aa", "#d95386", "#b3275c"],
    merged: ["#ebebf9", "#cdd0f1", "#a9aeea", "#8088e1", "#5962d6"],
  },
  ruby: {
    bg: "#ffffff", text: "#27272a", empty: "#f4f4f5",
    github: ["#fef08a", "#facc15", "#eab308", "#ca8a04", "#854d0e"],
    gitlab: ["#fecdd3", "#fda4af", "#f43f5e", "#e11d48", "#9f1239"],
    merged: ["#e9d5ff", "#d8b4fe", "#a855f7", "#7e22ce", "#581c87"],
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
    // Fixed thresholds as requested
    if (count >= 10) return 4;
    if (count >= 6) return 3;
    if (count >= 3) return 2;
    return 1;
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
      labels += `<text x="${x + cellSizeVal / 2}" y="${topPadding - 8}" font-size="8" fill="${colors.text}" text-anchor="middle" font-weight="bold">${day}</text>\n`;
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
            <rect x="0" y="0" width="8" height="8" fill="${colors.github[3]}" rx="0" />
            <text x="12" y="8" font-size="8" fill="${colors.text}" font-weight="bold">Github</text>
            
            <rect x="50" y="0" width="8" height="8" fill="${colors.gitlab[3]}" rx="0" />
            <text x="62" y="8" font-size="8" fill="${colors.text}" font-weight="bold">GitLab</text>
            
            <rect x="104" y="0" width="8" height="8" fill="${colors.merged[3]}" rx="0" />
            <text x="116" y="8" font-size="8" fill="${colors.text}" font-weight="bold">Merged</text>
          </g>
          <g transform="translate(0, 22)">
            <text x="0" y="8" font-size="8" fill="${colors.text}" opacity="0.5">Less</text>
            <rect x="25" y="0" width="8" height="8" fill="${colors.empty}" rx="0" />
            <rect x="35" y="0" width="8" height="8" fill="${colors.github[0]}" rx="0" />
            <rect x="45" y="0" width="8" height="8" fill="${colors.github[1]}" rx="0" />
            <rect x="55" y="0" width="8" height="8" fill="${colors.github[2]}" rx="0" />
            <rect x="65" y="0" width="8" height="8" fill="${colors.github[3]}" rx="0" />
            <text x="80" y="8" font-size="8" fill="${colors.text}" opacity="0.5">More</text>
          </g>
        ` : `
          <!-- Horizontal Layout Footer -->
          <rect x="0" y="1" width="10" height="10" fill="${colors.github[3]}" rx="0" />
          <text x="14" y="10" font-size="9" fill="${colors.text}" font-weight="bold">GitHub</text>
          <rect x="60" y="1" width="10" height="10" fill="${colors.gitlab[3]}" rx="0" />
          <text x="74" y="10" font-size="9" fill="${colors.text}" font-weight="bold">GitLab</text>
          <rect x="118" y="1" width="10" height="10" fill="${colors.merged[3]}" rx="0" />
          <text x="132" y="10" font-size="9" fill="${colors.text}" font-weight="bold">Merged</text>
          
          <g transform="translate(${mainWidth - 115}, 0)">
            <text x="0" y="10" font-size="8" fill="${colors.text}" opacity="0.5">Less</text>
            <rect x="26" y="1" width="10" height="10" fill="${colors.empty}" rx="0" />
            <rect x="38" y="1" width="10" height="10" fill="${colors.github[0]}" rx="0" />
            <rect x="50" y="1" width="10" height="10" fill="${colors.github[1]}" rx="0" />
            <rect x="62" y="1" width="10" height="10" fill="${colors.github[2]}" rx="0" />
            <rect x="74" y="1" width="10" height="10" fill="${colors.github[3]}" rx="0" />
            <text x="90" y="10" font-size="8" fill="${colors.text}" opacity="0.5">More</text>
          </g>
        `}
      </g>
      ${!isPro ? `<text x="${width / 2}" y="${height - 10}" font-size="8" fill="${colors.text}" opacity="0.3" text-anchor="middle">Powered by GitComBridge</text>` : ""}
    </svg>
  `;
}

import { ContributionData } from "@/lib/types";
import { mergeContributions } from "./data-merger";
import { format, subDays, startOfWeek, eachDayOfInterval } from "date-fns";

export type ThemeName = "dark" | "light" | "ocean" | "sunset" | "neon" | "monokai" | "sakura" | "matcha" | "snow" | "daydream" | "latte" | "ruby";
export type CellSize = "S" | "M" | "L" | "XL";
export type GraphLayout = "horizontal" | "vertical";
export type AnimationType = "none" | "pulse" | "fade" | "wave" | "glimmer";
export type ViewMode = "flat" | "isometric";
export type ShapeType = "square" | "circle" | "diamond" | "leaf";

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
  timezone?: string;
  animation?: AnimationType;
  viewMode?: ViewMode;
  shape?: ShapeType;
}

function darkenColor(hex: string, amount: number): string {
  hex = hex.replace("#", "");
  const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generateSVG(
  githubData: ContributionData,
  gitlabData: ContributionData,
  options: SVGOptions = {},
  userTier: "free" | "pro" = "free"
): string {
  const {
    theme: optTheme = "light",
    weeks: optWeeks = 52,
    cellSize: optCellSize = "M",
    layout: optLayout = "horizontal",
    title: optTitle = "",
    hideWatermark: optHideWatermark = false,
    timezone = "Asia/Bangkok",
    animation: optAnimation = "none",
    viewMode: optViewMode = "flat",
    shape: optShape = "square",
  } = options;

  const isPro = userTier === "pro";

  // Tier-based defaults & restrictions
  const theme    = (isPro && optTheme) || optTheme === "dark" || optTheme === "light" ? (optTheme as ThemeName) : "light";
  const weeks    = isPro ? (optWeeks || 52) : 52;
  const cellSizeVal = isPro ? CELL_SIZES[optCellSize || "M"] : CELL_SIZES.L;
  const layout   = isPro ? (optLayout || "horizontal") : "horizontal";
  const title    = isPro ? (optTitle || "") : "";
  const hideWatermark = isPro && optHideWatermark;
  const animation = isPro ? (optAnimation || "none") : "none";
  const viewMode = isPro ? (optViewMode || "flat") : "flat";
  const shape = isPro ? (optShape || "square") : "square";

  const colors = THEMES[theme] || THEMES.light;
  const gap = Math.max(2, Math.round(cellSizeVal * 0.2));

  const isVertical = layout === "vertical";
  const leftPadding = isVertical ? 75 : 40; // More space for months in vertical
  const rightPadding = 40;
  const topPadding = title ? 60 : 40;
  const footerHeight = isVertical ? 100 : 45; // Taller footer for vertical to avoid overlap
  const watermarkHeight = (!hideWatermark && !isPro) ? 20 : 0;

  // 🌐 Get current date in requested timezone
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
  now.setHours(0, 0, 0, 0);

  const startDate = subDays(now, (weeks * 7) - 1);
  const calendarStart = startOfWeek(startDate); // Defaults to Sunday
  const daysInterval = eachDayOfInterval({ start: calendarStart, end: now });

  // Use actual week count from interval for accurate dimensions
  const actualWeeks = Math.ceil(daysInterval.length / 7);

  // --- DIMENSIONS & SPACING ---
  const isIsometric = viewMode === "isometric";
  const isoGap = gap * 0.5;

  // Calculate dynamic dimensions based on layout
  const gridWidth = isVertical ? (7 * (cellSizeVal + gap)) - gap : (actualWeeks * (cellSizeVal + gap)) - gap;
  const gridHeight = isVertical ? (actualWeeks * (cellSizeVal + gap)) - gap : (7 * (cellSizeVal + gap)) - gap;
  
  let width = gridWidth + leftPadding + rightPadding;
  let height = gridHeight + topPadding + footerHeight + watermarkHeight;

  // Increase canvas for Isometric view to prevent clipping
  if (isIsometric) {
    width = Math.max(width, (actualWeeks + 7) * (cellSizeVal * 0.9 + isoGap) + 100);
    height = Math.max(height, (actualWeeks + 7) * (cellSizeVal * 0.5 + isoGap / 2) + topPadding + footerHeight + 100);
  }

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

  // --- GRID RENDERING ---

  // Prepare all days first to allow sorting for Isometric Z-order
  const gridData = daysInterval.map((day, i) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayInWeek = i % 7;
    const weekIdx = Math.floor(i / 7);
    const count = contributions[dateStr] || 0;
    const level = getLevel(count);
    const color = getCellColor(dateStr);
    
    let type = "gh";
    if (gitlabData[dateStr] && githubData[dateStr]) type = "mg";
    else if (gitlabData[dateStr]) type = "gl";

    return { day, dateStr, dayInWeek, weekIdx, count, level, color, type, i };
  });

  // Sort for Isometric: Back-to-Front (Smaller week + day first)
  if (isIsometric) {
    gridData.sort((a, b) => (a.weekIdx + a.dayInWeek) - (b.weekIdx + b.dayInWeek));
  }

  const offsetX = (width - gridWidth) / 2;
  const offsetY = topPadding;

  let gridItems = "";
  for (const item of gridData) {
    const { dayInWeek, weekIdx, color, count, level, type, i } = item;
    const typeClass = `type-${type}`;

    
    let animationStyle = "";
    if (animation !== "none" && count > 0) {
      const delay = animation === "wave" ? (weekIdx * 0.1).toFixed(2) : 
                    animation === "fade" ? (i * 0.01).toFixed(2) : 
                    (Math.random() * 2).toFixed(2);
      
      const animName = animation === "fade" ? "fade 8s infinite" :
                       animation === "pulse" ? "pulse 2s infinite" :
                       animation === "wave" ? "wave 2s infinite" :
                       "glimmer 3s infinite";

      animationStyle = `style="animation: ${animName} ease-in-out ${delay}s; ${animation === "fade" ? "opacity: 0;" : ""}"`;
    }

    if (isIsometric) {
      // 📐 Isometric Projection (Z-Sorted & Perfectly Centered)
      // Range of (weekIdx - dayInWeek) is approx -6 to 52, midpoint is ~23
      // Range of (weekIdx + dayInWeek) is approx 0 to 58, midpoint is ~29
      const midW = (weeks - 1) / 2;
      const midD = 3;
      
      const factorX = cellSizeVal * 0.9 + isoGap;
      const factorY = cellSizeVal * 0.45 + isoGap / 2;
      
      const isoX = width / 2 + (weekIdx - dayInWeek - (midW - midD)) * factorX;
      const isoY = (height - footerHeight) / 2 + (weekIdx + dayInWeek - (midW + midD)) * factorY + 20;
      
      const h = count > 0 ? Math.max(6, level * (cellSizeVal / 2)) : 2; 
      const topColor = color;
      const rightColor = darkenColor(color, 40);
      const leftColor = darkenColor(color, 20);
      const strokeColor = darkenColor(color, 60);

      if (count > 0) {
        gridItems += `<path d="M${isoX} ${isoY} L${isoX - cellSizeVal * 0.9} ${isoY - cellSizeVal * 0.45} L${isoX - cellSizeVal * 0.9} ${isoY - cellSizeVal * 0.45 - h} L${isoX} ${isoY - h} Z" fill="${leftColor}" stroke="${strokeColor}" stroke-width="0.1" class="lvl-${level} ${typeClass}" />\n`;
        gridItems += `<path d="M${isoX} ${isoY} L${isoX + cellSizeVal * 0.9} ${isoY - cellSizeVal * 0.45} L${isoX + cellSizeVal * 0.9} ${isoY - cellSizeVal * 0.45 - h} L${isoX} ${isoY - h} Z" fill="${rightColor}" stroke="${strokeColor}" stroke-width="0.1" class="lvl-${level} ${typeClass}" />\n`;
      }
      
      gridItems += `<path d="M${isoX} ${isoY - h} L${isoX + cellSizeVal * 0.9} ${isoY - h - cellSizeVal * 0.45} L${isoX} ${isoY - h - cellSizeVal * 0.9} L${isoX - cellSizeVal * 0.9} ${isoY - h - cellSizeVal * 0.45} Z" fill="${topColor}" stroke="${strokeColor}" stroke-width="0.1" class="lvl-${level} ${typeClass}" ${animationStyle} />\n`;
    } else {
      // 🟦 Standard Flat View
      const x = isVertical ? offsetX + dayInWeek * (cellSizeVal + gap) : offsetX + weekIdx * (cellSizeVal + gap);
      const y = isVertical ? offsetY + weekIdx * (cellSizeVal + gap) : offsetY + dayInWeek * (cellSizeVal + gap);

      if (shape === "circle") {
        gridItems += `<circle cx="${x + cellSizeVal/2}" cy="${y + cellSizeVal/2}" r="${cellSizeVal/2}" fill="${color}" class="lvl-${level} ${typeClass}" ${animationStyle} />\n`;
      } else if (shape === "diamond") {
        const s = cellSizeVal / 2;
        gridItems += `<path d="M${x + s} ${y} L${x + cellSizeVal} ${y + s} L${x + s} ${y + cellSizeVal} L${x} ${y + s} Z" fill="${color}" class="lvl-${level} ${typeClass}" ${animationStyle} />\n`;
      } else if (shape === "leaf") {
        gridItems += `<rect x="${x}" y="${y}" width="${cellSizeVal}" height="${cellSizeVal}" fill="${color}" rx="${cellSizeVal}" ry="${cellSizeVal * 0.2}" class="lvl-${level} ${typeClass}" ${animationStyle} />\n`;
      } else {
        gridItems += `<rect x="${x}" y="${y}" width="${cellSizeVal}" height="${cellSizeVal}" fill="${color}" rx="${Math.max(1, cellSizeVal * 0.12)}" class="lvl-${level} ${typeClass}" ${animationStyle} />\n`;
      }
    }
  }

  let labels = "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Mon", "Wed", "Fri"];

  if (isVertical) {
    // Days Header (Narrow)
    days.forEach((day, i) => {
      const x = offsetX + (i * 2 + 1) * (cellSizeVal + gap);
      labels += `<text x="${x + cellSizeVal / 2}" y="${offsetY - 8}" font-size="8" fill="${colors.text}" text-anchor="middle" font-weight="bold">${day}</text>\n`;
    });

    // Vertical Month Labels
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (w * 7));
      const month = currentDate.getMonth();
      if (month !== lastMonth) {
        const y = offsetY + w * (cellSizeVal + gap) + (cellSizeVal * 0.7);
        labels += `<text x="${offsetX - 15}" y="${y}" font-size="9" fill="${colors.text}" text-anchor="end" font-weight="bold">${months[month]}</text>\n`;
        lastMonth = month;
      }
    }
  } else {
    let lastMonth = -1;
    if (isIsometric) {
      // Month labels along the Bottom-Right edge
      const midW = (weeks - 1) / 2;
      const midD = 3;
      const factorX = cellSizeVal * 0.9 + isoGap;
      const factorY = cellSizeVal * 0.45 + isoGap / 2;

      let lastLabelW = -99;
      const minWeekGap = cellSizeVal < 12 ? 5 : 3; // Need more weeks gap for smaller cells

      for (let w = 0; w < weeks; w++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7));
        const month = currentDate.getMonth();
        
        // Only show month if it's a new month AND far enough from the last label
        if (month !== lastMonth && (w - lastLabelW) >= minWeekGap) {
          const labelOffset = cellSizeVal < 12 ? 12.5 : 9.5; // More offset for smaller cells
          const isoX = width / 2 + (w - labelOffset - (midW - midD)) * factorX;
          const isoY = (height - footerHeight) / 2 + (w + labelOffset - (midW + midD)) * factorY;
          const fontSize = cellSizeVal < 12 ? 7 : 8; 
          
          labels += `<text x="${isoX}" y="${isoY}" font-size="${fontSize}" fill="${colors.text}" opacity="0.45" font-weight="bold" transform="rotate(-30, ${isoX}, ${isoY})" text-anchor="start">${months[month]}</text>\n`;
          lastMonth = month;
          lastLabelW = w;
        }
      }

      // Day labels along the Bottom-Left edge
      const daysAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      daysAbbr.forEach((day, d) => {
        if (d % 2 === 0) { // Show Sun, Tue, Thu, Sat
          const labelOffset = cellSizeVal < 12 ? -3.5 : -1.8; // More offset for smaller cells
          const isoX = width / 2 + (labelOffset - d - (midW - midD)) * factorX;
          const isoY = (height - footerHeight) / 2 + (labelOffset + d - (midW + midD)) * factorY;
          const fontSize = cellSizeVal < 12 ? 7 : 8;

          labels += `<text x="${isoX}" y="${isoY}" font-size="${fontSize}" fill="${colors.text}" opacity="0.45" font-weight="bold" transform="rotate(30, ${isoX}, ${isoY})" text-anchor="end">${day}</text>\n`;
        }
      });
    } else {
      days.forEach((day, i) => {
        const y = offsetY + (i * 2 + 1) * (cellSizeVal + gap) + (cellSizeVal * 0.7);
        labels += `<text x="${offsetX - 10}" y="${y}" font-size="9" fill="${colors.text}" text-anchor="end" font-weight="bold">${day}</text>\n`;
      });

      for (let w = 0; w < weeks; w++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7));
        const month = currentDate.getMonth();
        if (month !== lastMonth) {
          const x = offsetX + w * (cellSizeVal + gap);
          labels += `<text x="${x}" y="${offsetY - 8}" font-size="9" fill="${colors.text}" font-weight="bold">${months[month]}</text>\n`;
          lastMonth = month;
        }
      }
    }
  }

  const neonFilter = theme === "neon" ? `<defs><filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs>` : "";

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&amp;display=swap');
        text { font-family: 'Inter', sans-serif; }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        @keyframes fade {
          0%, 40%, 100% { opacity: 0; transform: scale(0.9); }
          10%, 30% { opacity: 1; transform: scale(1); }
        }
        @keyframes wave {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes glimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; filter: brightness(1.8); }
        }
        rect, path, circle { transform-box: fill-box; transform-origin: center; transition: all 0.3s ease; }
        
        /* Interactive Legend */
        .legend-item { cursor: pointer; }
        
        /* When any legend item is hovered, dim the whole grid */
        .legend-item:hover ~ .grid-container rect,
        .legend-item:hover ~ .grid-container path,
        .legend-item:hover ~ .grid-container circle {
          opacity: 0.15;
          filter: grayscale(0.8);
        }
        
        /* Highlight specific levels */
        .l0:hover ~ .grid-container .lvl-0,
        .l1:hover ~ .grid-container .lvl-1,
        .l2:hover ~ .grid-container .lvl-2,
        .l3:hover ~ .grid-container .lvl-3,
        .l4:hover ~ .grid-container .lvl-4,
        .l-gh:hover ~ .grid-container .type-gh,
        .l-gl:hover ~ .grid-container .type-gl,
        .l-mg:hover ~ .grid-container .type-mg {
          opacity: 1 !important;
          filter: none !important;
          transform: scale(1.15);
        }
      </style>
      ${neonFilter}
      <rect width="100%" height="100%" fill="${colors.bg}" rx="8" />
      ${title ? `<text x="${width / 2}" y="35" font-size="18" font-weight="900" fill="${colors.text}" text-anchor="middle">${escapeHtml(title)}</text>` : ""}
      
      <!-- Legend (Direct Siblings) -->
      ${(() => {
        const lx = isVertical ? (width - 150) / 2 : offsetX;
        const ly = height - footerHeight + 25;
        const s = isVertical ? 8 : 10;
        if (isVertical) {
          return `
            <rect x="${lx}" y="${ly}" width="${s}" height="${s}" fill="${colors.github[3]}" rx="0" class="legend-item l-gh" />
            <text x="${lx + 12}" y="${ly + 8}" font-size="8" fill="${colors.text}" font-weight="bold" class="legend-item l-gh">GitHub</text>
            <rect x="${lx + 50}" y="${ly}" width="${s}" height="${s}" fill="${colors.gitlab[3]}" rx="0" class="legend-item l-gl" />
            <text x="${lx + 62}" y="${ly + 8}" font-size="8" fill="${colors.text}" font-weight="bold" class="legend-item l-gl">GitLab</text>
            <rect x="${lx + 104}" y="${ly}" width="${s}" height="${s}" fill="${colors.merged[3]}" rx="0" class="legend-item l-mg" />
            <text x="${lx + 116}" y="${ly + 8}" font-size="8" fill="${colors.text}" font-weight="bold" class="legend-item l-mg">Merged</text>
            
            <text x="${lx}" y="${ly + 22}" font-size="8" fill="${colors.text}" opacity="0.5">Less</text>
            <rect x="${lx + 25}" y="${ly + 14}" width="${s}" height="${s}" fill="${colors.empty}" rx="0" class="legend-item l0" />
            <rect x="${lx + 35}" y="${ly + 14}" width="${s}" height="${s}" fill="${colors.github[0]}" rx="0" class="legend-item l1" />
            <rect x="${lx + 45}" y="${ly + 14}" width="${s}" height="${s}" fill="${colors.github[1]}" rx="0" class="legend-item l2" />
            <rect x="${lx + 55}" y="${ly + 14}" width="${s}" height="${s}" fill="${colors.github[2]}" rx="0" class="legend-item l3" />
            <rect x="${lx + 65}" y="${ly + 14}" width="${s}" height="${s}" fill="${colors.github[3]}" rx="0" class="legend-item l4" />
            <text x="${lx + 80}" y="${ly + 22}" font-size="8" fill="${colors.text}" opacity="0.5">More</text>
          `;
        } else {
          return `
            <rect x="${lx}" y="${ly}" width="${s}" height="${s}" fill="${colors.github[3]}" rx="0" class="legend-item l-gh" />
            <text x="${lx + 14}" y="${ly + 9}" font-size="9" fill="${colors.text}" font-weight="bold" class="legend-item l-gh">GitHub</text>
            <rect x="${lx + 60}" y="${ly}" width="${s}" height="${s}" fill="${colors.gitlab[3]}" rx="0" class="legend-item l-gl" />
            <text x="${lx + 74}" y="${ly + 9}" font-size="9" fill="${colors.text}" font-weight="bold" class="legend-item l-gl">GitLab</text>
            <rect x="${lx + 118}" y="${ly}" width="${s}" height="${s}" fill="${colors.merged[3]}" rx="0" class="legend-item l-mg" />
            <text x="${lx + 132}" y="${ly + 9}" font-size="9" fill="${colors.text}" font-weight="bold" class="legend-item l-mg">Merged</text>
            
            <text x="${lx + gridWidth - 115}" y="${ly + 9}" font-size="8" fill="${colors.text}" opacity="0.5">Less</text>
            <rect x="${lx + gridWidth - 89}" y="${ly}" width="${s}" height="${s}" fill="${colors.empty}" rx="0" class="legend-item l0" />
            <rect x="${lx + gridWidth - 77}" y="${ly}" width="${s}" height="${s}" fill="${colors.github[0]}" rx="0" class="legend-item l1" />
            <rect x="${lx + gridWidth - 65}" y="${ly}" width="${s}" height="${s}" fill="${colors.github[1]}" rx="0" class="legend-item l2" />
            <rect x="${lx + gridWidth - 53}" y="${ly}" width="${s}" height="${s}" fill="${colors.github[2]}" rx="0" class="legend-item l3" />
            <rect x="${lx + gridWidth - 41}" y="${ly}" width="${s}" height="${s}" fill="${colors.github[3]}" rx="0" class="legend-item l4" />
            <text x="${lx + gridWidth - 25}" y="${ly + 9}" font-size="8" fill="${colors.text}" opacity="0.5">More</text>
          `;
        }
      })()}
      
      <g class="grid-container" ${theme === "neon" ? 'filter="url(#neon-glow)"' : ""}>${gridItems}</g>
      ${labels}
      ${!isPro ? `<text x="${width / 2}" y="${height - 10}" font-size="8" fill="${colors.text}" opacity="0.3" text-anchor="middle">Powered by GitComBridge</text>` : ""}
    </svg>
  `;
}

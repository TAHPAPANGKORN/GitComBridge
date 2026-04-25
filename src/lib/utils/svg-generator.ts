import { ContributionData } from "@/lib/types";
import { mergeContributions } from "./data-merger";

export function generateSVG(
  githubData: ContributionData,
  gitlabData: ContributionData,
  theme: 'dark' | 'light' = 'dark'
): string {
  const mergedData = mergeContributions(githubData, glDataWrapper(gitlabData));
  
  const colors = {
    dark: {
      bg: "#0d1117",
      text: "#8b949e",
      empty: "#161b22",
      github: ["#0e4429", "#006d32", "#26a641", "#39d353"],
      gitlab: ["#4a1a15", "#812a1d", "#b53523", "#e24329"],
      merged: ["#2d1a4d", "#4c2889", "#6b4fbb", "#9a70ff"]
    },
    light: {
      bg: "#ffffff",
      text: "#57606a",
      empty: "#ebedf0",
      github: ["#9be9a8", "#40c463", "#30a14e", "#216e39"],
      gitlab: ["#ffd6d1", "#ff8a7a", "#e24329", "#a11d0a"],
      merged: ["#d8b4fe", "#a855f7", "#7c3aed", "#5b21b6"]
    }
  }[theme];

  const getLevelColor = (count: number, type: 'github' | 'gitlab' | 'merged'): string => {
    if (count === 0) return colors.empty;
    let level = 0;
    if (count >= 10) level = 3;
    else if (count >= 6) level = 2;
    else if (count >= 3) level = 1;
    else level = 0;
    return (colors as any)[type][level];
  };

  const cellSize = 10;
  const gap = 2;
  const leftPadding = 30; // Space for Mon, Wed, Fri
  const topPadding = 30;  // Space for Month labels
  const width = 53 * (cellSize + gap) + leftPadding + 20;
  const graphHeight = 7 * (cellSize + gap) + topPadding + 10;
  const footerHeight = 35;
  const totalHeight = graphHeight + footerHeight;

  // Timeline Logic
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - 365);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Align to Sunday

  // 1. Month Labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let monthLabels = "";
  let lastMonth = -1;

  // 2. Day Labels
  const dayLabels = `
    <text x="10" y="${topPadding + (cellSize + gap) * 1 + 8}" class="text day-label">Mon</text>
    <text x="10" y="${topPadding + (cellSize + gap) * 3 + 8}" class="text day-label">Wed</text>
    <text x="10" y="${topPadding + (cellSize + gap) * 5 + 8}" class="text day-label">Fri</text>
  `;

  // 3. Squares
  let cells = "";
  for (let col = 0; col < 53; col++) {
    const colDate = new Date(startDate);
    colDate.setDate(startDate.getDate() + col * 7);
    
    // Check if we should draw month label
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
      if (ghCount > 0 && glCount > 0) color = getLevelColor(totalCount, 'merged');
      else if (ghCount > 0) color = getLevelColor(ghCount, 'github');
      else if (glCount > 0) color = getLevelColor(glCount, 'gitlab');

      cells += `<rect x="${col * (cellSize + gap) + leftPadding}" y="${row * (cellSize + gap) + topPadding}" width="${cellSize}" height="${cellSize}" fill="${color}" rx="2" />`;
    }
  }

  return `
    <svg width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${totalHeight}" fill="${colors.bg}" rx="8" />
      <style>
        .text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 600; fill: ${colors.text}; }
        .month-label { font-weight: 400; }
        .day-label { font-weight: 400; }
        .label-small { font-size: 8px; font-weight: 400; }
      </style>
      
      ${monthLabels}
      ${dayLabels}
      ${cells}
      
      <!-- Detailed Legend -->
      <g transform="translate(${leftPadding}, ${totalHeight - 15})">
        <g>
          <rect width="8" height="8" fill="${colors.github[2]}" rx="1" />
          <text x="12" y="7" class="text label-small">GitHub</text>
          
          <rect x="55" width="8" height="8" fill="${colors.gitlab[2]}" rx="1" />
          <text x="67" y="7" class="text label-small">GitLab</text>
          
          <rect x="110" width="8" height="8" fill="${colors.merged[2]}" rx="1" />
          <text x="122" y="7" class="text label-small">Merged</text>
        </g>

        <g transform="translate(${53 * (cellSize + gap) - 100}, 0)">
          <text x="-25" y="7" class="text label-small">Less</text>
          <rect x="-5" width="8" height="8" fill="${colors.empty}" rx="1" />
          <rect x="5" width="8" height="8" fill="${theme === 'dark' ? colors.github[1] : colors.github[0]}" rx="1" />
          <rect x="15" width="8" height="8" fill="${theme === 'dark' ? colors.github[2] : colors.github[1]}" rx="1" />
          <rect x="25" width="8" height="8" fill="${theme === 'dark' ? colors.github[3] : colors.github[2]}" rx="1" />
          <text x="38" y="7" class="text label-small">More</text>
        </g>
      </g>
    </svg>
  `;
}

function glDataWrapper(data: any) {
  return data || {};
}

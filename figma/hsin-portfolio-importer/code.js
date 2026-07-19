const SITE_URL = "https://hsin-hsin-yuan-portfolio.vercel.app";

const TOKENS = {
  stage: { name: "color/stage", value: "#050807" },
  fog: { name: "color/fog", value: "#dddcd7" },
  paper: { name: "color/paper", value: "#f6f4ee" },
  coral: { name: "color/signal-coral", value: "#f0645a" },
  cobalt: { name: "color/signal-cobalt", value: "#4867d9" },
  moss: { name: "color/signal-moss", value: "#4d9259" },
  stageInk: { name: "color/stage-ink", value: "#f6f4ee" },
  ink: { name: "color/ink", value: "#121613" },
  quietInk: { name: "color/quiet-ink", value: "#636660" },
  lineDark: { name: "color/line-dark", value: "#2f3430" },
  lineLight: { name: "color/line-light", value: "#b7b8b2" },
};

const COPY = {
  name: "Hsin-Hsin Yuan",
  role: "Documentary director, writer & cross-cultural story partner.",
  statement: "I listen for the human turn inside complex material, then shape it into",
  accent: "stories that travel",
  contactTitle: "Let’s build a story with signal.",
  contactBody:
    "For documentary, cultural, branded, AI-language, and cross-cultural production collaborations.",
};

const ASSETS = {
  heroBackground: "/assets/portfolio/hsin-working-white-space.jpg",
  portraitForeground: "/assets/portfolio/hsin-portrait-foreground.webp",
  abstract: "/assets/portfolio/my-art-my-voice-performance-2.jpg",
};

const PRACTICE_MODES = [
  {
    id: "documentary",
    label: "Documentary direction",
    sceneName: "Practice mode / Documentary direction",
    verb: "Listen",
    title: "Find the human turn.",
    body: "Research, interviews, field direction, and editing built around what a person is really trying to say.",
    signal: TOKENS.coral.value,
    primary: "/assets/portfolio/my-art-my-voice-performance-2.jpg",
    supporting: "/assets/portfolio/my-art-my-voice-interview.jpg",
  },
  {
    id: "cross-cultural",
    label: "Cross-cultural story",
    sceneName: "Practice mode / Cross-cultural story",
    verb: "Translate",
    title: "Carry context without flattening it.",
    body: "Bilingual judgment and cultural framing for stories moving between Taiwan and international audiences.",
    signal: TOKENS.cobalt.value,
    primary: "/assets/portfolio/paris-cultural-olympiad-team.jpg",
    supporting: "/assets/portfolio/top-gear-uk-special-car.jpg",
  },
  {
    id: "editorial-systems",
    label: "Editorial systems",
    sceneName: "Practice mode / Editorial systems",
    verb: "Build",
    title: "Make good judgment repeatable.",
    body: "Story frameworks and AI-assisted editorial workflows that keep facts, voice, and human decisions visible.",
    signal: TOKENS.moss.value,
    primary: "/assets/portfolio/india-overclocking-production.jpg",
    supporting: "/assets/portfolio/hsin-working-white-space.jpg",
  },
];

const WORKS = [
  {
    slug: "slow-steps",
    title: "Slow Steps",
    sceneName: "Work theatre / Slow Steps",
    year: "2026",
    role: "Director / Editor / Producer",
    platform: "TaiwanPlus / Travel",
    tagline: "A quiet travel documentary shaped through observation, time, and becoming.",
    image: "",
    supporting: "",
    signal: TOKENS.moss.value,
  },
  {
    slug: "tech-dreamers",
    title: "Tech Dreamers",
    sceneName: "Work theatre / Tech Dreamers",
    year: "2025",
    role: "Director / Editor / Producer",
    platform: "TaiwanPlus",
    tagline: "Taiwanese founders building the future.",
    image: "/assets/portfolio/india-overclocking-production.jpg",
    supporting: "/assets/portfolio/hsin-working-white-space.jpg",
    signal: TOKENS.cobalt.value,
  },
  {
    slug: "my-art-my-voice",
    title: "My Art, My Voice",
    sceneName: "Work theatre / My Art, My Voice",
    year: "2025",
    role: "Lead Documentary Director",
    platform: "TaiwanPlus",
    tagline: "Artists. Identity. Taiwan on the world stage.",
    image: "/assets/portfolio/my-art-my-voice-performance-2.jpg",
    supporting: "/assets/portfolio/my-art-my-voice-performance-1.jpg",
    signal: TOKENS.coral.value,
  },
];

const FONT_CANDIDATES = {
  sans: [
    { family: "Helvetica Neue", style: "Regular" },
    { family: "Inter", style: "Regular" },
  ],
  sansMedium: [
    { family: "Helvetica Neue", style: "Medium" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Regular" },
  ],
  serifItalic: [
    { family: "Iowan Old Style", style: "Italic" },
    { family: "Baskerville", style: "Italic" },
    { family: "Inter", style: "Italic" },
    { family: "Inter", style: "Regular" },
  ],
};

const fonts = {};

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function solid(hex, opacity = 1) {
  return [{ type: "SOLID", color: hexToRgb(hex), opacity }];
}

async function loadFontRole(role) {
  for (const candidate of FONT_CANDIDATES[role]) {
    try {
      await figma.loadFontAsync(candidate);
      fonts[role] = candidate;
      return;
    } catch (error) {
      // Continue to the next local fallback.
    }
  }
  throw new Error(`No usable font found for ${role}`);
}

async function loadFonts() {
  await Promise.all(Object.keys(FONT_CANDIDATES).map(loadFontRole));
}

function place(node, x, y) {
  node.x = x;
  node.y = y;
  return node;
}

function frame(parent, name, width, height, options = {}) {
  const node = figma.createFrame();
  node.name = name;
  node.resize(width, height);
  node.fills = solid(options.fill || TOKENS.paper.value);
  node.clipsContent = options.clip ?? true;
  parent.appendChild(node);
  return place(node, options.x || 0, options.y || 0);
}

function rectangle(parent, name, x, y, width, height, options = {}) {
  const node = figma.createRectangle();
  node.name = name;
  node.resize(width, height);
  node.fills = solid(options.fill || TOKENS.stage.value, options.opacity ?? 1);
  node.cornerRadius = options.radius || 0;
  parent.appendChild(node);
  return place(node, x, y);
}

function ellipse(parent, name, x, y, width, height, color, opacity = 0.42) {
  const node = figma.createEllipse();
  node.name = name;
  node.resize(width, height);
  node.fills = solid(color, opacity);
  node.effects = [{ type: "LAYER_BLUR", radius: Math.round(Math.min(width, height) * 0.22), visible: true }];
  parent.appendChild(node);
  return place(node, x, y);
}

function rule(parent, name, x, y, width, color) {
  return rectangle(parent, name, x, y, width, 1, { fill: color });
}

function text(parent, name, value, x, y, options = {}) {
  const node = figma.createText();
  node.name = name;
  node.fontName = fonts[options.font || "sans"];
  node.fontSize = options.size || 16;
  node.lineHeight = { unit: "PERCENT", value: options.lineHeight || 120 };
  node.fills = solid(options.color || TOKENS.ink.value, options.opacity ?? 1);
  node.characters = value;
  node.textAutoResize = options.width ? "HEIGHT" : "WIDTH_AND_HEIGHT";
  if (options.width) node.resize(options.width, node.height);
  parent.appendChild(node);
  return place(node, x, y);
}

async function imageBox(parent, name, assetPath, x, y, width, height, options = {}) {
  const rect = rectangle(parent, name, x, y, width, height, {
    fill: options.fallback || TOKENS.lineDark.value,
    radius: options.radius || 0,
  });
  if (!assetPath) return rect;

  try {
    const image = await figma.createImageAsync(`${SITE_URL}${assetPath}`);
    rect.fills = [{ type: "IMAGE", imageHash: image.hash, scaleMode: options.fit ? "FIT" : "FILL" }];
  } catch (error) {
    text(parent, `${name} / replace media`, assetPath, x + 14, y + height - 28, {
      size: 11,
      color: TOKENS.stageInk.value,
      opacity: 0.62,
      width: Math.max(80, width - 28),
    });
  }
  return rect;
}

function phaseLabel(parent, number, title, x, y, color) {
  ellipse(parent, `${number} phase marker`, x, y + 2, 10, 10, color, 1);
  text(parent, `${number} phase label`, `${number} / ${title}`, x + 20, y, {
    size: 13,
    color,
  });
}

function createTokenPage() {
  const page = figma.createPage();
  page.name = "02 Scene Tokens";
  const board = frame(page, "Portrait scene design tokens", 900, 700, { fill: TOKENS.stage.value, clip: false });

  text(board, "Token title", "Portrait scene tokens", 48, 44, {
    size: 42,
    font: "sansMedium",
    color: TOKENS.stageInk.value,
  });
  text(board, "Token note", "Stage and reading surfaces stay quiet; each practice mode owns one local signal.", 48, 104, {
    size: 16,
    color: TOKENS.stageInk.value,
    opacity: 0.68,
    width: 660,
  });

  Object.values(TOKENS).forEach((token, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 48 + column * 408;
    const y = 170 + row * 80;
    rectangle(board, `${token.name} swatch`, x, y, 56, 56, { fill: token.value, radius: 10 });
    text(board, `${token.name} label`, `${token.name}\n${token.value}`, x + 74, y + 4, {
      size: 13,
      color: TOKENS.stageInk.value,
      lineHeight: 145,
    });
  });
}

async function createPortraitCarrierPage() {
  const page = figma.createPage();
  page.name = "03 Portrait Carrier";

  const opening = frame(page, "Portrait carrier / Opening", 1440, 900, {
    fill: TOKENS.stage.value,
    x: 0,
  });
  ellipse(opening, "Signal field / Coral", 780, 70, 560, 560, TOKENS.coral.value, 0.3);
  phaseLabel(opening, "01", "Opening · 0–25%", 56, 44, TOKENS.stageInk.value);
  text(opening, "Navigation", "Works　Practice　Contact　中", 1060, 44, {
    size: 13,
    color: TOKENS.stageInk.value,
    opacity: 0.7,
  });
  await imageBox(opening, "Opening frame / Background media", ASSETS.abstract, 152, 104, 1136, 690, { radius: 42 });
  rectangle(opening, "Opening frame / Dark veil", 152, 104, 1136, 690, {
    fill: TOKENS.stage.value,
    opacity: 0.32,
    radius: 42,
  });
  await imageBox(opening, "Foreground portrait / Opening", ASSETS.portraitForeground, 430, 142, 580, 652, { fit: true });
  text(opening, "Name / Opening", COPY.name, 56, 650, {
    size: 88,
    font: "sansMedium",
    color: TOKENS.stageInk.value,
  });
  text(opening, "Role / Opening", COPY.role, 1025, 682, {
    size: 22,
    color: TOKENS.stageInk.value,
    width: 330,
  });

  const release = frame(page, "Portrait carrier / Release", 1440, 900, {
    fill: TOKENS.fog.value,
    x: 1500,
  });
  ellipse(release, "Signal field / Released coral", 360, 90, 720, 700, TOKENS.coral.value, 0.18);
  phaseLabel(release, "02", "Release · 25–48%", 56, 44, TOKENS.ink.value);
  text(release, "Navigation", "Works　Practice　Contact　中", 1060, 44, {
    size: 13,
    color: TOKENS.ink.value,
    opacity: 0.62,
  });
  await imageBox(release, "Replaceable abstract layer", ASSETS.abstract, 72, 150, 410, 270, { radius: 22 });
  await imageBox(release, "Released opening frame", ASSETS.heroBackground, 1010, 144, 320, 212, { radius: 22 });
  await imageBox(release, "Foreground portrait / Release", ASSETS.portraitForeground, 442, 110, 560, 730, { fit: true });
  text(release, "Name / Release", COPY.name, 64, 540, { size: 76, font: "sansMedium", width: 420 });
  text(release, "Role / Release", COPY.role, 1010, 518, { size: 21, width: 330, lineHeight: 140 });
  text(release, "Statement", COPY.statement, 64, 712, { size: 28, width: 560, lineHeight: 130 });
  text(release, "Editorial accent", COPY.accent, 1010, 716, { size: 36, font: "serifItalic", width: 330 });
  rule(release, "Release baseline", 64, 840, 1312, TOKENS.lineLight.value);
}

function practiceRail(scene, activeId, signal) {
  PRACTICE_MODES.forEach((mode, index) => {
    const active = mode.id === activeId;
    const x = 70 + index * 220;
    ellipse(scene, `Mode marker / ${mode.label}`, x, 96, active ? 12 : 6, active ? 12 : 6, active ? signal : TOKENS.quietInk.value, 1);
    text(scene, `Mode label / ${mode.label}`, mode.label, x + 20, 93, {
      size: 13,
      font: active ? "sansMedium" : "sans",
      color: active ? TOKENS.ink.value : TOKENS.quietInk.value,
    });
  });
}

async function createPracticeModeScene(page, mode, index) {
  const scene = frame(page, mode.sceneName, 1440, 900, {
    fill: index % 2 === 0 ? TOKENS.fog.value : TOKENS.paper.value,
    x: index * 1500,
  });
  ellipse(scene, `Signal field / ${mode.label}`, 370, 105, 720, 680, mode.signal, 0.2);
  phaseLabel(scene, `0${index + 3}`, `Practice · ${mode.label}`, 70, 44, TOKENS.ink.value);
  practiceRail(scene, mode.id, mode.signal);
  await imageBox(scene, `Practice media / ${mode.label} / Primary`, mode.primary, 72, 185, 390, 278, { radius: 18 });
  await imageBox(scene, `Practice media / ${mode.label} / Supporting`, mode.supporting, 1045, 470, 310, 220, { radius: 18 });
  await imageBox(scene, `Foreground portrait / ${mode.label}`, ASSETS.portraitForeground, 440, 125, 560, 720, { fit: true });
  text(scene, `Verb / ${mode.label}`, mode.verb, 72, 535, {
    size: 40,
    font: "serifItalic",
    color: mode.signal,
  });
  text(scene, `Title / ${mode.label}`, mode.title, 72, 605, {
    size: 38,
    font: "sansMedium",
    width: 360,
    lineHeight: 116,
  });
  text(scene, `Body / ${mode.label}`, mode.body, 1045, 205, {
    size: 18,
    width: 310,
    lineHeight: 150,
  });
  rule(scene, `Baseline / ${mode.label}`, 72, 842, 1283, TOKENS.lineLight.value);
}

async function createPracticeModesPage() {
  const page = figma.createPage();
  page.name = "04 Practice Modes";
  for (let index = 0; index < PRACTICE_MODES.length; index += 1) {
    await createPracticeModeScene(page, PRACTICE_MODES[index], index);
  }
}

async function createWorkScene(page, work, index) {
  const scene = frame(page, work.sceneName, 1440, 900, {
    fill: TOKENS.stage.value,
    x: index * 1500,
  });
  ellipse(scene, `Signal field / ${work.title}`, 810, 80, 560, 650, work.signal, 0.16);
  phaseLabel(scene, String(index + 1).padStart(2, "0"), "Work theatre", 64, 44, TOKENS.stageInk.value);
  text(scene, `Meta / ${work.title}`, `${work.year} · ${work.platform}`, 1110, 44, {
    size: 13,
    color: TOKENS.stageInk.value,
    opacity: 0.64,
    width: 250,
  });

  if (work.image) {
    await imageBox(scene, `Dominant proof / ${work.title}`, work.image, 64, 118, 850, 650, { radius: 24 });
  } else {
    rectangle(scene, "Slow Steps / Text-led field", 64, 118, 850, 650, {
      fill: TOKENS.stage.value,
      radius: 24,
    });
    ellipse(scene, "Slow Steps / Moss atmosphere", 160, 210, 650, 450, work.signal, 0.17);
    text(scene, "Slow Steps / Field title", "Slow\nSteps", 126, 300, {
      size: 116,
      font: "serifItalic",
      color: TOKENS.stageInk.value,
      lineHeight: 90,
    });
  }

  if (work.supporting) {
    await imageBox(scene, `Supporting proof / ${work.title}`, work.supporting, 760, 570, 220, 170, { radius: 14 });
  }
  text(scene, `Title / ${work.title}`, work.title, 980, 170, {
    size: 50,
    font: "sansMedium",
    color: TOKENS.stageInk.value,
    width: 370,
    lineHeight: 112,
  });
  text(scene, `Tagline / ${work.title}`, work.tagline, 980, 310, {
    size: 25,
    font: "serifItalic",
    color: TOKENS.stageInk.value,
    width: 350,
    lineHeight: 130,
  });
  text(scene, `Role / ${work.title}`, work.role, 980, 610, {
    size: 14,
    font: "sansMedium",
    color: work.signal,
    width: 320,
  });
  rule(scene, `Action rule / ${work.title}`, 980, 700, 370, work.signal);
  text(scene, `Action / ${work.title}`, "View project ↗", 980, 726, {
    size: 14,
    color: TOKENS.stageInk.value,
  });
}

async function createWorkTheatrePage() {
  const page = figma.createPage();
  page.name = "05 Work Theatre";
  for (let index = 0; index < WORKS.length; index += 1) {
    await createWorkScene(page, WORKS[index], index);
  }
}

async function createMobilePage() {
  const page = figma.createPage();
  page.name = "06 Mobile Static";
  const mobile = frame(page, "Mobile / Static stacked flow", 390, 4200, { fill: TOKENS.paper.value });

  rectangle(mobile, "Mobile / Opening stage", 0, 0, 390, 530, { fill: TOKENS.stage.value });
  text(mobile, "Mobile / Brand", COPY.name, 20, 24, { size: 12, color: TOKENS.stageInk.value });
  text(mobile, "Mobile / Navigation", "Works　Contact　中", 270, 24, { size: 11, color: TOKENS.stageInk.value, opacity: 0.68 });
  ellipse(mobile, "Mobile / Opening signal", 82, 80, 250, 330, TOKENS.coral.value, 0.28);
  await imageBox(mobile, "Mobile / Opening background", ASSETS.abstract, 20, 68, 350, 350, { radius: 24 });
  rectangle(mobile, "Mobile / Dark veil", 20, 68, 350, 350, { fill: TOKENS.stage.value, opacity: 0.28, radius: 24 });
  await imageBox(mobile, "Mobile / Foreground portrait", ASSETS.portraitForeground, 78, 92, 235, 410, { fit: true });
  text(mobile, "Mobile / Name", COPY.name, 20, 430, { size: 42, font: "sansMedium", color: TOKENS.stageInk.value });

  rectangle(mobile, "Mobile / Release field", 0, 530, 390, 245, { fill: TOKENS.fog.value });
  text(mobile, "Mobile / Role", COPY.role, 20, 570, { size: 19, width: 348, lineHeight: 136 });
  text(mobile, "Mobile / Statement", COPY.statement, 20, 650, { size: 16, color: TOKENS.quietInk.value, width: 348, lineHeight: 140 });
  text(mobile, "Mobile / Editorial accent", COPY.accent, 20, 715, { size: 28, font: "serifItalic" });

  for (let index = 0; index < PRACTICE_MODES.length; index += 1) {
    const mode = PRACTICE_MODES[index];
    const y = 790 + index * 430;
    text(mobile, `Mobile / Practice verb / ${mode.label}`, mode.verb, 22, y, { size: 25, font: "serifItalic", color: mode.signal });
    text(mobile, `Mobile / Practice title / ${mode.label}`, mode.title, 22, y + 50, { size: 28, font: "sansMedium", width: 346 });
    await imageBox(mobile, `Mobile / Practice primary / ${mode.label}`, mode.primary, 22, y + 120, 218, 168, { radius: 12 });
    await imageBox(mobile, `Mobile / Practice supporting / ${mode.label}`, mode.supporting, 252, y + 188, 116, 100, { radius: 10 });
    text(mobile, `Mobile / Practice body / ${mode.label}`, mode.body, 22, y + 320, { size: 14, color: TOKENS.quietInk.value, width: 346, lineHeight: 142 });
  }

  rectangle(mobile, "Mobile / Work theatre", 0, 2110, 390, 1640, { fill: TOKENS.stage.value });
  text(mobile, "Mobile / Work theatre title", "Selected work", 22, 2138, { size: 13, color: TOKENS.stageInk.value });
  for (let index = 0; index < WORKS.length; index += 1) {
    const work = WORKS[index];
    const y = 2180 + index * 520;
    if (work.image) {
      await imageBox(mobile, `Mobile / Dominant proof / ${work.title}`, work.image, 22, y, 346, 248, { radius: 14 });
    } else {
      rectangle(mobile, "Mobile / Slow Steps text-led field", 22, y, 346, 248, { fill: TOKENS.lineDark.value, radius: 14 });
      text(mobile, "Mobile / Slow Steps field title", "Slow\nSteps", 44, y + 52, { size: 54, font: "serifItalic", color: TOKENS.stageInk.value, lineHeight: 92 });
    }
    text(mobile, `Mobile / Meta / ${work.title}`, `${work.year} · ${work.role}`, 22, y + 270, { size: 12, color: work.signal, width: 346 });
    text(mobile, `Mobile / Title / ${work.title}`, work.title, 22, y + 315, { size: 34, font: "sansMedium", color: TOKENS.stageInk.value, width: 346 });
    text(mobile, `Mobile / Tagline / ${work.title}`, work.tagline, 22, y + 380, { size: 17, font: "serifItalic", color: TOKENS.stageInk.value, width: 346, lineHeight: 135 });
    text(mobile, `Mobile / Action / ${work.title}`, "View project ↗", 22, y + 465, { size: 13, color: TOKENS.stageInk.value, opacity: 0.72 });
  }

  rectangle(mobile, "Mobile / Contact field", 0, 3750, 390, 450, { fill: TOKENS.paper.value });
  text(mobile, "Mobile / Contact label", "Contact", 22, 3792, { size: 12, color: TOKENS.quietInk.value });
  text(mobile, "Mobile / Contact title", COPY.contactTitle, 22, 3850, { size: 39, font: "sansMedium", width: 346, lineHeight: 110 });
  text(mobile, "Mobile / Contact body", COPY.contactBody, 22, 3970, { size: 14, color: TOKENS.quietInk.value, width: 346, lineHeight: 142 });
  rectangle(mobile, "Mobile / Contact action", 22, 4118, 346, 54, { fill: TOKENS.stage.value, radius: 27 });
  text(mobile, "Mobile / Contact action label", "Send inquiry", 142, 4137, { size: 14, color: TOKENS.stageInk.value });
}

async function main() {
  await loadFonts();
  createTokenPage();
  await createPortraitCarrierPage();
  await createPracticeModesPage();
  await createWorkTheatrePage();
  await createMobilePage();

  const firstScenePage = figma.root.children.find((page) => page.name === "03 Portrait Carrier");
  figma.currentPage = firstScenePage || figma.currentPage;
  if (figma.currentPage.children.length) {
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  }
  figma.closePlugin("Portrait-carrier portfolio design layer created.");
}

main().catch((error) => {
  figma.closePlugin(`Importer failed: ${error.message}`);
});

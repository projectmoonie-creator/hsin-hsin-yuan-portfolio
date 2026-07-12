const SITE_URL = "https://hsin-hsin-yuan-portfolio.vercel.app";

const TOKENS = {
  bg: { name: "color/bg", value: "#0B0B0C" },
  ink: { name: "color/ink", value: "#F7F2E8" },
  muted: { name: "color/muted", value: "#B8B0A3" },
  line: { name: "color/line", value: "#3F3D3A" },
  panel: { name: "color/panel", value: "#1A1A1C" },
  acid: { name: "color/accent-acid", value: "#D8FF3E" },
  heat: { name: "color/accent-heat", value: "#FF4D1F" },
  blue: { name: "color/accent-blue", value: "#7CC7FF" },
};

const COPY = {
  heroEyebrow: "Documentary direction for artists, culture, and technology stories",
  heroTitle: ["HSIN-HSIN", "YUAN"],
  heroRoles: ["Documentary Director / Writer / Producer", "/ Cross-Cultural Storyteller"],
  heroSubcopy:
    "I direct and develop documentary stories for artists, culture, and technology teams working across Taiwan and international contexts. I help complex subjects become human, cinematic, and clear enough to travel.",
  aboutLead:
    "I am a Taiwan-born documentary director and creative producer for artists, cultural institutions, factual producers, and technology teams that need stories shaped with research, empathy, and cross-cultural judgment.",
  aboutBody:
    "My work often begins before the camera: listening, researching, structuring interviews, and translating a complicated subject into a story that can move across languages and audiences.",
  contactTitle: "Let’s build a story with signal.",
  contactSubcopy:
    "For documentary, cultural, branded, AI-language, and cross-cultural production collaborations. Send a brief note about the project, timeline, and what kind of partner you need.",
};

const ASSETS = {
  hero: "/assets/portfolio/hsin-working-white-space.jpg",
  myArt: "/assets/portfolio/my-art-my-voice-performance-2.jpg",
  tech: "/assets/portfolio/hsin-working-white-space.jpg",
  taiwanplus: "/assets/logos/taiwanplus.svg",
};

const LOGOS = ["TaiwanPlus", "PTS", "DRAGON TV", "WMW", "TICFF", "ScreenHouse", "幸福空間"];

const WORKS = [
  {
    title: "My Art, My Voice",
    meta: "2024-2025 / Lead Documentary Director / TaiwanPlus",
    tagline: "Artists. Identity. Taiwan on the world stage.",
    description: "A documentary on the Paris Cultural Olympiad, creative freedom, and the voices behind performance.",
    image: ASSETS.myArt,
  },
  {
    title: "Slow Steps",
    meta: "2026 / Director / Editor / Producer / Independent Travel Documentary",
    tagline: "A quiet travel documentary shaped through observation, time, and becoming.",
    description: "A poetic personal work that follows travel as a way of paying attention.",
    image: "",
  },
  {
    title: "Tech Dreamers",
    meta: "2025 / Director / Editor / Producer / TaiwanPlus",
    tagline: "Taiwanese founders building the future.",
    description: "From AI to deep tech, stories of people turning ideas into tomorrow.",
    image: ASSETS.tech,
  },
];

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function solid(hex) {
  return [{ type: "SOLID", color: hexToRgb(hex) }];
}

function setAutoLayout(node, direction, gap, padding) {
  node.layoutMode = direction;
  node.itemSpacing = gap;
  node.paddingTop = padding;
  node.paddingRight = padding;
  node.paddingBottom = padding;
  node.paddingLeft = padding;
}

async function loadFonts() {
  const fonts = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Bold" },
    { family: "Inter", style: "Black" },
  ];

  for (const font of fonts) {
    try {
      await figma.loadFontAsync(font);
    } catch (error) {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    }
  }
}

function text(parent, name, value, options = {}) {
  const node = figma.createText();
  node.name = name;
  node.characters = value;
  node.fontName = { family: "Inter", style: options.style || "Regular" };
  node.fontSize = options.size || 16;
  node.lineHeight = { unit: "PERCENT", value: options.lineHeight || 120 };
  node.fills = solid(options.color || TOKENS.ink.value);
  node.textCase = options.uppercase ? "UPPER" : "ORIGINAL";
  if (options.width) {
    node.resize(options.width, node.height);
    node.textAutoResize = "HEIGHT";
  }
  parent.appendChild(node);
  return node;
}

function frame(parent, name, width, height, options = {}) {
  const node = figma.createFrame();
  node.name = name;
  node.resize(width, height);
  node.fills = solid(options.fill || TOKENS.bg.value);
  node.clipsContent = false;
  parent.appendChild(node);
  return node;
}

function box(parent, name, width, height, options = {}) {
  const node = figma.createRectangle();
  node.name = name;
  node.resize(width, height);
  node.fills = solid(options.fill || TOKENS.panel.value);
  node.cornerRadius = options.radius || 8;
  parent.appendChild(node);
  return node;
}

async function imageBox(parent, name, width, height, assetPath) {
  const rect = box(parent, name, width, height, { fill: "#222225", radius: 8 });
  if (!assetPath) {
    text(parent, `${name} / image pending`, "image pending", {
      size: 12,
      color: TOKENS.muted.value,
      width,
    });
    return rect;
  }
  try {
    const image = await figma.createImageAsync(`${SITE_URL}${assetPath}`);
    rect.fills = [
      {
        type: "IMAGE",
        imageHash: image.hash,
        scaleMode: "FILL",
      },
    ];
  } catch (error) {
    text(parent, `${name} / missing image label`, assetPath, {
      size: 12,
      color: TOKENS.muted.value,
      width,
    });
  }
  return rect;
}

function section(parent, name, width) {
  const node = frame(parent, name, width, 10, { fill: TOKENS.bg.value });
  setAutoLayout(node, "VERTICAL", 24, 0);
  node.layoutSizingVertical = "HUG";
  return node;
}

function sectionTitle(parent, value) {
  return text(parent, "Section title", value, {
    size: 12,
    style: "Bold",
    color: TOKENS.acid.value,
    uppercase: true,
  });
}

function createTokenPage() {
  const page = figma.createPage();
  page.name = "02 Design System";

  const swatches = frame(page, "Design tokens", 760, 560, { fill: TOKENS.bg.value });
  setAutoLayout(swatches, "VERTICAL", 16, 40);

  text(swatches, "Title", "Design Tokens", { size: 40, style: "Black" });
  Object.values(TOKENS).forEach((token) => {
    const row = frame(swatches, token.name, 520, 44, { fill: TOKENS.bg.value });
    setAutoLayout(row, "HORIZONTAL", 16, 0);
    box(row, `${token.name} swatch`, 44, 44, { fill: token.value, radius: 4 });
    text(row, `${token.name} label`, `${token.name}  ${token.value}`, {
      size: 14,
      color: TOKENS.ink.value,
    });
  });
}

async function createDesktopPage() {
  const page = figma.createPage();
  page.name = "03 Desktop Layouts";

  const desktop = frame(page, "Desktop / Portfolio", 1440, 5200, { fill: TOKENS.bg.value });
  setAutoLayout(desktop, "VERTICAL", 72, 64);

  const topbar = frame(desktop, "Topbar / Desktop", 1312, 44, { fill: TOKENS.bg.value });
  setAutoLayout(topbar, "HORIZONTAL", 32, 0);
  text(topbar, "Brand", "HSIN-HSIN YUAN", { size: 12, style: "Bold" });
  text(topbar, "Navigation", "About    Works    Contact    中", { size: 12, style: "Bold", color: TOKENS.muted.value });

  const hero = frame(desktop, "Hero / Desktop editable", 1312, 720, { fill: TOKENS.bg.value });
  setAutoLayout(hero, "HORIZONTAL", 64, 0);
  await imageBox(hero, "Hero image fill / hsin working white space", 690, 580, ASSETS.hero);
  const heroCopy = frame(hero, "Hero copy", 520, 580, { fill: TOKENS.bg.value });
  setAutoLayout(heroCopy, "VERTICAL", 18, 0);
  text(heroCopy, "Hero eyebrow", COPY.heroEyebrow, { size: 12, style: "Bold", color: TOKENS.acid.value, uppercase: true, width: 460 });
  text(heroCopy, "Hero title line 1", COPY.heroTitle[0], { size: 104, style: "Black", lineHeight: 86 });
  text(heroCopy, "Hero title line 2", COPY.heroTitle[1], { size: 104, style: "Black", lineHeight: 86 });
  text(heroCopy, "Hero role line 1", COPY.heroRoles[0], { size: 24, style: "Bold", width: 520 });
  text(heroCopy, "Hero role line 2 / slash should be accent", COPY.heroRoles[1], { size: 24, style: "Bold", color: TOKENS.acid.value, width: 520 });
  text(heroCopy, "Hero subcopy", COPY.heroSubcopy, { size: 19, lineHeight: 145, width: 500 });

  const logos = section(desktop, "Platforms & Collaborations / Logo wall", 1312);
  sectionTitle(logos, "Platforms & Collaborations");
  const logoRow = frame(logos, "Borderless logo strip", 1312, 72, { fill: TOKENS.bg.value });
  setAutoLayout(logoRow, "HORIZONTAL", 52, 0);
  LOGOS.forEach((logo) => {
    text(logoRow, `Logo / ${logo}`, logo, { size: 22, style: "Black", color: TOKENS.muted.value });
  });

  const about = section(desktop, "About", 1312);
  sectionTitle(about, "About");
  text(about, "About lead", COPY.aboutLead, { size: 30, style: "Bold", lineHeight: 112, width: 900 });
  text(about, "About body", COPY.aboutBody, { size: 18, lineHeight: 145, color: TOKENS.muted.value, width: 780 });

  const works = section(desktop, "Featured Works", 1312);
  sectionTitle(works, "Featured Works");
  const workRow = frame(works, "Editable work cards", 1312, 560, { fill: TOKENS.bg.value });
  setAutoLayout(workRow, "HORIZONTAL", 20, 0);
  for (const item of WORKS) {
    const card = frame(workRow, `Work card / ${item.title}`, 410, 540, { fill: TOKENS.panel.value });
    setAutoLayout(card, "VERTICAL", 14, 14);
    await imageBox(card, `Poster / ${item.title}`, 382, 215, item.image);
    text(card, "Meta", item.meta, { size: 11, style: "Bold", color: TOKENS.muted.value, uppercase: true, width: 360 });
    text(card, "Title", item.title, { size: 34, style: "Black", lineHeight: 94, width: 360 });
    text(card, "Tagline", item.tagline, { size: 18, style: "Bold", width: 360 });
    text(card, "Description", item.description, { size: 14, color: TOKENS.muted.value, lineHeight: 140, width: 360 });
  }

  const contact = section(desktop, "Contact", 1312);
  sectionTitle(contact, "Contact");
  text(contact, "Contact headline", COPY.contactTitle, { size: 82, style: "Black", lineHeight: 90, width: 720 });
  text(contact, "Contact subcopy", COPY.contactSubcopy, { size: 20, color: TOKENS.muted.value, lineHeight: 145, width: 640 });
  text(contact, "Contact CTA", "Contact Hsin-Hsin  /  hsin54@yahoo.com", { size: 14, style: "Bold", color: TOKENS.acid.value, uppercase: true });
}

async function createMobilePage() {
  const page = figma.createPage();
  page.name = "04 Mobile Layouts";

  const mobile = frame(page, "Mobile / Portfolio", 390, 4600, { fill: TOKENS.bg.value });
  setAutoLayout(mobile, "VERTICAL", 44, 18);

  text(mobile, "Mobile topbar", "HSIN-HSIN YUAN                                    中", {
    size: 11,
    style: "Bold",
    width: 354,
  });

  await imageBox(mobile, "Hero image fill / mobile crop", 354, 332, ASSETS.hero);
  text(mobile, "Hero title line 1", COPY.heroTitle[0], { size: 52, style: "Black", lineHeight: 88, width: 354 });
  text(mobile, "Hero title line 2", COPY.heroTitle[1], { size: 52, style: "Black", lineHeight: 88, width: 354 });
  text(mobile, "Hero roles", `${COPY.heroRoles[0]}\n${COPY.heroRoles[1]}`, { size: 17, style: "Bold", width: 354 });
  text(mobile, "Hero subcopy", COPY.heroSubcopy, { size: 16, lineHeight: 145, width: 354 });

  sectionTitle(mobile, "Platforms & Collaborations");
  const mobileLogos = frame(mobile, "Mobile logo wrap", 354, 150, { fill: TOKENS.bg.value });
  setAutoLayout(mobileLogos, "HORIZONTAL", 18, 0);
  mobileLogos.layoutWrap = "WRAP";
  LOGOS.forEach((logo) => {
    text(mobileLogos, `Logo / ${logo}`, logo, { size: 18, style: "Black", color: TOKENS.muted.value });
  });

  sectionTitle(mobile, "Featured Works");
  for (const item of WORKS) {
    const card = frame(mobile, `Mobile work card / ${item.title}`, 354, 500, { fill: TOKENS.panel.value });
    setAutoLayout(card, "VERTICAL", 14, 12);
    await imageBox(card, `Poster / ${item.title}`, 330, 186, item.image);
    text(card, "Meta", item.meta, { size: 10, style: "Bold", color: TOKENS.muted.value, width: 320 });
    text(card, "Title", item.title, { size: 30, style: "Black", width: 320 });
    text(card, "Tagline", item.tagline, { size: 17, style: "Bold", width: 320 });
    text(card, "Description", item.description, { size: 14, color: TOKENS.muted.value, lineHeight: 140, width: 320 });
  }

  sectionTitle(mobile, "Contact");
  text(mobile, "Contact headline", COPY.contactTitle, { size: 48, style: "Black", lineHeight: 90, width: 354 });
  text(mobile, "Contact subcopy", COPY.contactSubcopy, { size: 16, color: TOKENS.muted.value, lineHeight: 145, width: 354 });
}

async function main() {
  await loadFonts();
  createTokenPage();
  await createDesktopPage();
  await createMobilePage();

  const pagesToKeep = figma.root.children.filter((page) => page.children.length > 0);
  figma.currentPage = pagesToKeep[0] || figma.currentPage;
  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  figma.closePlugin("Editable Hsin-Hsin Yuan portfolio design layer created.");
}

main().catch((error) => {
  figma.closePlugin(`Importer failed: ${error.message}`);
});

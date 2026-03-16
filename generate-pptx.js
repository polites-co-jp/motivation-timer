const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icon imports
const { FaPlay, FaClock, FaBolt, FaChartLine, FaUser, FaDocker, FaDatabase, FaReact, FaNodeJs, FaVolumeUp, FaCheckCircle, FaBrain, FaCog } = require("react-icons/fa");
const { MdTimer, MdStar } = require("react-icons/md");

// ============================================================
// Color Palette - Ocean/Productivity theme
// ============================================================
const C = {
  midnight: "0F172A",
  deepBlue: "1E3A5F",
  teal: "0891B2",
  green: "059669",
  amber: "F59E0B",
  lightBg: "F0F9FF",
  white: "FFFFFF",
  offWhite: "F8FAFC",
  gray: "64748B",
  darkText: "1E293B",
  lightText: "94A3B8",
  cardBg: "FFFFFF",
  accentPink: "EC4899",
};

// ============================================================
// Icon helper
// ============================================================
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// ============================================================
// Reusable helpers
// ============================================================
const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.12 });

function addFooter(slide, pageNum, totalPages) {
  slide.addText(`${pageNum} / ${totalPages}`, {
    x: 4.0, y: 5.2, w: 2, h: 0.35,
    fontSize: 10, color: C.lightText, align: "center", fontFace: "Calibri",
  });
}

function addSideBar(slide) {
  slide.addShape(slide._slideLayout ? "rect" : "rect", {});
}

// ============================================================
// Main
// ============================================================
async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Motivation Timer Team";
  pres.title = "やる気タイマー - アプリケーション紹介";

  const TOTAL = 8;

  // Pre-render icons
  const icons = {
    timer: await iconToBase64Png(FaClock, "#FFFFFF", 256),
    bolt: await iconToBase64Png(FaBolt, "#F59E0B", 256),
    chart: await iconToBase64Png(FaChartLine, "#FFFFFF", 256),
    user: await iconToBase64Png(FaUser, "#FFFFFF", 256),
    play: await iconToBase64Png(FaPlay, "#FFFFFF", 256),
    react: await iconToBase64Png(FaReact, "#0891B2", 256),
    node: await iconToBase64Png(FaNodeJs, "#059669", 256),
    db: await iconToBase64Png(FaDatabase, "#F59E0B", 256),
    docker: await iconToBase64Png(FaDocker, "#0891B2", 256),
    volume: await iconToBase64Png(FaVolumeUp, "#FFFFFF", 256),
    check: await iconToBase64Png(FaCheckCircle, "#059669", 256),
    brain: await iconToBase64Png(FaBrain, "#EC4899", 256),
    cog: await iconToBase64Png(FaCog, "#FFFFFF", 256),
    timerTeal: await iconToBase64Png(FaClock, "#0891B2", 256),
    boltWhite: await iconToBase64Png(FaBolt, "#FFFFFF", 256),
    chartTeal: await iconToBase64Png(FaChartLine, "#0891B2", 256),
    userTeal: await iconToBase64Png(FaUser, "#0891B2", 256),
    star: await iconToBase64Png(MdStar, "#F59E0B", 256),
  };

  // ============================================================
  // SLIDE 1: Title
  // ============================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.midnight };

    // Decorative shapes
    slide.addShape(pres.shapes.OVAL, {
      x: -1.5, y: -1.5, w: 5, h: 5,
      fill: { color: C.teal, transparency: 85 },
    });
    slide.addShape(pres.shapes.OVAL, {
      x: 7, y: 3, w: 5, h: 5,
      fill: { color: C.green, transparency: 85 },
    });

    // Timer icon
    slide.addImage({ data: icons.timer, x: 4.5, y: 0.7, w: 1, h: 1 });

    // Title
    slide.addText("やる気タイマー", {
      x: 0.5, y: 1.8, w: 9, h: 1.2,
      fontSize: 48, fontFace: "Georgia", bold: true,
      color: C.white, align: "center", margin: 0,
    });

    // Subtitle
    slide.addText("Motivation Timer", {
      x: 0.5, y: 2.9, w: 9, h: 0.6,
      fontSize: 22, fontFace: "Calibri Light", color: C.teal, align: "center",
      charSpacing: 4, margin: 0,
    });

    // Tagline
    slide.addText("集中力を高めるポモドーロタイマーアプリケーション", {
      x: 1.5, y: 3.8, w: 7, h: 0.5,
      fontSize: 14, fontFace: "Calibri", color: C.lightText, align: "center",
    });

    // Bottom accent bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 3.5, y: 4.6, w: 3, h: 0.04,
      fill: { color: C.teal },
    });

    addFooter(slide, 1, TOTAL);
  }

  // ============================================================
  // SLIDE 2: Overview - What is it?
  // ============================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    // Left accent bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.06, h: 5.625,
      fill: { color: C.teal },
    });

    slide.addText("アプリケーション概要", {
      x: 0.7, y: 0.3, w: 9, h: 0.7,
      fontSize: 32, fontFace: "Georgia", bold: true, color: C.darkText, align: "left", margin: 0,
    });

    // Main description card
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y: 1.2, w: 5.3, h: 2.2,
      fill: { color: C.white }, shadow: makeShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y: 1.2, w: 0.06, h: 2.2,
      fill: { color: C.teal },
    });

    slide.addText("やる気タイマーとは？", {
      x: 1.1, y: 1.35, w: 4.7, h: 0.45,
      fontSize: 18, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
    });

    slide.addText("ポモドーロ・テクニックに基づいた集中支援Webアプリです。\n25分の作業と5分の休憩を繰り返し、\nモチベーションメッセージと音声フィードバックで\nユーザーの集中力を持続させます。", {
      x: 1.1, y: 1.85, w: 4.7, h: 1.4,
      fontSize: 13, fontFace: "Calibri", color: C.gray, align: "left", lineSpacingMultiple: 1.3,
    });

    // Right side: 3 feature highlights as cards
    const features = [
      { icon: icons.timerTeal, title: "ポモドーロ方式", desc: "25分作業 + 5分休憩" },
      { icon: icons.brain, title: "モチベーション", desc: "励ましメッセージ表示" },
      { icon: icons.chartTeal, title: "進捗トラッキング", desc: "セッション履歴を記録" },
    ];

    features.forEach((f, i) => {
      const y = 1.2 + i * 0.75;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 6.3, y, w: 3.2, h: 0.62,
        fill: { color: C.white }, shadow: makeShadow(),
      });
      slide.addImage({ data: f.icon, x: 6.45, y: y + 0.11, w: 0.4, h: 0.4 });
      slide.addText(f.title, {
        x: 7.0, y: y + 0.02, w: 2.3, h: 0.3,
        fontSize: 13, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
      });
      slide.addText(f.desc, {
        x: 7.0, y: y + 0.32, w: 2.3, h: 0.25,
        fontSize: 10, fontFace: "Calibri", color: C.gray, margin: 0,
      });
    });

    // Bottom: Timer cycle diagram
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y: 3.7, w: 8.8, h: 1.5,
      fill: { color: C.midnight },
      shadow: makeShadow(),
    });
    slide.addText("基本サイクル", {
      x: 1.0, y: 3.8, w: 3, h: 0.35,
      fontSize: 12, fontFace: "Calibri", bold: true, color: C.teal, margin: 0,
    });

    // Cycle flow
    const phases = [
      { label: "開始", color: C.amber, w: 0.9 },
      { label: "カウントダウン\n3...2...1", color: C.teal, w: 1.3 },
      { label: "やる気\nメッセージ", color: C.accentPink, w: 1.3 },
      { label: "作業\n25分", color: "3B82F6", w: 1.1 },
      { label: "休憩\n5分", color: C.green, w: 1.1 },
      { label: "繰り返し\n×4", color: C.amber, w: 1.1 },
    ];

    let cx = 1.0;
    phases.forEach((p, i) => {
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: cx, y: 4.2, w: p.w, h: 0.75,
        fill: { color: p.color }, rectRadius: 0.08,
      });
      slide.addText(p.label, {
        x: cx, y: 4.2, w: p.w, h: 0.75,
        fontSize: 10, fontFace: "Calibri", bold: true, color: C.white,
        align: "center", valign: "middle", margin: 0,
      });
      cx += p.w;
      if (i < phases.length - 1) {
        slide.addText("→", {
          x: cx, y: 4.2, w: 0.3, h: 0.75,
          fontSize: 16, color: C.lightText, align: "center", valign: "middle",
        });
        cx += 0.3;
      }
    });

    addFooter(slide, 2, TOTAL);
  }

  // ============================================================
  // SLIDE 3: Key Features
  // ============================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.06, h: 5.625,
      fill: { color: C.green },
    });

    slide.addText("主要機能", {
      x: 0.7, y: 0.3, w: 9, h: 0.7,
      fontSize: 32, fontFace: "Georgia", bold: true, color: C.darkText, align: "left", margin: 0,
    });

    // 2x2 feature grid
    const featureCards = [
      {
        icon: icons.timer, bg: C.teal,
        title: "高精度タイマー",
        bullets: [
          "requestAnimationFrame による正確な計測",
          "ブラウザタブ切替にも影響なし",
          "目標終了時刻ベースの計算方式",
        ],
      },
      {
        icon: icons.volume, bg: C.deepBlue,
        title: "サウンドフィードバック",
        bullets: [
          "Web Audio API でリアルタイム生成",
          "カウントダウンビープ音（880Hz）",
          "セッション完了チャイム（和音）",
        ],
      },
      {
        icon: icons.boltWhite, bg: C.amber,
        title: "モチベーション機能",
        bullets: [
          "10種類の励ましメッセージ",
          "セッション開始時にランダム表示",
          "フェードイン・アウト アニメーション",
        ],
      },
      {
        icon: icons.chart, bg: C.green,
        title: "進捗管理",
        bullets: [
          "セッション数・サイクル数の記録",
          "累計作業時間の集計",
          "直近7日間のデイリー統計",
        ],
      },
    ];

    featureCards.forEach((card, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.7 + col * 4.6;
      const y = 1.2 + row * 2.1;

      // Card background
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 4.3, h: 1.9,
        fill: { color: C.white }, shadow: makeShadow(),
      });

      // Colored icon circle
      slide.addShape(pres.shapes.OVAL, {
        x: x + 0.2, y: y + 0.2, w: 0.55, h: 0.55,
        fill: { color: card.bg },
      });
      slide.addImage({ data: card.icon, x: x + 0.275, y: y + 0.275, w: 0.4, h: 0.4 });

      // Title
      slide.addText(card.title, {
        x: x + 0.9, y: y + 0.2, w: 3.2, h: 0.45,
        fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
      });

      // Bullets
      slide.addText(
        card.bullets.map((b, bi) => ({
          text: b,
          options: { bullet: true, breakLine: bi < card.bullets.length - 1 },
        })),
        {
          x: x + 0.3, y: y + 0.75, w: 3.8, h: 1.0,
          fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0,
          paraSpaceAfter: 4,
        }
      );
    });

    addFooter(slide, 3, TOTAL);
  }

  // ============================================================
  // SLIDE 4: Tech Stack
  // ============================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.06, h: 5.625,
      fill: { color: C.amber },
    });

    slide.addText("技術スタック", {
      x: 0.7, y: 0.3, w: 9, h: 0.7,
      fontSize: 32, fontFace: "Georgia", bold: true, color: C.darkText, align: "left", margin: 0,
    });

    // Three columns: Frontend, Backend, Infrastructure
    const stacks = [
      {
        icon: icons.react, label: "Frontend",
        color: C.teal,
        items: [
          { name: "React 19", desc: "UIフレームワーク" },
          { name: "TypeScript", desc: "型安全な開発" },
          { name: "Vite", desc: "高速ビルドツール" },
          { name: "CSS Modules", desc: "スコープ付きスタイル" },
          { name: "Web Audio API", desc: "音声合成" },
        ],
      },
      {
        icon: icons.node, label: "Backend",
        color: C.green,
        items: [
          { name: "Node.js 22", desc: "ランタイム" },
          { name: "Express.js", desc: "APIフレームワーク" },
          { name: "TypeScript", desc: "型安全な開発" },
          { name: "PostgreSQL 17", desc: "データベース" },
          { name: "Scrypt", desc: "パスワードハッシュ" },
        ],
      },
      {
        icon: icons.docker, label: "Infrastructure",
        color: C.deepBlue,
        items: [
          { name: "Docker Compose", desc: "コンテナ管理" },
          { name: "Nginx", desc: "リバースプロキシ" },
          { name: "Multi-stage Build", desc: "最適化ビルド" },
          { name: "Alpine Linux", desc: "軽量コンテナ" },
          { name: "Health Check", desc: "死活監視" },
        ],
      },
    ];

    stacks.forEach((stack, col) => {
      const x = 0.7 + col * 3.1;
      const cardW = 2.85;

      // Column header
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.15, w: cardW, h: 0.7,
        fill: { color: stack.color }, shadow: makeShadow(),
      });
      slide.addImage({ data: stack.icon, x: x + 0.15, y: 1.25, w: 0.45, h: 0.45 });
      slide.addText(stack.label, {
        x: x + 0.65, y: 1.15, w: 2, h: 0.7,
        fontSize: 18, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
      });

      // Items
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 1.85, w: cardW, h: 3.3,
        fill: { color: C.white }, shadow: makeShadow(),
      });

      stack.items.forEach((item, i) => {
        const iy = 2.0 + i * 0.6;
        slide.addText(item.name, {
          x: x + 0.2, y: iy, w: 2.4, h: 0.28,
          fontSize: 12, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
        });
        slide.addText(item.desc, {
          x: x + 0.2, y: iy + 0.26, w: 2.4, h: 0.22,
          fontSize: 10, fontFace: "Calibri", color: C.lightText, margin: 0,
        });
        if (i < stack.items.length - 1) {
          slide.addShape(pres.shapes.LINE, {
            x: x + 0.2, y: iy + 0.55, w: 2.4, h: 0,
            line: { color: "E2E8F0", width: 0.5 },
          });
        }
      });
    });

    addFooter(slide, 4, TOTAL);
  }

  // ============================================================
  // SLIDE 5: Architecture
  // ============================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.midnight };

    slide.addText("システムアーキテクチャ", {
      x: 0.7, y: 0.3, w: 9, h: 0.7,
      fontSize: 32, fontFace: "Georgia", bold: true, color: C.white, align: "left", margin: 0,
    });

    // Three-tier boxes
    const tiers = [
      {
        label: "Frontend", sub: "React 19 + TypeScript + Vite",
        x: 0.7, y: 1.4, w: 2.7, h: 3.5, color: C.teal,
        components: ["App.tsx\n(状態管理)", "CircularProgress\n(タイマーUI)", "useTimer Hook\n(RAF精密計測)", "useAudio Hook\n(音声合成)", "AuthContext\n(認証状態)"],
      },
      {
        label: "Backend", sub: "Express.js + Node.js 22",
        x: 3.7, y: 1.4, w: 2.7, h: 3.5, color: C.green,
        components: ["REST API\n(Express)", "/api/auth\n(認証)", "/api/sessions\n(記録)", "/api/users\n(統計)", "CORS対応\n(セキュリティ)"],
      },
      {
        label: "Database", sub: "PostgreSQL 17",
        x: 6.7, y: 1.4, w: 2.7, h: 3.5, color: C.amber,
        components: ["users テーブル\n(ユーザー情報)", "session_logs\n(セッション履歴)", "UUID主キー\n(一意識別)", "インデックス最適化\n(高速検索)", "CASCADE削除\n(整合性保持)"],
      },
    ];

    tiers.forEach((tier) => {
      // Outer box
      slide.addShape(pres.shapes.RECTANGLE, {
        x: tier.x, y: tier.y, w: tier.w, h: tier.h,
        fill: { color: tier.color, transparency: 85 },
        line: { color: tier.color, width: 1.5 },
      });
      // Header
      slide.addShape(pres.shapes.RECTANGLE, {
        x: tier.x, y: tier.y, w: tier.w, h: 0.6,
        fill: { color: tier.color },
      });
      slide.addText(tier.label, {
        x: tier.x, y: tier.y, w: tier.w, h: 0.35,
        fontSize: 16, fontFace: "Calibri", bold: true, color: C.white, align: "center", margin: 0,
      });
      slide.addText(tier.sub, {
        x: tier.x, y: tier.y + 0.32, w: tier.w, h: 0.25,
        fontSize: 8, fontFace: "Calibri", color: C.white, align: "center", margin: 0,
      });

      // Components
      tier.components.forEach((comp, i) => {
        const cy = tier.y + 0.75 + i * 0.55;
        slide.addShape(pres.shapes.RECTANGLE, {
          x: tier.x + 0.12, y: cy, w: tier.w - 0.24, h: 0.45,
          fill: { color: C.midnight },
          line: { color: tier.color, width: 0.5 },
        });
        slide.addText(comp, {
          x: tier.x + 0.12, y: cy, w: tier.w - 0.24, h: 0.45,
          fontSize: 8, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", margin: 0,
        });
      });
    });

    // Arrows between tiers
    const arrowY = 2.3;
    slide.addText("HTTP / REST →", {
      x: 3.15, y: arrowY, w: 0.8, h: 0.3,
      fontSize: 8, fontFace: "Calibri", color: C.teal, align: "center", rotate: 0,
    });
    slide.addText("← SQL →", {
      x: 6.15, y: arrowY, w: 0.8, h: 0.3,
      fontSize: 8, fontFace: "Calibri", color: C.green, align: "center",
    });

    // Docker label
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 5.0, w: 9.0, h: 0.03,
      fill: { color: C.teal, transparency: 50 },
    });
    slide.addText("Docker Compose で統合管理", {
      x: 0.5, y: 5.05, w: 9.0, h: 0.3,
      fontSize: 10, fontFace: "Calibri", italic: true, color: C.lightText, align: "center",
    });

    addFooter(slide, 5, TOTAL);
  }

  // ============================================================
  // SLIDE 6: User Experience / UI States
  // ============================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.06, h: 5.625,
      fill: { color: C.accentPink },
    });

    slide.addText("ユーザー体験", {
      x: 0.7, y: 0.3, w: 9, h: 0.7,
      fontSize: 32, fontFace: "Georgia", bold: true, color: C.darkText, align: "left", margin: 0,
    });

    // UI Phase states - horizontal flow
    const uiPhases = [
      { label: "待機中", color: C.gray, desc: "スタートボタン表示\nロングブレーク設定" },
      { label: "カウントダウン", color: C.teal, desc: "3→2→1 オーバーレイ\nビープ音フィードバック" },
      { label: "メッセージ", color: C.accentPink, desc: "励ましメッセージ\nフェード表示" },
      { label: "作業中", color: "3B82F6", desc: "25分タイマー表示\n青いグラデーション背景" },
      { label: "休憩中", color: C.green, desc: "5分（or 25分）\n緑のグラデーション背景" },
    ];

    uiPhases.forEach((phase, i) => {
      const x = 0.5 + i * 1.9;
      const y = 1.3;

      // Circle
      slide.addShape(pres.shapes.OVAL, {
        x: x + 0.35, y, w: 1.0, h: 1.0,
        fill: { color: phase.color }, shadow: makeShadow(),
      });
      slide.addText(phase.label, {
        x: x + 0.35, y, w: 1.0, h: 1.0,
        fontSize: 10, fontFace: "Calibri", bold: true, color: C.white,
        align: "center", valign: "middle",
      });

      // Description
      slide.addText(phase.desc, {
        x: x + 0.05, y: 2.45, w: 1.6, h: 0.7,
        fontSize: 9, fontFace: "Calibri", color: C.gray, align: "center",
      });

      // Arrow
      if (i < uiPhases.length - 1) {
        slide.addText("→", {
          x: x + 1.5, y: y, w: 0.4, h: 1.0,
          fontSize: 18, color: C.lightText, align: "center", valign: "middle",
        });
      }
    });

    // Visual features section
    slide.addText("ビジュアルデザイン", {
      x: 0.7, y: 3.3, w: 4, h: 0.4,
      fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
    });

    const visuals = [
      { title: "アニメーション背景", desc: "フェーズに応じた色変化 + CSS揺らぎアニメーション", color: "3B82F6" },
      { title: "円形プログレス", desc: "SVGベースの残時間インジケーター + MM:SS表示", color: C.teal },
      { title: "セッションドット", desc: "● ● ○ ○ 形式でサイクル進捗を視覚化", color: C.green },
    ];

    visuals.forEach((v, i) => {
      const x = 0.7 + i * 3.1;
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.85, w: 2.85, h: 1.2,
        fill: { color: C.white }, shadow: makeShadow(),
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.85, w: 2.85, h: 0.05,
        fill: { color: v.color },
      });
      slide.addText(v.title, {
        x: x + 0.15, y: 4.0, w: 2.55, h: 0.3,
        fontSize: 12, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
      });
      slide.addText(v.desc, {
        x: x + 0.15, y: 4.3, w: 2.55, h: 0.6,
        fontSize: 10, fontFace: "Calibri", color: C.gray, margin: 0,
      });
    });

    addFooter(slide, 6, TOTAL);
  }

  // ============================================================
  // SLIDE 7: Authentication & Stats
  // ============================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.offWhite };

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.06, h: 5.625,
      fill: { color: C.deepBlue },
    });

    slide.addText("認証 & マイページ機能", {
      x: 0.7, y: 0.3, w: 9, h: 0.7,
      fontSize: 32, fontFace: "Georgia", bold: true, color: C.darkText, align: "left", margin: 0,
    });

    // Left: Auth flow
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y: 1.2, w: 4.3, h: 4.0,
      fill: { color: C.white }, shadow: makeShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y: 1.2, w: 4.3, h: 0.05,
      fill: { color: C.teal },
    });

    slide.addImage({ data: icons.userTeal, x: 0.9, y: 1.45, w: 0.35, h: 0.35 });
    slide.addText("ユーザー認証", {
      x: 1.35, y: 1.45, w: 3, h: 0.35,
      fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
    });

    const authFeatures = [
      "メールアドレス + パスワードで登録・ログイン",
      "Scrypt によるセキュアなパスワード保存",
      "localStorage によるセッション維持",
      "ログインなしでもタイマー機能は利用可能",
    ];

    slide.addText(
      authFeatures.map((f, i) => ({
        text: f,
        options: { bullet: true, breakLine: i < authFeatures.length - 1 },
      })),
      {
        x: 1.0, y: 2.0, w: 3.8, h: 1.5,
        fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0,
        paraSpaceAfter: 6,
      }
    );

    // API Endpoints mini-table
    slide.addText("API エンドポイント", {
      x: 1.0, y: 3.5, w: 3.5, h: 0.3,
      fontSize: 12, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
    });

    const endpoints = [
      ["POST /api/auth/register", "ユーザー登録"],
      ["POST /api/auth/login", "ログイン"],
      ["POST /api/sessions", "セッション記録"],
      ["GET /api/users/:id/stats", "統計取得"],
    ];

    slide.addTable(
      [
        [
          { text: "エンドポイント", options: { fill: { color: C.midnight }, color: C.white, bold: true, fontSize: 9, fontFace: "Calibri" } },
          { text: "機能", options: { fill: { color: C.midnight }, color: C.white, bold: true, fontSize: 9, fontFace: "Calibri" } },
        ],
        ...endpoints.map((e) => [
          { text: e[0], options: { fontSize: 8, fontFace: "Consolas", color: C.darkText } },
          { text: e[1], options: { fontSize: 9, fontFace: "Calibri", color: C.gray } },
        ]),
      ],
      {
        x: 1.0, y: 3.85, w: 3.8, h: 1.0,
        border: { pt: 0.5, color: "E2E8F0" },
        colW: [2.4, 1.4],
        rowH: [0.22, 0.2, 0.2, 0.2, 0.2],
      }
    );

    // Right: MyPage stats
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y: 1.2, w: 4.2, h: 4.0,
      fill: { color: C.white }, shadow: makeShadow(),
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y: 1.2, w: 4.2, h: 0.05,
      fill: { color: C.green },
    });

    slide.addImage({ data: icons.chartTeal, x: 5.5, y: 1.45, w: 0.35, h: 0.35 });
    slide.addText("マイページ", {
      x: 5.95, y: 1.45, w: 3, h: 0.35,
      fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
    });

    // Stat cards
    const stats = [
      { label: "累計セッション数", value: "24", unit: "回", color: C.teal },
      { label: "累計サイクル数", value: "6", unit: "回", color: C.green },
      { label: "総作業時間", value: "10", unit: "時間", color: C.amber },
    ];

    stats.forEach((s, i) => {
      const sx = 5.5 + i * 1.3;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: sx, y: 2.05, w: 1.15, h: 1.1,
        fill: { color: C.offWhite },
        line: { color: "E2E8F0", width: 0.5 },
      });
      slide.addText(s.value, {
        x: sx, y: 2.1, w: 1.15, h: 0.55,
        fontSize: 28, fontFace: "Georgia", bold: true, color: s.color, align: "center", margin: 0,
      });
      slide.addText(s.unit, {
        x: sx, y: 2.55, w: 1.15, h: 0.2,
        fontSize: 9, fontFace: "Calibri", color: C.lightText, align: "center", margin: 0,
      });
      slide.addText(s.label, {
        x: sx, y: 2.8, w: 1.15, h: 0.25,
        fontSize: 8, fontFace: "Calibri", color: C.gray, align: "center", margin: 0,
      });
    });

    // Daily stats chart
    slide.addText("直近7日間のデイリー統計", {
      x: 5.5, y: 3.35, w: 3.8, h: 0.3,
      fontSize: 12, fontFace: "Calibri", bold: true, color: C.darkText, margin: 0,
    });

    slide.addChart(pres.charts.BAR, [
      {
        name: "セッション数",
        labels: ["月", "火", "水", "木", "金", "土", "日"],
        values: [4, 6, 3, 8, 5, 2, 7],
      },
    ], {
      x: 5.5, y: 3.7, w: 3.8, h: 1.35,
      barDir: "col",
      chartColors: [C.teal],
      chartArea: { fill: { color: C.offWhite }, roundedCorners: true },
      catAxisLabelColor: C.gray,
      valAxisLabelColor: C.gray,
      catAxisLabelFontSize: 8,
      valAxisLabelFontSize: 8,
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
      showLegend: false,
      showValue: true,
      dataLabelPosition: "outEnd",
      dataLabelColor: C.darkText,
      dataLabelFontSize: 8,
    });

    addFooter(slide, 7, TOTAL);
  }

  // ============================================================
  // SLIDE 8: Summary / Closing
  // ============================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.midnight };

    // Decorative shapes
    slide.addShape(pres.shapes.OVAL, {
      x: 7.5, y: -2, w: 5, h: 5,
      fill: { color: C.teal, transparency: 88 },
    });
    slide.addShape(pres.shapes.OVAL, {
      x: -2, y: 3, w: 5, h: 5,
      fill: { color: C.green, transparency: 88 },
    });

    slide.addImage({ data: icons.star, x: 4.55, y: 0.5, w: 0.9, h: 0.9 });

    slide.addText("まとめ", {
      x: 0.5, y: 1.4, w: 9, h: 0.8,
      fontSize: 40, fontFace: "Georgia", bold: true, color: C.white, align: "center", margin: 0,
    });

    // Summary points in cards
    const summaryPoints = [
      { icon: icons.timer, text: "ポモドーロ方式で\n集中力を最大化" },
      { icon: icons.boltWhite, text: "励ましメッセージで\nモチベーション維持" },
      { icon: icons.cog, text: "モダンな技術スタックで\n高品質な体験を提供" },
    ];

    summaryPoints.forEach((p, i) => {
      const x = 0.8 + i * 3.0;
      slide.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.5, w: 2.7, h: 1.6,
        fill: { color: C.white, transparency: 90 },
        line: { color: C.teal, width: 1 },
      });
      slide.addImage({ data: p.icon, x: x + 1.05, y: 2.65, w: 0.6, h: 0.6 });
      slide.addText(p.text, {
        x: x + 0.1, y: 3.35, w: 2.5, h: 0.65,
        fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", valign: "middle",
      });
    });

    // Closing message
    slide.addText("やる気を、カタチに。", {
      x: 1.5, y: 4.5, w: 7, h: 0.5,
      fontSize: 20, fontFace: "Georgia", italic: true, color: C.teal, align: "center",
    });

    addFooter(slide, 8, TOTAL);
  }

  // ============================================================
  // Save
  // ============================================================
  await pres.writeFile({ fileName: "d:/develop/motivation-timer/motivation-timer-presentation.pptx" });
  console.log("Presentation saved: motivation-timer-presentation.pptx");
}

main().catch(console.error);

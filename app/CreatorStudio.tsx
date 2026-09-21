"use client";

import { ChangeEvent, useMemo, useState, type CSSProperties } from "react";

type Slide = { id: number; kicker: string; title: string; text: string };
type Brand = { name: string; website: string; primary: string; secondary: string; font: string; logo: string };

const retentionDays = 30; // Change this value to update the default project-retention policy.

const initialSlides: Slide[] = [
  { id: 1, kicker: "GUIA PRÁTICO", title: "Transforme ideias em conteúdo que sua marca reconhece.", text: "Use uma identidade consistente em cada página do seu carrossel." },
  { id: 2, kicker: "PASSO 01", title: "Escolha o formato ideal.", text: "Do feed quadrado aos stories verticais, seu conteúdo já nasce no tamanho certo." },
  { id: 3, kicker: "PASSO 02", title: "Adicione a sua voz visual.", text: "Cores, fonte, logo e imagens trabalham juntos — sem perder o seu jeito." },
];

const ratios = {
  "1:1": [1080, 1080],
  "3:4": [1080, 1440],
  "9:16": [1080, 1920],
} as const;

const templates = [
  { id: "editorial", name: "Editorial", label: "Calmo e sofisticado", tone: "#f3efe7" },
  { id: "bold", name: "Impacto", label: "Gráfico e direto", tone: "#ffdd71" },
  { id: "midnight", name: "Noite", label: "Premium e intenso", tone: "#1a2440" },
];

export function CreatorStudio() {
  const [view, setView] = useState<"library" | "editor">("editor");
  const [slideIndex, setSlideIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [brand, setBrand] = useState<Brand>({ name: "Sua marca", website: "seusite.com", primary: "#0F1115", secondary: "#EDECE6", font: "Geist", logo: "SM" });
  const [template, setTemplate] = useState("editorial");
  const [ratio, setRatio] = useState<keyof typeof ratios>("1:1");
  const [resolution, setResolution] = useState("1080");
  const [customSize, setCustomSize] = useState("1080 × 1080");
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [photo, setPhoto] = useState<string | null>(null);
  const [projects, setProjects] = useState([{ title: "Como ganhar clareza", pages: 5, updated: "Há 2 horas", color: "#dfe1ff" }, { title: "Novidades de agosto", pages: 7, updated: "Ontem", color: "#f5dbb8" }]);
  const [saving, setSaving] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [brief, setBrief] = useState("Como construir uma marca que as pessoas reconhecem");
  const [audience, setAudience] = useState("Empreendedores e criativos");
  const [slideCount, setSlideCount] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const current = slides[slideIndex];
  const [baseWidth, baseHeight] = ratios[ratio];
  const dimensions = resolution === "Personalizada" ? customSize : resolution === "2K" ? "2048 × " + Math.round(2048 * baseHeight / baseWidth) : resolution === "4K" ? "3840 × " + Math.round(3840 * baseHeight / baseWidth) : `${baseWidth} × ${baseHeight}`;
  const palette = useMemo(() => templates.find((item) => item.id === template) ?? templates[0], [template]);

  function updateSlide(field: keyof Slide, value: string) {
    setSlides((items) => items.map((item, index) => index === slideIndex ? { ...item, [field]: value } : item));
  }

  function addSlide() {
    setSlides((items) => [...items, { id: Date.now(), kicker: "NOVA IDEIA", title: "Um novo ponto para a sua narrativa.", text: "Escreva uma mensagem clara e memorável." }]);
    setSlideIndex(slides.length);
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  }

  function saveProject() {
    setSaving(true);
    window.setTimeout(() => {
      setProjects((items) => [{ title: current.title.slice(0, 28) || "Carrossel sem título", pages: slides.length, updated: "Agora", color: brand.primary + "22" }, ...items]);
      setSaving(false);
    }, 650);
  }

  async function generateWithAI() {
    setGenerationError("");
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: brief, audience, slideCount, template }),
      });
      const data = await response.json() as { slides?: Omit<Slide, "id">[]; error?: string };
      if (!response.ok || !data.slides?.length) throw new Error(data.error || "A geração não retornou páginas.");
      setSlides(data.slides.map((slide, index) => ({ ...slide, id: Date.now() + index })));
      setSlideIndex(0);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Não foi possível gerar o roteiro.");
    } finally {
      setIsGenerating(false);
    }
  }

  function exportSlides() {
    const [w, h] = dimensions.split("×").map((value) => Number(value.trim()) || 1080);
    slides.forEach((slide, index) => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = template === "midnight" ? "#17213a" : template === "bold" ? "#ffdd71" : "#f3efe7";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = brand.primary;
      ctx.beginPath(); ctx.arc(w * .84, h * .18, w * .21, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = template === "midnight" ? "#ffffff" : "#18212e";
      ctx.font = `700 ${Math.round(w * .038)}px Arial`; ctx.fillText(brand.name.toUpperCase(), w * .09, h * .10);
      ctx.font = `600 ${Math.round(w * .025)}px Arial`; ctx.fillText(slide.kicker, w * .09, h * .23);
      ctx.font = `700 ${Math.round(w * .075)}px Arial`;
      wrapText(ctx, slide.title, w * .09, h * .36, w * .72, Math.round(w * .087));
      ctx.font = `${Math.round(w * .032)}px Arial`;
      wrapText(ctx, slide.text, w * .09, h * .76, w * .72, Math.round(w * .045));
      ctx.fillStyle = template === "midnight" ? "#ffffffaa" : "#18212e99";
      ctx.font = `${Math.round(w * .022)}px Arial`; ctx.fillText(`${index + 1} / ${slides.length}`, w * .09, h * .93);
      const link = document.createElement("a");
      link.download = `prisma-card-${index + 1}.${format === "jpeg" ? "jpg" : "png"}`;
      link.href = canvas.toDataURL(`image/${format}`, .94);
      link.click();
    });
  }

  return (
    <main className={`app-shell ${darkMode ? "theme-dark" : "theme-light"}`}>
      <aside className="sidebar">
        <a className="wordmark" href="#top" aria-label="Prisma"><img src={darkMode ? "/brand/prisma/signature/horizontal-light.svg" : "/brand/prisma/signature/horizontal-ink.svg"} alt="Prisma" /></a>
        <nav aria-label="Navegação principal">
          <button className={view === "library" ? "nav-item active" : "nav-item"} onClick={() => setView("library")}><i>◫</i> Meus projetos</button>
          <button className={view === "editor" ? "nav-item active" : "nav-item"} onClick={() => setView("editor")}><i>✦</i> Criar conteúdo</button>
          <button className="nav-item"><i>◌</i> Kit de marca</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="retention"><span>◷</span><p><strong>Biblioteca protegida</strong><br />Seus projetos ficam seguros por {retentionDays} dias.</p></div>
          <button className="login-trigger" onClick={() => setLoginOpen(true)}>Entrar na sua conta <b>→</b></button>
        </div>
      </aside>

      <section className="workspace" id="top">
        {view === "library" ? (
          <div className="library-view">
            <div className="page-heading"><div><p className="eyebrow">PRISMA · PRIME CREATIVE</p><h1>Seu espaço de criação.</h1><p>Projetos salvos ficam disponíveis por {retentionDays} dias.</p></div><div className="page-tools"><button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? "Ativar tema claro" : "Ativar tema noturno"}><span>{darkMode ? "☀" : "☾"}</span>{darkMode ? "Claro" : "Noturno"}</button><button className="primary" onClick={() => setView("editor")}>+ Criar novo</button></div></div>
            <div className="project-grid">
              {projects.map((project, index) => <article className="project-card" key={index}><div className="project-cover" style={{ background: project.color }}><span>{brand.logo}</span><b>{project.title}</b></div><div><h3>{project.title}</h3><p>{project.pages} páginas · {project.updated}</p></div><button onClick={() => setView("editor")}>Abrir →</button></article>)}
              <button className="new-project-card" onClick={() => setView("editor")}><strong>+</strong><span>Novo carrossel</span></button>
            </div>
          </div>
        ) : (
          <>
            <header className="topbar"><div><button className="back" onClick={() => setView("library")}>← Biblioteca</button><p className="eyebrow">PRISMA · CRIAR CARROSSEL</p><h1>{current.title.slice(0, 48)}</h1></div><div className="actions"><button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? "Ativar tema claro" : "Ativar tema noturno"}><span>{darkMode ? "☀" : "☾"}</span>{darkMode ? "Claro" : "Noturno"}</button><button className="plain" onClick={saveProject}>{saving ? "Salvando…" : "Salvar rascunho"}</button><button className="primary" onClick={exportSlides}>Exportar {format === "png" ? "PNG" : "JPG"} <span>↗</span></button></div></header>
            <div className="editor-grid">
              <section className="controls" aria-label="Controles de criação">
                <div className="control-section ai-brief"><div className="section-title"><span>IA</span><h2>Comece pelo seu tema</h2></div><p>Claude organiza o roteiro; você mantém a decisão criativa.</p><label>Sobre o que será o carrossel?<textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={3} placeholder="Ex.: 5 passos para…" /></label><label>Para quem?<input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex.: donos de pequenos negócios" /></label><label>Páginas<select value={slideCount} onChange={(e) => setSlideCount(Number(e.target.value))}>{[3, 4, 5, 6, 7, 8, 9, 10].map((count) => <option key={count} value={count}>{count} páginas</option>)}</select></label><button className="generate-button" onClick={generateWithAI} disabled={isGenerating || brief.trim().length < 8}>{isGenerating ? "Criando roteiro…" : "✦ Gerar carrossel com IA"}</button>{generationError && <p className="generation-error">{generationError}</p>}</div>
                <div className="control-section"><div className="section-title"><span>01</span><h2>Identidade da marca</h2></div><label>Nome da marca<input value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} /></label><div className="split"><label>Cor principal<input className="color-field" value={brand.primary} onChange={(e) => setBrand({ ...brand, primary: e.target.value })} /></label><label>Fonte<select value={brand.font} onChange={(e) => setBrand({ ...brand, font: e.target.value })}><option>Geist</option><option>DM Sans</option><option>Playfair Display</option></select></label></div></div>
                <div className="control-section"><div className="section-title"><span>02</span><h2>Direção visual</h2></div><div className="template-list">{templates.map((item) => <button className={template === item.id ? "template active" : "template"} key={item.id} onClick={() => setTemplate(item.id)}><i style={{ background: item.tone }} /><span><b>{item.name}</b><small>{item.label}</small></span><em>{template === item.id ? "✓" : ""}</em></button>)}</div></div>
                <div className="control-section"><div className="section-title"><span>03</span><h2>Formato de saída</h2></div><div className="choices">{(Object.keys(ratios) as Array<keyof typeof ratios>).map((item) => <button className={ratio === item ? "selected" : ""} key={item} onClick={() => setRatio(item)}><i className={`ratio ratio-${item.replace(":", "-")}`} />{item}</button>)}</div><label>Resolução<select value={resolution} onChange={(e) => setResolution(e.target.value)}><option>1080</option><option>2K</option><option>4K</option><option>Personalizada</option></select></label>{resolution === "Personalizada" && <label>Dimensões<input value={customSize} onChange={(e) => setCustomSize(e.target.value)} /></label>}<div className="format-toggle"><button className={format === "png" ? "active" : ""} onClick={() => setFormat("png")}>PNG</button><button className={format === "jpeg" ? "active" : ""} onClick={() => setFormat("jpeg")}>JPG</button><span>{dimensions} px</span></div></div>
              </section>
              <section className="canvas-area">
                <div className={`artboard ${template} ratio-${ratio.replace(":", "-")}`} style={{ "--brand": brand.primary } as CSSProperties}>
                  <div className="brand-mark">{brand.logo}</div><div className="orb" /><div className="art-content"><p>{current.kicker}</p><h2>{current.title}</h2><div className="art-bottom"><span>{current.text}</span><b>{brand.website}</b></div></div>{photo && <img className="uploaded-photo" src={photo} alt="Imagem enviada" />}
                </div>
                <div className="canvas-meta"><span>Prévia em tempo real</span><strong>{dimensions} px</strong></div>
              </section>
              <section className="story-panel"><div className="panel-heading"><div><p className="eyebrow">SEU CARROSSEL</p><h2>{slides.length} páginas</h2></div><button onClick={addSlide}>+ página</button></div><div className="slide-strip">{slides.map((slide, index) => <button key={slide.id} onClick={() => setSlideIndex(index)} className={slideIndex === index ? "slide-thumb active" : "slide-thumb"} style={{ "--brand": brand.primary } as CSSProperties}><b>{index + 1}</b><span>{slide.title.slice(0, 33)}</span></button>)}</div><div className="copy-editor"><label>Sobretítulo<input value={current.kicker} onChange={(e) => updateSlide("kicker", e.target.value)} /></label><label>Título<textarea value={current.title} onChange={(e) => updateSlide("title", e.target.value)} rows={3} /></label><label>Texto de apoio<textarea value={current.text} onChange={(e) => updateSlide("text", e.target.value)} rows={3} /></label><label className="upload"><input type="file" accept="image/*" onChange={handleImage} /><span>↑</span><div><b>{photo ? "Imagem adicionada" : "Adicionar imagem"}</b><small>{photo ? "Clique para substituir" : "JPG ou PNG, até 10 MB"}</small></div></label></div></section>
            </div>
          </>
        )}
      </section>
      {loginOpen && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="login-modal"><button className="close" onClick={() => setLoginOpen(false)}>×</button><div className="login-logo"><img src={darkMode ? "/brand/prisma/app-icon/app-icon-butter.svg" : "/brand/prisma/app-icon/app-icon-blue.svg"} alt="Prisma" /></div><img className="signed-wordmark" src={darkMode ? "/brand/prisma/signature/wordmark-signed-light.svg" : "/brand/prisma/signature/wordmark-signed-ink.svg"} alt="Prisma, por Prime Creative" /><h2>Seu espaço para criar com intenção.</h2><p>O login e a biblioteca persistente serão conectados a um provedor de autenticação antes do lançamento público.</p><button className="primary full" onClick={() => setLoginOpen(false)}>Continuar explorando <span>→</span></button><small>Sem vínculo com uma conta ChatGPT.</small></div></div>}
    </main>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lineHeight: number) {
  const words = text.split(" "); let line = ""; let row = 0;
  words.forEach((word) => { const next = `${line}${word} `; if (ctx.measureText(next).width > width && line) { ctx.fillText(line, x, y + row * lineHeight); line = `${word} `; row += 1; } else line = next; });
  ctx.fillText(line, x, y + row * lineHeight);
}

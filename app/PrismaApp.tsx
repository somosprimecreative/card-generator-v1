"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/label-has-associated-control, react-hooks/set-state-in-effect, react-hooks/static-components -- Official SVG assets must remain direct files; this is a stateful product shell with local view fragments. */

import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { BrandProfile, Content, Creation, emptyContent, formats, FormatId, seedBrands, templates } from "./prisma-data";
import { CardRenderer } from "./CardRenderer";
import { downloadCard, downloadCardsZip, ExportFormat } from "./card-export";
import { composePages, inspectRenderedCard, validateContent } from "./prisma-engine";
import { prepareImageForCard } from "./image-processing";

type Screen = "home" | "creations" | "templates" | "brands" | "settings" | "generate" | "result";
type Theme = "light" | "dark";
type Retention = "15" | "30" | "90" | "custom";
type Notice = { tone: "success" | "error" | "info"; text: string } | null;

const STORAGE_KEY = "prisma-workspace-v2";

const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-6h6v6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
    mark: <><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 3v9h9"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.3 2.3-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56v.1h-3.25v-.1a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.3-2.3.06-.06A1.7 1.7 0 0 0 6.4 15a1.7 1.7 0 0 0-1.56-1.04h-.1v-3.25h.1A1.7 1.7 0 0 0 6.4 9.67a1.7 1.7 0 0 0-.34-1.88L6 7.73l2.3-2.3.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.04-1.56v-.1h3.25v.1a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.3 2.3-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04h.1v3.25h-.1A1.7 1.7 0 0 0 19.4 15Z"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    back: <path d="M19 12H5m6-6-6 6 6 6"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></>,
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>,
    dots: <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M9 7l1-3h4l1 3M6 7l1 14h10l1-14"/></>,
    edit: <><path d="m4 20 4.3-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m13.8 7.5 3 3"/></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.4"/><path d="m21 15-4.5-4.5L7 20"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    chevron: <path d="m8 10 4 4 4-4"/>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const now = () => new Date().toISOString();
const shortDate = (value: string) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(value));
const expiry = (retention: Retention, customDays: number) => {
  const days = retention === "custom" ? customDays : Number(retention);
  const value = new Date();
  value.setDate(value.getDate() + days);
  return value.toISOString();
};
const dimensionsFor = (format: FormatId, custom: { width: number; height: number }) => {
  if (format === "custom") return custom;
  const preset = formats.find((item) => item.id === format)!;
  return { width: preset.width, height: preset.height };
};

function BrandAvatar({ brand, large = false }: { brand: BrandProfile; large?: boolean }) {
  return <span className={`brand-avatar ${large ? "large" : ""}`} style={{ background: brand.colors[0], color: brand.colors[1] }}>{brand.initials}</span>;
}

export function PrismaApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [theme, setTheme] = useState<Theme>("light");
  const [retention, setRetention] = useState<Retention>("30");
  const [hydrated, setHydrated] = useState(false);
  const [customDays, setCustomDays] = useState(45);
  const [brands, setBrands] = useState<BrandProfile[]>(seedBrands);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(seedBrands[0].id);
  const [format, setFormat] = useState<FormatId>("portrait");
  const [customSize, setCustomSize] = useState({ width: 1200, height: 1200 });
  const [templateId, setTemplateId] = useState("message");
  const [content, setContent] = useState<Content>(emptyContent);
  const [suggestedPages, setSuggestedPages] = useState<Content[] | null>(null);
  const [selectedCreation, setSelectedCreation] = useState<string | null>(null);
  const [resultPage, setResultPage] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState<Notice>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | "bulk" | null>(null);
  const [variationOpen, setVariationOpen] = useState(false);
  const [variation, setVariation] = useState("layout");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const exportNodes = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { theme?: Theme; retention?: Retention; customDays?: number; brands?: BrandProfile[]; creations?: Creation[] };
        setTheme(parsed.theme ?? "light"); setRetention(parsed.retention ?? "30"); setCustomDays(parsed.customDays ?? 45);
        setBrands(parsed.brands?.length ? parsed.brands : seedBrands);
        setCreations((parsed.creations ?? []).filter((item) => new Date(item.expiresAt) > new Date()));
      } catch { window.localStorage.removeItem(STORAGE_KEY); }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, retention, customDays, brands, creations }));
  }, [hydrated, theme, retention, customDays, brands, creations]);

  useEffect(() => { if (notice) { const timeout = window.setTimeout(() => setNotice(null), 4200); return () => window.clearTimeout(timeout); } }, [notice]);

  const activeCreation = creations.find((item) => item.id === selectedCreation) ?? null;
  const activeBrand = brands.find((item) => item.id === (activeCreation?.brandId ?? selectedBrand ?? ""));
  const compatibleTemplates = useMemo(() => templates.filter((item) => format === "custom" || item.formats.includes(format)), [format]);
  const currentTemplate = templates.find((item) => item.id === templateId) ?? templates[0];

  const navigate = (next: Screen) => { setScreen(next); setSelectedIds([]); if (next === "generate") setStep(1); };
  const newGeneration = (brandId?: string | null | unknown) => { const chosenBrand = typeof brandId === "string" || brandId === null ? brandId : (brands[0]?.id ?? null); setSelectedBrand(chosenBrand); setFormat("portrait"); setTemplateId("message"); setContent(emptyContent); setSuggestedPages(null); setStep(1); setScreen("generate"); };
  const patchContent = (key: keyof Content, value: string) => { setSuggestedPages(null); setContent((old) => ({ ...old, [key]: value })); };
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    if (!image) return;
    try {
      const prepared = await prepareImageForCard(image);
      setSuggestedPages(null);
      setContent((old) => ({ ...old, imageName: prepared.name, imageData: prepared.dataUrl, imagePosition: "50% 50%" }));
      setNotice({ tone: "success", text: "Imagem preparada para recorte e exportação nítidos." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Não foi possível preparar esta imagem." });
    }
  };

  const generate = async () => {
    const validation = validateContent(content, currentTemplate);
    if (!content.title.trim()) { setNotice({ tone: "error", text: validation[0]?.message ?? "Inclua um título antes de gerar." }); return; }
    setGenerating(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1100));
    const pages = suggestedPages?.length && currentTemplate.pages === "multiple" ? suggestedPages : composePages(content, currentTemplate);
    const creation: Creation = { id: crypto.randomUUID(), name: content.title, brandId: selectedBrand, templateId, format, dimensions: dimensionsFor(format, customSize), content, pages, createdAt: now(), expiresAt: expiry(retention, customDays) };
    setCreations((items) => [creation, ...items]); setSelectedCreation(creation.id); setResultPage(0); setGenerating(false); setScreen("result");
    const softWarning = validation.find((item) => item.code === "content-overflow");
    if (softWarning) setNotice({ tone: "info", text: softWarning.message });
  };

  const interpretBrief = async () => {
    if (content.brief.trim().length < 8) { setNotice({ tone: "error", text: "Descreva a comunicação com pelo menos 8 caracteres." }); return; }
    setGenerating(true);
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic: content.brief, audience: activeBrand?.voice, slideCount: currentTemplate.pages === "multiple" ? 3 : 1, template: currentTemplate.name }) });
      const data = await response.json() as { slides?: { kicker: string; title: string; text: string; cta?: string }[]; error?: string };
      if (!response.ok || !data.slides?.length) throw new Error(data.error || "Não foi possível interpretar o briefing.");
      const pages = data.slides.map((slide, index) => ({ ...content, title: slide.title, subtitle: slide.kicker, body: slide.text, cta: slide.cta ?? (index === data.slides!.length - 1 ? content.cta : "Continue") }));
      setSuggestedPages(pages);
      setContent((old) => ({ ...old, ...pages[0] }));
      setNotice({ tone: "success", text: "O Prisma preencheu uma primeira versão. Revise antes de gerar." });
    } catch (error) { setNotice({ tone: "error", text: error instanceof Error ? error.message : "A interpretação não está disponível." }); }
    finally { setGenerating(false); }
  };

  const updateCreation = () => {
    if (!activeCreation) return;
    const pages = activeCreation.pages.map((item, index) => index === 0 ? content : item);
    setCreations((items) => items.map((item) => item.id === activeCreation.id ? { ...item, name: content.title, content, pages } : item));
    setEditing(false); setNotice({ tone: "success", text: "Card atualizado pelo template selecionado." });
  };

  const duplicate = (creation: Creation, asVariation = false) => {
    const copy: Creation = { ...creation, id: crypto.randomUUID(), name: `${creation.name}${asVariation ? " · variação" : " · cópia"}`, createdAt: now(), expiresAt: expiry(retention, customDays), parentId: asVariation ? creation.id : creation.parentId, pages: creation.pages.map((page) => ({ ...page })) };
    if (asVariation && variation === "text") copy.content = { ...copy.content, title: `${copy.content.title} — uma nova leitura` };
    if (asVariation && variation === "layout") copy.templateId = copy.templateId === "message" ? "visual" : "message";
    setCreations((items) => [copy, ...items]); setSelectedCreation(copy.id); setResultPage(0); setVariationOpen(false); setScreen("result");
    setNotice({ tone: "success", text: asVariation ? "Variação criada e vinculada à criação original." : "Criação duplicada." });
  };

  const removeCreations = () => {
    const ids = confirmDelete === "bulk" ? selectedIds : [confirmDelete!];
    setCreations((items) => items.filter((item) => !ids.includes(item.id))); setSelectedIds([]); setConfirmDelete(null);
    if (activeCreation && ids.includes(activeCreation.id)) setScreen("creations");
    setNotice({ tone: "success", text: ids.length > 1 ? "Criações excluídas definitivamente." : "Criação excluída definitivamente." });
  };

  const download = async () => {
    if (!activeCreation) return;
    const node = document.querySelector<HTMLElement>(".result-stage [data-prisma-card='true']");
    if (!node) { setNotice({ tone: "error", text: "Não foi possível preparar a página para exportação." }); return; }
    const issues = inspectRenderedCard(node);
    if (issues.length) { setNotice({ tone: "error", text: issues[0].message }); return; }
    try {
      await downloadCard(node, `${activeCreation.name}-${resultPage + 1}`, exportFormat);
      setNotice({ tone: "success", text: `Página baixada em ${exportFormat.toUpperCase()} a partir do preview final.` });
    } catch { setNotice({ tone: "error", text: "A exportação não foi concluída. Tente novamente." }); }
  };

  const downloadAll = async () => {
    if (!activeCreation || activeCreation.pages.length < 2) return;
    const nodes = exportNodes.current.filter((node): node is HTMLElement => node !== null);
    if (nodes.length !== activeCreation.pages.length) { setNotice({ tone: "error", text: "Ainda estamos preparando as páginas para o ZIP. Tente novamente em instantes." }); return; }
    const issues = nodes.flatMap((node) => inspectRenderedCard(node));
    if (issues.length) { setNotice({ tone: "error", text: issues[0].message }); return; }
    try {
      await downloadCardsZip(nodes, activeCreation.name, exportFormat);
      setNotice({ tone: "success", text: `${activeCreation.pages.length} páginas reunidas em um ZIP ${exportFormat.toUpperCase()}.` });
    } catch { setNotice({ tone: "error", text: "Não foi possível criar o ZIP. Tente novamente." }); }
  };

  const brandFromForm = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const values = new FormData(event.currentTarget); const name = String(values.get("name") || "Nova marca"); const brand: BrandProfile = { id: crypto.randomUUID(), name, initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(), colors: [String(values.get("primary") || "#2650F6"), String(values.get("secondary") || "#F3E19C")], fonts: String(values.get("fonts") || "Geist"), slogan: String(values.get("slogan") || ""), voice: String(values.get("voice") || ""), guidelines: String(values.get("guidelines") || ""), assets: "Aguardando upload de assets" }; setBrands((items) => [brand, ...items]); setNotice({ tone: "success", text: "Marca cadastrada e pronta para ser usada na geração." }); event.currentTarget.reset(); };

  const navItems: { id: Exclude<Screen, "generate" | "result">; label: string; icon: string }[] = [
    { id: "home", label: "Início", icon: "home" }, { id: "creations", label: "Criações", icon: "grid" }, { id: "templates", label: "Templates", icon: "layers" }, { id: "brands", label: "Marcas", icon: "mark" }, { id: "settings", label: "Configurações", icon: "gear" },
  ];

  const Shell = ({ children }: { children: ReactNode }) => <main className="app-shell">
    <aside className="sidebar"><button className="brand-lockup" onClick={() => navigate("home")} aria-label="Ir para início"><img src={`/brand/prisma/signature/horizontal-${theme === "dark" ? "light" : "ink"}.svg`} alt="Prisma, um produto Prime Creative" /></button>
      <button className="generate-nav" onClick={newGeneration}><Icon name="plus"/> Gerar</button>
      <nav>{navItems.map((item) => <button key={item.id} className={screen === item.id ? "nav-active" : ""} onClick={() => navigate(item.id)}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav>
      <div className="sidebar-bottom"><button className="theme-button" onClick={() => setTheme((value) => value === "light" ? "dark" : "light")}><Icon name={theme === "light" ? "moon" : "sun"}/><span>{theme === "light" ? "Tema noturno" : "Tema claro"}</span></button><p>Criações ficam disponíveis por {retention === "custom" ? `${customDays} dias` : `${retention} dias`}.</p></div>
    </aside><section className="main-panel"><header className="mobile-top"><button className="brand-lockup" onClick={() => navigate("home")}><img src={`/brand/prisma/wordmark/wordmark-${theme === "dark" ? "light" : "ink"}.svg`} alt="Prisma" /></button><button className="icon-button" aria-label="Alternar tema" onClick={() => setTheme((value) => value === "light" ? "dark" : "light")}><Icon name={theme === "light" ? "moon" : "sun"}/></button></header>{children}</section>{notice && <div className={`toast ${notice.tone}`}><Icon name={notice.tone === "success" ? "check" : "spark"}/>{notice.text}</div>}</main>;

  const SectionHead = ({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) => <header className="section-head"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1></div>{action}</header>;

  const Home = () => <Shell><SectionHead eyebrow="Prisma · geração criativa" title="O que vamos criar hoje?" action={<button className="button butter" onClick={() => newGeneration()}><Icon name="spark"/> Gerar</button>}/><section className="hero-intro"><div><p>Transforme conteúdo e identidade em uma peça pronta, sem montar layouts manualmente.</p><button className="text-link" onClick={() => newGeneration()}>Começar uma criação <Icon name="arrow"/></button></div><div className="hero-steps"><span>Marca</span><Icon name="arrow"/><span>Formato</span><Icon name="arrow"/><span>Template</span><Icon name="arrow"/><span>Conteúdo</span></div></section><div className="dashboard-grid"><section className="panel recent-panel"><div className="panel-head"><h2>Criações recentes</h2><button className="text-link" onClick={() => navigate("creations")}>Ver todas <Icon name="arrow"/></button></div>{creations.length ? <div className="recent-list">{creations.slice(0, 3).map((item) => <button className="recent-item" key={item.id} onClick={() => { setSelectedCreation(item.id); setResultPage(0); setScreen("result"); }}><CardRenderer creation={item} brand={brands.find((brand) => brand.id === item.brandId)} compact/><span><strong>{item.name}</strong><small>{shortDate(item.createdAt)} · {item.pages.length} {item.pages.length === 1 ? "página" : "páginas"}</small></span></button>)}</div> : <div className="empty-state"><Icon name="spark" size={24}/><p>Ainda não há criações salvas.</p><button className="text-link" onClick={() => newGeneration()}>Gerar a primeira</button></div>}</section><section className="panel"><div className="panel-head"><h2>Templates para começar</h2><button className="text-link" onClick={() => navigate("templates")}>Ver todos <Icon name="arrow"/></button></div><div className="template-mini-list">{templates.slice(0, 3).map((item) => <button key={item.id} onClick={() => { setTemplateId(item.id); setStep(3); setScreen("generate"); }}><span className={`template-shape ${item.style}`}/><span><strong>{item.name}</strong><small>{item.pages === "multiple" ? "Múltiplas páginas" : "Card ou sequência"}</small></span><Icon name="arrow"/></button>)}</div></section></div><section className="brand-strip"><div className="panel-head"><h2>Marcas no Prisma</h2><button className="text-link" onClick={() => navigate("brands")}>Gerenciar <Icon name="arrow"/></button></div><div className="brand-row">{brands.map((brand) => <button key={brand.id} onClick={() => newGeneration(brand.id)}><BrandAvatar brand={brand}/><span><strong>{brand.name}</strong><small>{brand.fonts}</small></span></button>)}<button className="add-brand-inline" onClick={() => navigate("brands")}><Icon name="plus"/> Nova marca</button></div></section></Shell>;

  const Generation = () => <Shell><SectionHead eyebrow="Nova criação" title="Gerar" action={<button className="button ghost" onClick={() => navigate("home")}><Icon name="close"/> Cancelar</button>}/><div className="generator-layout"><aside className="stepper">{[[1, "Marca"], [2, "Formato"], [3, "Template"], [4, "Conteúdo"], [5, "Gerar"]].map(([number, label]) => <button key={String(number)} className={step === number ? "active" : step > Number(number) ? "done" : ""} onClick={() => step > Number(number) && setStep(Number(number))}><span>{step > Number(number) ? <Icon name="check" size={14}/> : number}</span>{label}</button>)}</aside><section className="generation-stage">
    {step === 1 && <><p className="stage-question">Para qual marca vamos criar?</p><p className="stage-helper">A marca oferece ao Prisma o contexto visual e verbal da criação.</p><div className="selection-grid brands-select">{brands.map((brand) => <button className={selectedBrand === brand.id ? "selected" : ""} onClick={() => setSelectedBrand(brand.id)} key={brand.id}><BrandAvatar brand={brand} large/><span><strong>{brand.name}</strong><small>{brand.slogan}</small></span><span className="selection-check"><Icon name="check" size={15}/></span></button>)}<button className={selectedBrand === null ? "selected no-brand" : "no-brand"} onClick={() => setSelectedBrand(null)}><span className="no-brand-symbol"><Icon name="mark"/></span><span><strong>Sem marca</strong><small>Usar apenas o conteúdo desta criação.</small></span><span className="selection-check"><Icon name="check" size={15}/></span></button></div></>}
    {step === 2 && <><p className="stage-question">Em qual formato a criação será publicada?</p><p className="stage-helper">O formato define quais templates podem ser usados depois.</p><div className="format-grid">{formats.map((item) => <button className={format === item.id ? "selected" : ""} key={item.id} onClick={() => { setFormat(item.id); if (!templates.find((template) => template.id === templateId && (item.id === "custom" || template.formats.includes(item.id)))) setTemplateId("message"); }}><span className={`format-ratio ${item.id}`}/><strong>{item.name}</strong><small>{item.pixels}</small><span className="selection-check"><Icon name="check" size={15}/></span></button>)}</div>{format === "custom" && <div className="custom-dimensions"><label>Largura<input type="number" min="320" max="6000" value={customSize.width} onChange={(event) => setCustomSize((value) => ({ ...value, width: Number(event.target.value) }))}/></label><span>×</span><label>Altura<input type="number" min="320" max="6000" value={customSize.height} onChange={(event) => setCustomSize((value) => ({ ...value, height: Number(event.target.value) }))}/></label></div>}</>}
    {step === 3 && <><p className="stage-question">Qual estrutura visual funciona melhor?</p><p className="stage-helper">Templates definem composição e campos; nenhum deles abre editor livre.</p><div className="template-grid">{compatibleTemplates.map((item) => <button className={templateId === item.id ? "selected" : ""} key={item.id} onClick={() => setTemplateId(item.id)}><span className={`template-cover ${item.style}`}><span/><i/><b/></span><strong>{item.name}</strong><small>{item.description}</small><em>{item.pages === "multiple" ? "Sequência" : item.pages === "single" ? "Card" : "Card ou sequência"}</em><span className="selection-check"><Icon name="check" size={15}/></span></button>)}</div></>}
    {step === 4 && <><p className="stage-question">O que você quer comunicar?</p><p className="stage-helper">Descreva a ideia em linguagem natural ou escreva os campos abaixo. Você revisa tudo antes de gerar.</p><div className="content-form"><label className="brief-label">Briefing<textarea value={content.brief} onChange={(event) => patchContent("brief", event.target.value)} placeholder="Ex.: anunciar uma nova consultoria para pequenos negócios, com tom direto e convidativo."/></label><button className="button subtle" onClick={interpretBrief} disabled={generating}><Icon name="spark"/> Interpretar briefing</button><div className="content-fields"><label>Título<input value={content.title} onChange={(event) => patchContent("title", event.target.value)}/></label><label>Subtítulo<input value={content.subtitle} onChange={(event) => patchContent("subtitle", event.target.value)}/></label><label className="wide">Texto<textarea value={content.body} onChange={(event) => patchContent("body", event.target.value)}/></label><label>CTA<input value={content.cta} onChange={(event) => patchContent("cta", event.target.value)}/></label><label>Imagem<input type="file" accept="image/*" onChange={handleImageUpload}/></label></div></div></>}
    {step === 5 && <><p className="stage-question">Tudo pronto para o Prisma compor sua criação.</p><p className="stage-helper">{selectedBrand ? `${brands.find((item) => item.id === selectedBrand)?.name} · ` : "Sem marca · "}{formats.find((item) => item.id === format)?.name} · {currentTemplate.name}</p><div className="generate-summary"><CardRenderer creation={{ id: "preview", name: content.title, brandId: selectedBrand, templateId, format, dimensions: dimensionsFor(format, customSize), content, pages: [content], createdAt: now(), expiresAt: now() }} brand={brands.find((item) => item.id === selectedBrand)} /><div><span className="eyebrow">Pronto para gerar</span><h2>A composição será calculada pelo template.</h2><p>Você poderá ajustar conteúdo, imagem ou formato depois, sem mover elementos manualmente.</p><button className="button butter large" onClick={generate} disabled={generating}>{generating ? <><span className="spinner"/> Prisma está compondo</> : <><Icon name="spark"/> Gerar card</>}</button></div></div></>}
    <footer className="stage-actions">{step > 1 ? <button className="button ghost" onClick={() => setStep((value) => value - 1)}><Icon name="back"/> Voltar</button> : <span/>}{step < 5 && <button className="button blue" onClick={() => setStep((value) => value + 1)}>Continuar <Icon name="arrow"/></button>}</footer>
  </section></div></Shell>;

  const Creations = () => <Shell><SectionHead eyebrow="Histórico temporário" title="Criações" action={<button className="button butter" onClick={newGeneration}><Icon name="plus"/> Gerar</button>}/><div className="retention-note"><Icon name="gear"/><span>As criações deste espaço são excluídas automaticamente após {retention === "custom" ? `${customDays} dias` : `${retention} dias`}. Arquivos baixados ou exportados não são afetados.</span></div>{creations.length ? <><div className="collection-toolbar"><label><input type="checkbox" checked={selectedIds.length === creations.length} onChange={(event) => setSelectedIds(event.target.checked ? creations.map((item) => item.id) : [])}/> Selecionar todas</label>{selectedIds.length > 0 && <button className="button danger" onClick={() => setConfirmDelete("bulk")}><Icon name="trash"/> Excluir {selectedIds.length}</button>}</div><div className="creation-grid">{creations.map((item) => <article className="creation-card" key={item.id}><label className="selection-box"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(event) => setSelectedIds((ids) => event.target.checked ? [...ids, item.id] : ids.filter((id) => id !== item.id))}/></label><button className="creation-open" onClick={() => { setSelectedCreation(item.id); setResultPage(0); setScreen("result"); }}><CardRenderer creation={item} brand={brands.find((brand) => brand.id === item.brandId)} compact/></button><div><p>{templates.find((template) => template.id === item.templateId)?.name}</p><h2>{item.name}</h2><small>Criada em {shortDate(item.createdAt)} · expira {shortDate(item.expiresAt)}</small></div><div className="card-actions"><button aria-label="Duplicar criação" onClick={() => duplicate(item)}><Icon name="copy"/></button><button aria-label="Excluir criação" onClick={() => setConfirmDelete(item.id)}><Icon name="trash"/></button></div></article>)}</div></> : <div className="empty-page"><img src={`/brand/prisma/symbol/symbol-${theme === "dark" ? "butter" : "blue"}.svg`} alt="Símbolo Prisma"/><h2>Suas criações aparecem aqui.</h2><p>O Prisma guarda o resultado temporariamente para você baixar, variar ou adaptar quando precisar.</p><button className="button butter" onClick={newGeneration}><Icon name="spark"/> Gerar agora</button></div>}</Shell>;

  const Templates = () => <Shell><SectionHead eyebrow="Estruturas reutilizáveis" title="Templates" action={<button className="button butter" onClick={newGeneration}><Icon name="plus"/> Gerar</button>}/><p className="page-intro">Escolha uma estrutura visual adequada à mensagem. O template combina campos de conteúdo com formato e nunca se transforma em uma tela de edição livre.</p><div className="template-library">{templates.map((item) => <article key={item.id}><span className={`template-library-cover ${item.style}`}><span/><i/><b/></span><div><p>{item.category}</p><h2>{item.name}</h2><span>{item.description}</span><dl><div><dt>Compatível com</dt><dd>{item.formats.map((formatId) => formats.find((format) => format.id === formatId)?.name).join(" · ")}</dd></div><div><dt>Páginas</dt><dd>{item.pages === "multiple" ? "Múltiplas" : item.pages === "single" ? "Uma" : "Uma ou múltiplas"}</dd></div><div><dt>Campos</dt><dd>{item.fields.join(" · ")}</dd></div></dl><button className="button blue" onClick={() => { setTemplateId(item.id); setFormat(item.formats[0]); setStep(4); setScreen("generate"); }}>Usar template <Icon name="arrow"/></button></div></article>)}</div></Shell>;

  const Brands = () => <Shell><SectionHead eyebrow="Contexto para geração consistente" title="Marcas" action={<button className="button butter" onClick={() => document.getElementById("brand-form")?.scrollIntoView({ behavior: "smooth" })}><Icon name="plus"/> Nova marca</button>}/><p className="page-intro">Uma marca reúne referências visuais e verbais para que o Prisma saiba como a comunicação deve parecer e como deve falar.</p><div className="brand-management">{brands.map((brand) => <article key={brand.id}><div className="brand-title"><BrandAvatar brand={brand} large/><div><h2>{brand.name}</h2><p>{brand.slogan || "Sem slogan definido"}</p></div><button className="button blue" onClick={() => newGeneration(brand.id)}>Usar para gerar <Icon name="arrow"/></button></div><dl><div><dt>Paleta</dt><dd><i style={{ background: brand.colors[0] }}/><i style={{ background: brand.colors[1] }}/>{brand.colors.join(" · ")}</dd></div><div><dt>Tipografia</dt><dd>{brand.fonts}</dd></div><div><dt>Tom de voz</dt><dd>{brand.voice}</dd></div><div><dt>Diretrizes</dt><dd>{brand.guidelines}</dd></div><div><dt>Ativos</dt><dd>{brand.assets}</dd></div></dl></article>)}</div><form id="brand-form" className="brand-form panel" onSubmit={brandFromForm}><div className="panel-head"><div><h2>Adicionar marca</h2><p>Cadastre o contexto essencial agora; o campo de ativos está pronto para ser conectado a um storage.</p></div></div><div className="content-fields"><label>Nome<input name="name" required placeholder="Nome da marca"/></label><label>Slogan<input name="slogan" placeholder="Uma frase de marca"/></label><label>Cor principal<input name="primary" defaultValue="#2650F6" type="color"/></label><label>Cor de apoio<input name="secondary" defaultValue="#F3E19C" type="color"/></label><label>Tipografias<input name="fonts" placeholder="Ex.: Geist + serif"/></label><label>Tom de voz<input name="voice" placeholder="Ex.: claro, próximo e preciso"/></label><label className="wide">Diretrizes<textarea name="guidelines" placeholder="O que deve ser priorizado nas criações?"/></label></div><button className="button butter" type="submit"><Icon name="plus"/> Cadastrar marca</button></form></Shell>;

  const Settings = () => <Shell><SectionHead eyebrow="Produto e preferências" title="Configurações"/><div className="settings-stack"><section className="setting-card"><div><h2>Aparência</h2><p>Os dois temas usam tokens específicos do Prisma — não uma inversão automática de cores.</p></div><div className="theme-options"><button className={theme === "light" ? "selected" : ""} onClick={() => setTheme("light")}><Icon name="sun"/> Claro <small>#EDECE6</small></button><button className={theme === "dark" ? "selected" : ""} onClick={() => setTheme("dark")}><Icon name="moon"/> Noturno <small>#0E1116</small></button></div></section><section className="setting-card"><div><h2>Retenção de criações</h2><p>Cada criação recebe uma data prevista de exclusão. Exclusões manuais são definitivas.</p></div><div className="retention-options">{(["15", "30", "90", "custom"] as Retention[]).map((value) => <label key={value}><input type="radio" name="retention" checked={retention === value} onChange={() => setRetention(value)}/><span>{value === "custom" ? "Personalizado" : `${value} dias${value === "30" ? " · padrão" : ""}`}</span></label>)}</div>{retention === "custom" && <label className="day-input">Dias<input type="number" min="1" max="365" value={customDays} onChange={(event) => setCustomDays(Number(event.target.value))}/></label>}</section><section className="setting-card integration"><div><p className="eyebrow">Integrações</p><h2>Google Drive</h2><p>Envie uma criação pronta para uma pasta escolhida. O Drive não é uma biblioteca dentro do Prisma.</p></div><div className="integration-status"><span>Não conectado</span><button className="button blue" disabled title="Requer configuração de OAuth do Google">Conectar Google Drive</button><small>Esta integração requer credenciais OAuth e uma pasta de destino configurada no ambiente.</small></div></section></div></Shell>;

  const Result = () => {
    if (!activeCreation) return <Creations />;
    const resultBrand = brands.find((brand) => brand.id === activeCreation.brandId);
    exportNodes.current = [];
    return <Shell>
      <SectionHead eyebrow={activeCreation.pages.length > 1 ? "Criação com múltiplas páginas" : "Card gerado"} title={activeCreation.name} action={<button className="button ghost" onClick={() => navigate("creations")}><Icon name="back"/> Criações</button>}/>
      <div className="result-layout">
        <section className="result-stage">
          <CardRenderer creation={activeCreation} brand={resultBrand} page={resultPage}/>
          {activeCreation.pages.length > 1 && <div className="page-switcher">{activeCreation.pages.map((_, index) => <button key={index} aria-label={`Página ${index + 1}`} className={resultPage === index ? "active" : ""} onClick={() => setResultPage(index)}>{index + 1}</button>)}</div>}
        </section>
        <aside className="result-actions">
          <div><p className="eyebrow">Peça pronta</p><h2>{activeCreation.pages.length === 1 ? "Seu card está pronto." : "Sua criação está pronta."}</h2><p>O template calculou a composição para {formats.find((formatItem) => formatItem.id === activeCreation.format)?.name} · {activeCreation.dimensions.width} × {activeCreation.dimensions.height}px.</p></div>
          <div className="export-controls" aria-label="Formato de exportação"><span>Formato</span><button className={exportFormat === "png" ? "selected" : ""} onClick={() => setExportFormat("png")}>PNG</button><button className={exportFormat === "jpg" ? "selected" : ""} onClick={() => setExportFormat("jpg")}>JPG</button></div>
          <button className="button blue full" onClick={download}><Icon name="download"/> Baixar página {activeCreation.pages.length > 1 ? resultPage + 1 : ""}</button>
          {activeCreation.pages.length > 1 && <button className="button butter full" onClick={downloadAll}><Icon name="layers"/> Baixar todas em ZIP</button>}
          <div className="action-list"><button onClick={() => setVariationOpen(true)}><Icon name="spark"/><span><strong>Gerar variação</strong><small>Explorar outra direção com base nesta criação.</small></span><Icon name="arrow"/></button><button onClick={() => { setContent(activeCreation.content); setEditing(true); }}><Icon name="edit"/><span><strong>Editar conteúdo</strong><small>Atualize textos ou CTA; a composição será recalculada.</small></span><Icon name="arrow"/></button><button onClick={() => { setContent(activeCreation.content); setStep(4); setSelectedBrand(activeCreation.brandId); setFormat(activeCreation.format); setTemplateId(activeCreation.templateId); setScreen("generate"); }}><Icon name="image"/><span><strong>Trocar imagem</strong><small>Selecione uma nova imagem e gere novamente.</small></span><Icon name="arrow"/></button><button onClick={() => { setContent(activeCreation.content); setStep(2); setSelectedBrand(activeCreation.brandId); setTemplateId(activeCreation.templateId); setScreen("generate"); }}><Icon name="grid"/><span><strong>Adaptar formato</strong><small>Escolha outra proporção compatível.</small></span><Icon name="arrow"/></button><button className="danger-link" onClick={() => setConfirmDelete(activeCreation.id)}><Icon name="trash"/> Excluir definitivamente</button></div>
        </aside>
      </div>
      {activeCreation.pages.length > 1 && <div className="export-staging" aria-hidden="true">{activeCreation.pages.map((_, index) => <div key={index} ref={(node) => { exportNodes.current[index] = node?.querySelector<HTMLElement>("[data-prisma-card='true']") ?? null; }}><CardRenderer creation={activeCreation} brand={resultBrand} page={index} exportMode /></div>)}</div>}
    </Shell>;
  };

  const Modal = () => (editing && activeCreation) ? <div className="modal-backdrop"><section className="modal"><button className="modal-close" aria-label="Fechar" onClick={() => setEditing(false)}><Icon name="close"/></button><p className="eyebrow">Editar conteúdo</p><h2>Atualize o que a criação comunica.</h2><p>O Prisma mantém o template e recalcula a composição. Não há movimentação manual de elementos.</p><div className="content-fields"><label>Título<input value={content.title} onChange={(event) => patchContent("title", event.target.value)}/></label><label>Subtítulo<input value={content.subtitle} onChange={(event) => patchContent("subtitle", event.target.value)}/></label><label className="wide">Texto<textarea value={content.body} onChange={(event) => patchContent("body", event.target.value)}/></label><label>CTA<input value={content.cta} onChange={(event) => patchContent("cta", event.target.value)}/></label><label>Imagem<input type="file" accept="image/*" onChange={handleImageUpload}/></label></div><div className="modal-actions"><button className="button ghost" onClick={() => setEditing(false)}>Cancelar</button><button className="button butter" onClick={updateCreation}><Icon name="spark"/> Atualizar card</button></div></section></div> : null;
  const VariationModal = () => (variationOpen && activeCreation) ? <div className="modal-backdrop"><section className="modal compact-modal"><button className="modal-close" aria-label="Fechar" onClick={() => setVariationOpen(false)}><Icon name="close"/></button><p className="eyebrow">Gerar variação</p><h2>O que você quer explorar?</h2><div className="variation-options">{[["layout", "Variar layout", "Outra estrutura visual compatível."], ["text", "Variar texto", "Uma nova leitura da mesma ideia."], ["image", "Variar imagem", "Preparado para assets conectados."], ["all", "Variar tudo", "Outra direção com base na criação."]].map(([value, label, description]) => <button className={variation === value ? "selected" : ""} key={value} onClick={() => setVariation(value)}><strong>{label}</strong><small>{description}</small><span className="selection-check"><Icon name="check" size={15}/></span></button>)}</div><label className="brief-label">Orientação opcional<textarea placeholder="Ex.: mais sóbrio, mais direto, mais editorial."/></label><div className="modal-actions"><button className="button ghost" onClick={() => setVariationOpen(false)}>Cancelar</button><button className="button butter" onClick={() => duplicate(activeCreation, true)}><Icon name="spark"/> Gerar variação</button></div></section></div> : null;
  const DeleteModal = () => confirmDelete ? <div className="modal-backdrop"><section className="modal confirm-modal"><img src={`/brand/prisma/symbol/symbol-${theme === "dark" ? "butter" : "blue"}.svg`} alt="Símbolo Prisma"/><p className="eyebrow">Exclusão definitiva</p><h2>{confirmDelete === "bulk" ? `Excluir ${selectedIds.length} criações?` : "Excluir esta criação?"}</h2><p>Essa ação não pode ser desfeita. Arquivos que você já baixou ou exportou não são afetados.</p><div className="modal-actions"><button className="button ghost" onClick={() => setConfirmDelete(null)}>Cancelar</button><button className="button danger" onClick={removeCreations}><Icon name="trash"/> Excluir definitivamente</button></div></section></div> : null;

  const page = screen === "home" ? <Home/> : screen === "creations" ? <Creations/> : screen === "templates" ? <Templates/> : screen === "brands" ? <Brands/> : screen === "settings" ? <Settings/> : screen === "generate" ? <Generation/> : <Result/>;
  return <>{page}<Modal/><VariationModal/><DeleteModal/></>;
}

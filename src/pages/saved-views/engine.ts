import { asset } from "../../asset";

/*
 * Saved views prototype — behaviour ported 1:1 from the published "Saved View Prototypes" artifact.
 * It is a small string-template renderer (as in the original) mounted into a React-owned element,
 * so interactions, copy and timing match the reviewed prototype exactly.
 * Only the unreachable variant C/D code paths were left out.
 */

type Query = {
  brand: boolean;
  status: string[];
  f: Record<string, string[]>;
  sort: string;
  search: string;
  mode: "regular" | "smart";
  date?: boolean;
};
type Vis = "me" | "team";
type SavedView = { id: string; name: string; vis: Vis; q: Query };
type VariantId = "A" | "B";
type Snapshot = { views: SavedView[]; active: string; q: Query };
type Modal =
  | { type: "rename"; id: string; focused?: boolean; err?: boolean }
  | { type: "save"; name: string; vis: Vis; q: Query; focused?: boolean; err?: boolean };
type State = {
  variant: VariantId;
  views: SavedView[];
  active: string;
  q: Query;
  open: string | null;
  exp: string | null;
  modal: Modal | null;
  toast: { msg: string; undo?: Snapshot } | null;
  newId: string | null;
  sub: string | null;
};

const P: Record<string, string> = {
  chev: '<path d="M6 9l6 6 6-6"/>', chevr: '<path d="M9 6l6 6-6 6"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.5-4.5"/>', sliders: '<path d="M7 4v16M12 4v16M17 4v16"/><path d="M5 9h4M10 15h4M15 8h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  trash: '<path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M6.5 7l1 12a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-12"/>',
  pen: '<path d="M16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1 1-4z"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  spark: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/>',
  status: '<circle cx="12" cy="12" r="8" stroke-dasharray="3.2 3"/>', sort: '<path d="M4 7h16M7 12h10M10 17h4"/>',
  bookmark: '<path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-4-6 4V5.5a1 1 0 0 1 1-1z"/>', up: '<path d="M12 19V5M6 11l6-6 6 6"/>', export: '<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  smile: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4 4 0 0 0 7 0"/><circle cx="9.5" cy="10" r=".6" fill="currentColor"/><circle cx="14.5" cy="10" r=".6" fill="currentColor"/>',
  msg: '<path d="M5 5.5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4 3v-3H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"/>', users: '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9.5" r="2.5"/><path d="M16 14.2a4.5 4.5 0 0 1 5 4.8"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>', box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>', tag: '<path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9z"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/>',
  refresh: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1L19.5 9M19.5 4.5V9H15M19.5 12a7.5 7.5 0 0 1-13 5.1L4.5 15M4.5 19.5V15H9"/>',
  store: '<path d="M5 9.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M3.5 9.5L5 4.5h14l1.5 5a2.6 2.6 0 0 1-5.1.6 2.6 2.6 0 0 1-3.4 1.4 2.6 2.6 0 0 1-3.4-1.4 2.6 2.6 0 0 1-5.1-.6z"/><path d="M10 20v-4.5h4V20"/>',
  devices: '<rect x="3.5" y="4.5" width="13" height="10" rx="1.5"/><path d="M6.5 18.5h5"/><rect x="14" y="9.5" width="6.5" height="10" rx="1.5"/><circle cx="17.25" cy="16.8" r=".5" fill="currentColor"/>',
  user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M5 20a7 7 0 0 1 14 0"/>', idcard: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16a3 3 0 0 1 6 0M14 10h4M14 13.5h4"/>',
  bolt: '<path d="M13 3.5L6 13.5h5.5L10.5 20.5 18 10.5h-5.5z"/>', labels: '<path d="M8 4.5h9a1 1 0 0 1 1 1V19l-5-3.2L8 19z"/><path d="M5.5 7.5V19"/>',
  target: '<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>', dollar: '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.4-1-1.5-1.7-2.8-1.7-1.6 0-2.8.9-2.8 2.2 0 3 5.7 1.6 5.7 4.6 0 1.3-1.3 2.2-2.9 2.2-1.4 0-2.5-.7-2.9-1.8M12 6v1.5M12 16.5V18"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
  alert: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5"/><circle cx="12" cy="16" r=".6" fill="currentColor"/>',
  play: '<path d="M7 5.5v13a1 1 0 0 0 1.5.9l10.2-6.5a1 1 0 0 0 0-1.7L8.5 4.6A1 1 0 0 0 7 5.5z"/>',
};
export const I = (k: string, w?: number) =>
  `<svg viewBox="0 0 24 24" ${w ? `width="${w}" height="${w}"` : ""} fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k] || ""}</svg>`;
const tick = () => I("check").replace("<svg", '<svg class="tick"');
const esc = (s: unknown) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
const norm = (q: Query) =>
  JSON.stringify({
    b: !!q.brand,
    st: [...q.status].sort(),
    f: Object.keys(q.f).filter((k) => q.f[k].length).sort().map((k) => [k, [...q.f[k]].sort()]),
    s: q.sort,
    t: q.search.trim(),
    m: q.mode,
    d: !!q.date,
  });
const eq = (a: Query, b: Query) => norm(a) === norm(b);

const CATS = [
  { k: "platform", label: "Platform", icon: "devices", values: ["Instagram", "TikTok", "YouTube Shorts"] },
  { k: "followers", label: "Followers", icon: "user", values: ["Nano (under 10K)", "Micro (10K–100K)", "Mid-tier (100K–500K)", "Macro (500K+)"] },
  { k: "demo", label: "Demographics", icon: "idcard", values: ["Women", "Men", "18–24", "25–34"] },
  { k: "sentiment", label: "Sentiment", icon: "smile", values: ["Positive", "Neutral", "Negative"] },
  { k: "velocity", label: "Velocity", icon: "bolt", values: ["Trending", "Steady"] },
  { k: "labels", label: "Labels", icon: "labels", values: ["Holiday Brief", "Brand Safety", "Social Queries", "Travel"] },
  { k: "confidence", label: "Confidence", icon: "target", values: ["High", "Medium"] },
  { k: "paid", label: "Organic/Paid", icon: "dollar", values: ["Organic", "Paid"] },
  { k: "views", label: "View Count", icon: "play", values: ["10K+", "100K+", "1M+"] },
];
const STATUSES = ["Not started", "In progress", "Done"];
const SORTS = ["Newest", "Most engagement", "Most mentions"];
const PRESETS = [
  { id: "all", name: "All Posts", emoji: "🗂️" },
  { id: "reviewed", name: "Reviewed (0)", emoji: "👩‍💻" },
  { id: "labelled", name: "Labelled", emoji: "📌" },
];
const BLANK: Query = { brand: false, status: [], f: {}, sort: "Newest", search: "", mode: "regular" };

export const VARIANTS: Record<VariantId, { name: string; save: string; views: string; edit: string; refs: [string, string][]; tradeoff: string }> = {
  A: {
    name: "Filter menu",
    save: "Open <b>Filter</b>: <b>Save view</b> is pinned at the top of the menu, next to your saved views, so it never scrolls away. It appears as soon as a filter changes.",
    views: "Pick a view from the pinned list to apply it. The selected view’s checkbox is ticked, and the Filter button takes its name. Click the selected view again to exit it.",
    edit: "Changing a selected view marks it <b>Edited</b> (in the list and on the Filter button) and swaps the button for <b>Save as new · Update</b>.",
    refs: [
      ["Air", "https://mobbin.com/screens/720054e9-1814-4363-b820-b227d54fbadf"],
      ["Salesforce", "https://mobbin.com/screens/3d37072e-5be2-4373-9714-d51733fc3296"],
    ],
    tradeoff: "No new chrome on the page. Views are only visible once someone opens the menu.",
  },
  B: {
    name: "Toolbar split button",
    save: "A permanent <b>Save view</b> split button sits beside Status, Filter and Sort. When a view is open, the button shows that view’s name and opens its options.",
    views: "Everything lives in this one button’s menu: picking a view, saving, and renaming, sharing or deleting the open view. The tab row stays fixed.",
    edit: "The chevron offers <b>Update view</b>, <b>Save as new</b> or <b>Discard changes</b>.",
    refs: [
      ["QuickBooks", "https://mobbin.com/screens/667f2fe5-3ed6-4449-8967-322b434da111"],
      ["Attio", "https://mobbin.com/screens/a1cca18c-6359-46c4-a986-a46332943a05"],
    ],
    tradeoff: "Clear that the whole page setup is saved. Adds a permanent control to a crowded toolbar.",
  },
};

const seedViews = (): SavedView[] => [
  { id: "v1", name: "Negative on TikTok", vis: "team", q: { brand: false, status: [], f: { platform: ["TikTok"], sentiment: ["Negative"] }, sort: "Most engagement", search: "", mode: "regular" } },
  { id: "v2", name: "Holiday brief creators", vis: "me", q: { brand: true, status: ["Not started"], f: { labels: ["Holiday Brief"], followers: ["Micro (10K–100K)"] }, sort: "Newest", search: "", mode: "regular" } },
  { id: "v3", name: "Brand safety review", vis: "team", q: { brand: false, status: ["Not started", "In progress"], f: { labels: ["Brand Safety"], sentiment: ["Negative"] }, sort: "Most mentions", search: "", mode: "regular" } },
];
const START = (): Query => ({ brand: false, status: ["Not started"], f: { platform: ["TikTok", "Instagram"] }, sort: "Newest", search: "", mode: "regular", date: true });
const DATE_RANGE = "11 Nov 2026 - 12 Nov 2026";
const fresh = (v?: VariantId): State => ({ variant: v || "A", views: seedViews(), active: "all", q: START(), open: null, exp: "platform", modal: null, toast: null, newId: null, sub: null });

const VARIANT_KEY = "sv-variant2";

type Avatar = string | [letter: string, color: string];
type Card = {
  t: string; p: string; media: string; h: number;
  tags?: ("positive" | "mentions")[]; icons?: string[]; video?: boolean; carousel?: boolean;
  people?: Avatar[]; who?: string; reach?: string;
  st: [string, string, string, string]; eng: "eye" | "person";
};
/* The ten posts on the production Engagement page, in order. Media heights come from the design. */
const CARDS: Card[] = [
  { t: "Brand Mention", p: "A real estate agent promotes studios in São Paulo as an investment, mentioning Airbnb as a way to generate income from short-term rentals.", media: "c1-media.jpg", h: 540.33, tags: ["positive"], icons: ["ic-instagram.svg", "ic-reel.svg"], people: [["r", "#554db3"], ["b", "#9cb34d"], "c1-avatar.jpg"], who: "bernardo_ricardor and 2 others", reach: "1.04K", st: ["465", "34", "10", "9.5%"], eng: "eye" },
  { t: "Macro Influencer, Brand Mention", p: "Sophia Amoruso cites Airbnb's 2009 early investment as an example of a discovery bet in her VC educational video.", media: "c2-media.png", h: 540.33, tags: ["mentions"], video: true, st: ["1.1K", "41", "9", "6.2%"], eng: "eye" },
  { t: "Brand Mention", p: "Wadhurst Castle Cottages promotes a last-minute stay at Tawny Owl Lodge, tagging Airbnb as a booking platform for the two-night autumn escape.", media: "c3-media.jpg", h: 540.33, people: ["c3-avatar.jpg"], who: "wadhurstcastlecottage", reach: "559", st: ["N/A", "2", "0", "0.4%"], eng: "person" },
  { t: "Brand Mention", p: "A Johannesburg creator announces her first brand collaboration with Midnight Muse South Africa, filming the lingerie reveal in an Airbnb in Craighall, Johannesburg.", media: "c4-media.jpg", h: 525.33, tags: ["positive"], icons: ["ic-instagram.svg", "ic-reel.svg"], people: ["c4-avatar.jpg"], who: "mckenziefox.collabs", reach: "904", st: ["103", "12", "1", "13.6%"], eng: "eye" },
  { t: "Brand Mention, Social Queries: Holiday Brief", p: "A luxury retreat creator promotes The Deer Hut as an Airbnb listing for cozy winter getaways with a log burner and hot chocolate.", media: "c5-media.jpg", h: 540.33, tags: ["positive", "mentions"], people: ["c5-avatar.jpg"], who: "highfieldsestate", reach: "2.61K", st: ["N/A", "2", "0", "0.1%"], eng: "person" },
  { t: "Brand Mention, Social Queries: Holiday Brief", p: "A creator features a luxury glamping stay inside Colorado sandstone cliffs, tagging @airbnb to highlight the unique accommodation experience.", media: "c6-media.jpg", h: 540.33, tags: ["positive"], icons: ["ic-tag.svg", "ic-instagram.svg", "ic-carousel.svg"], carousel: true, people: ["c6-avatar-a.jpg", "c6-avatar-b.jpg"], who: "zenuncharted and 1 other", reach: "35", st: ["N/A", "3", "0", "8.6%"], eng: "person" },
  { t: "Brand Mention, Social Queries: Holiday Brief", p: "A traveler describes the view from her Airbnb stay in Kefalonia, Greece, as the most peaceful she has ever had and praises staying in the authentic village of Keramies.", media: "c7-media.jpg", h: 525.33, tags: ["positive"], icons: ["ic-tag.svg", "ic-instagram.svg", "ic-reel.svg"], people: ["c7-avatar.jpg"], who: "places.of.pause", reach: "2.5K", st: ["145", "4", "0", "4.1%"], eng: "eye" },
  { t: "Micro Influencer, Brand Mention", p: "A muralist family paints a mural for an Airbnb property in Greenville, SC, showcasing their custom mural service.", media: "c8-media.jpg", h: 540.33, icons: ["ic-instagram.svg", "ic-reel.svg"], people: [["s", "#4db38b"], ["a", "#4db3ac"], "c8-avatar.jpg"], who: "esaugarciaalday and 2 others", reach: "14.44K", st: ["785", "28", "9", "5.2%"], eng: "eye" },
  { t: "Brand Mention, Social Queries: Holiday Brief", p: "An Airbnb host promotes a furnished rental apartment in Ahmedabad, inviting guests to stay.", media: "c9-media.jpg", h: 540.33, tags: ["positive"], icons: ["ic-instagram.svg", "ic-reel.svg"], people: ["c9-avatar.jpg"], who: "thesevensky.co.in", reach: "18", st: ["773", "6", "0", "1.6%"], eng: "eye" },
  { t: "Brand Mention", p: "A creator promotes The White House BnB in Gwalior, highlighting its rooms, rooftop, and 4.96 rating, and directs viewers to book through Airbnb.", media: "c10-media.jpg", h: 525.33, tags: ["positive"], icons: ["ic-instagram.svg", "ic-reel.svg"], people: [["w", "#4db3ad"], "c10-avatar.jpg"], who: "rishabh_jain_852 and 1 other", reach: "885", st: ["419", "15", "1", "4.1%"], eng: "eye" },
];

const A = (n: string) => asset(`/figma/saved-views/${n}`);
const img = (n: string, w: number, h = w, cls = "p-ic") => `<img class="${cls}" src="${A(n)}" alt="" width="${w}" height="${h}">`;

/** Mounts the prototype into `root` (page) and `layer` (overlays on <body>). Returns a cleanup function. */
export function mountSavedViews(root: HTMLElement, layer: HTMLElement): () => void {
  let S = fresh();
  try {
    const v = localStorage.getItem(VARIANT_KEY);
    if (v === "A" || v === "B") S.variant = v;
  } catch {
    // storage unavailable; keep default variant
  }

  const $ = <T extends HTMLElement = HTMLElement>(s: string) => (root.querySelector<T>(s) ?? layer.querySelector<T>(s));
  const inUI = (t: EventTarget | null) => t instanceof Element && (root.contains(t) || layer.contains(t));

  const view = (id: string | null) => S.views.find((v) => v.id === id);
  const base = () => view(S.active)?.q || BLANK;
  const isDirty = () => !eq(S.q, base());
  const catCount = () => (S.q.brand ? 1 : 0) + CATS.reduce((n, c) => n + (S.q.f[c.k]?.length || 0), 0);
  // The Filter badge also counts the date range, as in production.
  const fCount = () => catCount() + (S.q.date ? 1 : 0);
  const summary = (q: Query) => {
    const out: string[] = [];
    if (q.search.trim()) out.push(`“${q.search.trim()}”`);
    if (q.status.length) out.push(q.status.join(", "));
    if (q.brand) out.push("Brand mentions only");
    CATS.forEach((c) => {
      const v = q.f[c.k];
      if (v?.length) out.push(v.map((x) => x.replace(/ \(.*\)/, "")).join(", "));
    });
    return out;
  };
  const suggest = () => summary(S.q).slice(0, 2).join(" · ") || "My view";
  const count = () => {
    let n = ({ all: 1243, reviewed: 0, labelled: 388 } as Record<string, number>)[S.active] ?? 1243;
    n *= S.q.status.length ? 0.55 : 1;
    if (S.q.brand) n *= 0.6;
    CATS.forEach((c) => {
      const v = S.q.f[c.k]?.length;
      if (v) n *= Math.min(1, 0.18 + v * 0.22);
    });
    if (S.q.search.trim()) n *= 0.3;
    return Math.max(n ? 1 : 0, Math.round(n));
  };

  const menu = (id: string, html: string, cls = "") => (S.open === id ? `<div class="pop ${cls}" data-pop>${html}</div>` : "");

  function tabs() {
    let h = '<div class="p-tabs" role="tablist" aria-label="Views">';
    PRESETS.forEach((p) => (h += `<button role="tab" aria-selected="${S.active === p.id}" class="p-tab ${S.active === p.id ? "on" : ""}" data-act="go" data-id="${p.id}"><span class="p-emoji">${p.emoji}</span>${p.name}</button>`));
    return h + "</div>";
  }

  /* Toolbar button as in production: icon tile, label, chevron, and an optional count badge. */
  const tbButton = (open: string, icon: string, label: string, badge: number, extra = "") =>
    `<button class="p-tb ${S.open === open ? "is-on" : ""}" data-open="${open}"><span class="p-tile">${img(icon, 16)}</span><span class="tb-label">${label}</span>${extra}${img("tb-chev.svg", 16)}</button>${badge ? `<span class="p-badge">${badge}</span>` : ""}`;

  const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
  const chipText = (vals: string[]) => vals.join(", ") + (vals.length > 1 ? ` (${vals.length})` : "");
  const chip = (icon: string, label: string, k: string) =>
    `<span class="p-chip">${icon}<span>${esc(label)}</span><button class="p-chip-x" aria-label="Remove ${esc(label)}" data-act="rmchip" data-k="${k}">${img("chip-x.svg", 16)}</button></span>`;

  /* Applied filters, shown under the search bar as in production */
  function chips() {
    const q = S.q, out: string[] = [];
    if (q.status.length) out.push(chip(img("chip-status.svg", 16), chipText(q.status.map(titleCase)), "status"));
    if (q.brand) out.push(chip(`<span class="p-chip-i">${I("store")}</span>`, "Brand mentions only", "brand"));
    CATS.forEach((c) => {
      const v = q.f[c.k];
      if (!v?.length) return;
      const icon = c.k === "platform" ? img("chip-platform.svg", 16) : `<span class="p-chip-i">${I(c.icon)}</span>`;
      const vals = c.k === "platform" ? v.map((x) => x.charAt(0) + x.slice(1).toLowerCase()) : v;
      out.push(chip(icon, chipText(vals), c.k));
    });
    if (q.date) out.push(chip(img("chip-date.svg", 16), DATE_RANGE, "date"));
    return out.length ? `<div class="p-chips">${out.join("")}</div>` : "";
  }

  /* Filter dropdown, matching production: brand toggle, then accordion categories with count + nested checkboxes */
  function filterMenu() {
    const v = S.variant, sv = view(S.active), dirty = isDirty();
    let h = "";
    if (v === "A") {
      const act = sv && dirty
        ? `<button class="btn-soft xs" data-act="save-new">Save as new</button><button class="btn-dark xs" data-act="update">${I("refresh")}Update</button>`
        : dirty ? `<button class="btn-dark xs" data-act="save-new">${I("bookmark")}Save view</button>` : "";
      h += `<div class="fhead"><div class="fh-row"><span class="fh-t">Saved views <small>${S.views.length}</small></span>${act}</div>`;
      h += `<div class="vlist" role="listbox" aria-label="Saved views">`;
      S.views.forEach((x) => {
        const on = S.active === x.id;
        h += `<div class="vline" data-vid="${x.id}"><button class="vrow ${on ? "on" : ""}" role="option" aria-selected="${on}" data-act="go" data-id="${on ? "all" : x.id}" data-keep="1" title="${on ? "Click again to exit this view" : "Apply this view"}"><span class="pcb">${I("check")}</span><span class="pl"><span>${esc(x.name)}</span><small>${x.vis === "me" ? "Only me" : "Team"}</small></span>${on && dirty ? '<span class="edited">Edited</span>' : ""}</button><button class="vmore ${S.sub === x.id ? "on" : ""}" aria-label="Options for ${esc(x.name)}" aria-expanded="${S.sub === x.id}" title="Rename, share or delete" data-act="sub" data-id="${x.id}" data-keep="1">${I("chevr")}</button></div>`;
      });
      if (!S.views.length) h += `<div class="fh-hint">No saved views yet. Set filters below, then save.</div>`;
      h += `</div>${sv && dirty ? `<div class="fh-hint">You’ve changed this view. <button class="lnk" data-act="reset" data-keep="1">Reset</button></div>` : !sv && dirty ? `<div class="fh-hint">These filters aren’t saved yet.</div>` : ""}</div>`;
    }
    h += `<div class="fmenu-scroll">`;
    h += `<button class="fopt top ${S.q.brand ? "on" : ""}" data-act="brand" data-keep="1"><span class="pcb">${I("check")}</span><span class="ftile">${I("store")}</span><span class="fl1">Only show brand mention</span></button><div class="fdiv"></div>`;
    CATS.forEach((c) => {
      const sel = S.q.f[c.k] || [], open = S.exp === c.k;
      h += `<button class="frow" data-act="exp" data-k="${c.k}" data-keep="1" aria-expanded="${open}"><span class="ftile">${I(c.icon)}</span><span class="fl1">${c.label}</span>${sel.length ? `<span class="fcount">${sel.length}</span>` : ""}<span class="chv ${open ? "open" : ""}">${I(open ? "chev" : "chevr")}</span></button>`;
      if (open) c.values.forEach((x) => (h += `<button class="fopt ${sel.includes(x) ? "on" : ""}" data-act="togf" data-k="${c.k}" data-v="${esc(x)}" data-keep="1"><span class="pcb">${I("check")}</span><span class="fl1">${x}</span></button>`));
    });
    h += `</div>`;
    return h;
  }

  function toolbar() {
    const v = S.variant, dirty = isDirty(), sv = view(S.active);
    let h = '<div class="p-tbrow">';
    if (v === "B") {
      h += `<div class="rel"><div class="p-split ${S.open === "splitm" ? "is-on" : ""}"><button ${dirty && !sv ? 'data-act="save-new"' : 'data-open="splitm"'} title="${sv ? esc(sv.name) : dirty ? "Save these filters as a view" : "Saved views"}"><span class="p-tile">${I("bookmark")}</span><span class="tb-label">${sv ? esc(sv.name) : "Save view"}</span>${sv && dirty ? '<span class="edited">Edited</span>' : ""}</button><button aria-label="More save options" data-open="splitm">${img("tb-chev.svg", 16)}</button></div>${menu("splitm", splitMenu(sv, dirty), "right wide")}</div>`;
    }
    h += `<div class="rel tb">${tbButton("status", "tb-status.svg", "Status", S.q.status.length)}${menu("status", `<div class="pg"><div class="ph">Status</div>${STATUSES.map((x) => `<button class="fopt ${S.q.status.includes(x) ? "on" : ""}" data-act="togs" data-v="${x}" data-keep="1"><span class="pcb">${I("check")}</span><span class="fl1">${x}</span></button>`).join("")}</div>`, "right")}</div>`;
    const inView = v === "A" && sv;
    const flabel = inView ? esc(sv.name) : "Filter";
    h += `<div class="rel tb">${tbButton("filter", "tb-filter.svg", flabel, fCount(), inView && dirty ? '<span class="edited">Edited</span>' : "")}${menu("filter", filterMenu(), "right fmenu")}</div>`;
    h += `<div class="rel tb">${tbButton("sort", "tb-sort.svg", "Sort by", 0)}${menu("sort", `<div class="pg"><div class="ph">Sort by</div>${SORTS.map((x) => `<button class="pr ${S.q.sort === x ? "on" : ""}" data-act="sort" data-v="${x}"><span class="pl"><span>${x}</span></span>${S.q.sort === x ? tick() : ""}</button>`).join("")}</div>`, "right")}</div>`;
    return h + "</div>";
  }

  function splitMenu(sv: SavedView | undefined, dirty: boolean) {
    const list = `<div class="pg"><div class="ph"><span>Views <span style="margin-left:2px">${S.views.length}</span></span>${sv ? `<button class="lnk ph-x" data-act="go" data-id="all">${I("close")}Exit view</button>` : ""}</div>${S.views.map((v) => `<div class="vline" data-vid="${v.id}"><button class="vrow ${S.active === v.id ? "on" : ""}" data-act="go" data-id="${v.id}" data-keep="1"><span class="pcb">${I("check")}</span><span class="pl"><span>${esc(v.name)}</span><small>${v.vis === "me" ? "Only me" : "Team"}</small></span>${S.active === v.id && dirty ? '<span class="edited">Edited</span>' : ""}</button><button class="vmore ${S.sub === v.id ? "on" : ""}" aria-label="Options for ${esc(v.name)}" aria-expanded="${S.sub === v.id}" title="Rename, share or delete" data-act="sub" data-id="${v.id}" data-keep="1">${I("chevr")}</button></div>`).join("") || '<div class="fempty">No saved views yet</div>'}</div>`;
    let h = "";
    if (!dirty && !sv) h += `<div class="pg"><div class="fempty" style="padding:10px 10px 8px;max-width:260px">Change a filter, then save it as a view.</div></div>`;
    else if (dirty) h += `<div class="pg"><button class="pr" data-act="save-new">${I("plus")}<span class="pl"><span>Save as new view</span></span></button></div>`;
    return h + list;
  }

  function viewSummary(q: Query) {
    const rows: [string, string, string][] = [];
    if (q.search.trim()) rows.push(["search", "Search", `“${q.search.trim()}”${q.mode === "smart" ? " · Smart" : ""}`]);
    rows.push(["status", "Status", q.status.length ? q.status.join(", ") : "Any"]);
    if (q.brand) rows.push(["store", "Only", "Brand mentions"]);
    CATS.forEach((c) => {
      if (q.f[c.k]?.length) rows.push([c.icon, c.label, q.f[c.k].join(", ")]);
    });
    if (!q.brand && !CATS.some((c) => q.f[c.k]?.length)) rows.push(["sliders", "Filters", "None"]);
    rows.push(["sort", "Sort", q.sort]);
    return `<div class="vsum">${rows.map((r) => `<div>${I(r[0])}<em>${r[1]}</em><span>${esc(r[2])}</span></div>`).join("")}</div>`;
  }

  function subMenu() {
    const x = view(S.sub);
    if (!x) return "";
    return `<div class="pop sub" data-pop role="menu" aria-label="${esc(x.name)} options"><div class="pg">${viewSummary(x.q)}</div><div class="pg">${S.active === x.id && isDirty() ? `<button class="pr" data-act="update">${I("refresh")}<span class="pl"><span>Update view</span></span></button><button class="pr" data-act="reset">${I("close")}<span class="pl"><span>Discard changes</span></span></button></div><div class="pg">` : ""}
  <button class="pr" data-act="rename" data-id="${x.id}">${I("pen")}<span class="pl"><span>Rename</span></span></button>
  <button class="pr" data-act="dup" data-id="${x.id}">${I("copy")}<span class="pl"><span>Duplicate</span></span></button>
  <button class="pr" data-act="vis" data-id="${x.id}">${I(x.vis === "me" ? "users" : "lock")}<span class="pl"><span>${x.vis === "me" ? "Share with team" : "Make private"}</span></span></button></div>
  <div class="pg"><button class="pr danger" data-act="delv" data-id="${x.id}">${I("trash")}<span class="pl"><span>Delete view</span></span></button></div></div>`;
  }

  function placeSub() {
    const host = layer.querySelector<HTMLElement>(".sv-subpop")!;
    host.innerHTML = "";
    if (!S.sub || !S.open) return;
    const row = root.querySelector(`.vline[data-vid="${S.sub}"]`);
    if (!row) {
      S.sub = null;
      return;
    }
    host.innerHTML = subMenu();
    const el = host.firstElementChild as HTMLElement;
    const pop = row.closest(".pop")!.getBoundingClientRect(), r = row.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
    let left = pop.right + 6;
    if (left + w > innerWidth - 8) left = Math.max(8, pop.left - w - 6);
    let top = Math.min(r.top - 6, innerHeight - h - 8);
    top = Math.max(8, top);
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  const avatar = (x: Avatar) =>
    typeof x === "string" ? `<span class="p-av">${img(x, 14, 14, "")}</span>` : `<span class="p-av" style="background:${x[1]}">${x[0]}</span>`;
  const statIcons = ["st-plays.svg", "st-likes.svg", "st-comments.svg"];

  function card(c: Card) {
    const tags = (c.tags || []).map((t) => (t === "positive" ? '<span class="p-tag pos">☺️ Positive</span>' : '<span class="p-tag men">💬 2 mentions</span>')).join("");
    const corner = c.video
      ? `<span class="p-corner">${["ic-link.svg", "ic-open.svg"].map((n) => `<span class="p-glass">${img(n, 12)}</span>`).join("")}</span>`
      : c.icons ? `<span class="p-corner">${c.icons.map((n) => img(n, 17)).join("")}</span>` : "";
    const foot = c.video
      ? `<span class="p-ai-btn"><span class="p-mask" style="--m:url('${A("c2-ai-mask.svg")}')">${img("c2-ai.svg", 14, 14, "")}</span></span>
        <div class="p-vc"><span class="p-vc-bar"><i></i></span><span class="p-vc-g">${img("vc-pause.svg", 16)}${img("vc-back.svg", 16)}${img("vc-fwd.svg", 16)}</span><span class="p-vc-t">00:00 / 01:11</span><span class="p-vc-g">${img("vc-mute.svg", 16)}<span class="p-vc-rate">1x${img("vc-caret.svg", 10)}</span>${img("vc-full.svg", 16)}</span></div>`
      : `<div class="p-foot"><span class="p-who"><span class="p-avs">${(c.people || []).map(avatar).join("")}</span><b>${esc(c.who)}</b></span><span class="p-reach">•${img("ic-reach.svg", 12)}${esc(c.reach)}</span><span class="p-date">Nov 12 2026</span></div>`;
    const stats = c.st.map((v, i) => `<span>${img(i < 3 ? statIcons[i] : c.eng === "eye" ? "st-eng.svg" : "st-eng-person.svg", 16)}${v}</span>`).join("");
    return `<article class="p-card"><h3>${esc(c.t)}</h3><p>${esc(c.p)}</p>
      <div class="p-media ${c.carousel ? "carousel" : ""}" style="height:${c.h}px"><img class="p-media-img" src="${A(c.media)}" alt="" loading="lazy">${tags ? `<span class="p-tags">${tags}</span>` : ""}${corner}${foot}</div>
      <div class="p-stats">${stats}</div>
      <div class="p-status">Not started${img("status-chev.svg", 16)}</div></article>`;
  }

  function cards() {
    const n = count();
    if (!n) return `<div class="p-empty">No posts here yet. Posts you mark as reviewed show up in this tab.</div>`;
    return `<div class="p-cards">${CARDS.slice(0, Math.min(CARDS.length, n)).map(card).join("")}</div>`;
  }

  /* Text field from the Plot design system: 38px, radius 9, clear × when filled, error line below. */
  const nameField = (value: string, err?: boolean) => `<div class="fld"><label for="vname">Name</label>
    <div class="inp ${err ? "err" : ""}"><input id="vname" maxlength="48" value="${esc(value)}" placeholder="Add a name" autocomplete="off" aria-invalid="${!!err}" ${err ? 'aria-describedby="vname-err"' : ""}><button type="button" class="clr" aria-label="Clear name" data-act="clr-name" ${value ? "" : "hidden"}>${I("close")}</button></div>
    ${err ? `<span class="inl st-danger" id="vname-err">${I("alert")}Add a name for this view.</span>` : ""}</div>`;

  function modal() {
    const m = S.modal;
    if (!m) return "";
    if (m.type === "rename")
      return `<div class="scrim" data-act="close-modal-bg"><form class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT" data-form="rename" novalidate>
    <div class="hd"><h2 id="dlgT">Rename view</h2><button type="button" class="icon-btn" aria-label="Close" data-act="close-modal">${I("close")}</button></div>
    ${nameField(m.err ? "" : view(m.id)!.name, m.err)}
    <div class="dacts"><button type="button" class="btn-soft" data-act="close-modal">Cancel</button><button class="btn-dark" id="vsave">Save</button></div></form></div>`;
    // What gets saved, stacked as plain rows in Small body. Hovering a row shows × to leave that filter out of the view.
    const q = m.q, chipFor = (ic: string, k: string, v: string, key?: string) =>
      `<li class="srow">${I(ic)}<span class="sk">${k}</span><span class="sv-v">${esc(v)}</span>${key ? `<button type="button" class="sx" aria-label="Remove ${esc(k)} from this view" data-act="rmsum" data-k="${key}">${I("close")}</button>` : ""}</li>`;
    const items = [chipFor("spark", "Topic", "Airbnb’s Brand Mention")];
    if (q.search.trim()) items.push(chipFor("search", "Search", `“${q.search.trim()}”${q.mode === "smart" ? " · Smart" : ""}`, "search"));
    if (q.status.length) items.push(chipFor("status", "Status", q.status.join(", "), "status"));
    if (q.brand) items.push(chipFor("store", "Only", "brand mentions", "brand"));
    CATS.forEach((c) => {
      if (q.f[c.k]?.length) items.push(chipFor(c.icon, c.label, q.f[c.k].join(", "), c.k));
    });
    if (q.date) items.push(chipFor("calendar", "Date", DATE_RANGE, "date"));
    items.push(chipFor("sort", "Sort", q.sort));
    return `<div class="scrim" data-act="close-modal-bg"><form class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT" data-form="save" novalidate>
    <div class="hd"><h2 id="dlgT">Save view</h2><button type="button" class="icon-btn" aria-label="Close" data-act="close-modal">${I("close")}</button></div>
    <ul class="slist" aria-label="Saved with this view">${items.join("")}</ul>
    ${nameField(m.name, m.err)}
    <div class="fld"><span class="flabel" id="visL">Who can see it</span><div class="seg sm" role="radiogroup" aria-labelledby="visL"><button type="button" role="radio" aria-checked="${m.vis === "me"}" class="${m.vis === "me" ? "on" : ""}" data-act="vis-pick" data-v="me">${I("lock")}Only me</button><button type="button" role="radio" aria-checked="${m.vis === "team"}" class="${m.vis === "team" ? "on" : ""}" data-act="vis-pick" data-v="team">${I("users")}Everyone at Airbnb</button></div>
    <span class="help">${m.vis === "me" ? "Only you will see this view." : "Everyone with access to this brand sees it."}</span></div>
    <div class="dacts"><button type="button" class="btn-soft" data-act="close-modal">Cancel</button><button class="btn-dark" id="vsave">Save view</button></div></form></div>`;
  }

  function render() {
    const v = S.variant;
    const sc = $(".fmenu-scroll")?.scrollTop;
    // overlays sit outside the stage, so mirror the dock's font choice onto them
    layer.style.fontFamily = getComputedStyle(root).fontFamily;
    root.querySelectorAll<HTMLButtonElement>(".vseg button").forEach((b) => {
      b.classList.toggle("on", b.dataset.v === v);
      b.setAttribute("aria-pressed", String(b.dataset.v === v));
    });
    $(".pbody")!.innerHTML = `
    <div class="p-row">${tabs()}${toolbar()}</div>
    <div class="p-topic"><button class="p-topic-t">Airbnb's Brand Mention${img("topic-chev.svg", 24)}</button><div class="p-topic-m"><span class="p-beta">Beta</span><span class="p-smart">${img("topic-smart.svg", 18)}Smart assignment <small>Off</small></span></div></div>
    <div class="p-untag"><span class="p-untag-l"><span class="p-spark"><span class="p-mask" style="--m:url('${A("spark-mask.svg")}')">${img("spark.svg", 16, 16, "")}</span></span><span class="p-untag-h"><b>140</b> of 1.04K brand mentions were untagged</span><span>- Plot captured 13% you'd otherwise miss</span></span><b class="p-untag-r">13%</b></div>
    <div class="p-search"><label class="p-inp" for="q">${img("search.svg", 22, 24)}<input id="q" placeholder="Search keywords like &quot;sneakers&quot;, &quot;#haul&quot;, or &quot;10k views&quot;" value="${esc(S.q.search)}" autocomplete="off"><button class="p-go" aria-label="Search" data-act="search">${img("search-go.svg", 36)}</button></label>
      <div class="p-search-r"><div class="p-mode"><button class="${S.q.mode === "regular" ? "on" : ""}" data-act="mode" data-v="regular">Regular search</button><button class="${S.q.mode === "smart" ? "on" : ""}" data-act="mode" data-v="smart">Smart search</button></div><button class="p-btn"><span class="p-tile">${img("plus.svg", 16)}</span>Add post</button><button class="p-btn"><span class="p-tile">${img("export.svg", 16)}</span>Export</button></div></div>
    ${chips()}
    ${cards()}`;
    layer.querySelector(".sv-modal")!.innerHTML = modal();
    layer.querySelector(".sv-toast")!.innerHTML = S.toast ? `<div class="toast" role="status">${I("check")}<span>${esc(S.toast.msg)}</span>${S.toast.undo ? '<button data-act="undo">Undo</button>' : ""}</div>` : "";
    const scroller = $(".fmenu-scroll");
    if (sc != null && scroller) scroller.scrollTop = sc;
    if (S.modal && !S.modal.focused) {
      S.modal.focused = true;
      const i = $<HTMLInputElement>("#vname");
      if (i) {
        i.focus();
        i.select();
      }
    }
    if (!S.open) S.sub = null;
    placeSub();
    S.newId = null;
  }

  let tt: ReturnType<typeof setTimeout> | undefined;
  function toast(msg: string, undo?: Snapshot) {
    S.toast = { msg, undo };
    clearTimeout(tt);
    tt = setTimeout(() => {
      S.toast = null;
      render();
    }, undo ? 8000 : 4000);
  }
  const snapshot = (): Snapshot => clone({ views: S.views, active: S.active, q: S.q });

  function act(a: string, d: DOMStringMap) {
    const keep = d.keep === "1";
    switch (a) {
      case "go": S.active = d.id!; S.q = clone(base()); if (!keep) S.open = null; break;
      case "brand": S.q.brand = !S.q.brand; break;
      case "exp": S.exp = S.exp === d.k ? null : d.k!; break;
      case "togf": {
        const arr = (S.q.f[d.k!] = S.q.f[d.k!] || []);
        const i = arr.indexOf(d.v!);
        if (i < 0) arr.push(d.v!);
        else arr.splice(i, 1);
        if (!arr.length) delete S.q.f[d.k!];
        break;
      }
      case "togs": {
        const i = S.q.status.indexOf(d.v!);
        if (i < 0) S.q.status.push(d.v!);
        else S.q.status.splice(i, 1);
        break;
      }
      case "clearflt": S.q.brand = false; S.q.f = {}; break;
      case "rmchip":
        if (d.k === "status") S.q.status = [];
        else if (d.k === "brand") S.q.brand = false;
        else if (d.k === "date") S.q.date = false;
        else delete S.q.f[d.k!];
        break;
      case "reset": S.sub = null; S.q = clone(base()); if (!keep) S.open = null; break;
      case "sort": S.q.sort = d.v!; S.open = null; break;
      case "mode": S.q.mode = d.v as Query["mode"]; break;
      case "search": S.q.search = $<HTMLInputElement>("#q")!.value; break;
      case "save-new": S.open = null; S.modal = { type: "save", name: suggest(), vis: "me", q: clone(S.q) }; break;
      case "rmsum": {
        if (S.modal?.type !== "save") break;
        const n = $<HTMLInputElement>("#vname")?.value;
        if (n != null) S.modal.name = n;
        const q = S.modal.q;
        if (d.k === "search") q.search = "";
        else if (d.k === "status") q.status = [];
        else if (d.k === "brand") q.brand = false;
        else if (d.k === "date") q.date = false;
        else delete q.f[d.k!];
        S.modal.focused = true;
        break;
      }
      case "clr-name": {
        const i = $<HTMLInputElement>("#vname");
        if (i) { i.value = ""; i.focus(); syncClear(i); }
        return;
      }
      case "vis-pick": {
        if (S.modal?.type !== "save") break;
        const n = $<HTMLInputElement>("#vname")?.value;
        S.modal.vis = d.v as Vis;
        if (n != null) S.modal.name = n;
        S.modal.focused = true;
        break;
      }
      case "update": {
        S.sub = null;
        const sv = view(S.active)!, snap = snapshot();
        sv.q = clone(S.q);
        S.open = null;
        toast(`Updated “${sv.name}”`, snap);
        break;
      }
      case "sub": S.sub = S.sub === d.id ? null : d.id!; break;
      case "rename": S.open = null; S.sub = null; S.modal = { type: "rename", id: d.id || S.active }; break;
      case "dup": {
        S.sub = null;
        const sv = view(d.id || S.active)!, id = "v" + Date.now();
        S.views.push({ id, name: sv.name + " copy", vis: "me", q: clone(sv.q) });
        S.active = id;
        S.newId = id;
        S.open = null;
        toast(`Duplicated as “${sv.name} copy”`);
        break;
      }
      case "vis": {
        const sv = view(d.id || S.active)!;
        sv.vis = sv.vis === "me" ? "team" : "me";
        S.open = null;
        toast(sv.vis === "me" ? `“${sv.name}” is now private` : `“${sv.name}” is shared with the team`);
        break;
      }
      case "delv": {
        S.sub = null;
        const x = view(d.id!)!, snap = snapshot();
        S.views = S.views.filter((v) => v.id !== x.id);
        if (S.active === x.id) {
          S.active = "all";
          S.q = clone(BLANK);
        }
        toast(`Deleted “${x.name}”`, snap);
        break;
      }
      case "undo": Object.assign(S, S.toast!.undo); S.toast = null; clearTimeout(tt); break;
      case "close-modal": S.modal = null; break;
    }
    render();
  }

  /* Show the clear × only when the field has text; typing also clears an error. */
  function syncClear(i: HTMLInputElement) {
    i.parentElement?.querySelector<HTMLElement>(".clr")?.toggleAttribute("hidden", !i.value);
    if (i.value && S.modal?.err) {
      S.modal.err = false;
      i.parentElement?.classList.remove("err");
      i.removeAttribute("aria-describedby");
      i.setAttribute("aria-invalid", "false");
      i.closest(".fld")?.querySelector(".inl")?.remove();
    }
  }
  const onInput = (e: Event) => {
    const t = e.target as HTMLInputElement;
    if (t.id === "vname" && inUI(t)) syncClear(t);
  };
  // Design system rule: the blue focus ring shows only when focus arrives from the keyboard.
  let keyboard = false;
  const onKeyMode = (e: KeyboardEvent) => { if (e.key === "Tab") keyboard = true; };
  const onPointer = () => { keyboard = false; };
  const onFocusIn = (e: FocusEvent) => {
    const t = e.target as HTMLElement;
    if (!inUI(t)) return;
    t.closest(".inp")?.classList.toggle("kb", keyboard);
  };

  function submit(form: HTMLFormElement) {
    const input = $<HTMLInputElement>("#vname")!;
    const name = input.value.trim();
    if (!name) {
      if (S.modal) {
        if (S.modal.type === "save") S.modal.name = "";
        S.modal.err = true;
        render();
        $<HTMLInputElement>("#vname")?.focus();
      }
      return;
    }
    if (form.dataset.form === "rename" && S.modal?.type === "rename") {
      view(S.modal.id)!.name = name;
      S.modal = null;
      toast(`Renamed to “${name}”`);
    } else if (S.modal?.type === "save") {
      const snap = snapshot(), id = "v" + Date.now();
      S.q = clone(S.modal.q);
      S.views.push({ id, name, vis: S.modal.vis, q: clone(S.q) });
      S.active = id;
      S.newId = id;
      S.modal = null;
      toast(`Saved “${name}”`, snap);
    }
    render();
  }

  const onClick = (e: MouseEvent) => {
    const target = e.target as Element;
    if (!(target instanceof Element)) return;
    const vb = inUI(target) ? target.closest<HTMLButtonElement>(".vseg button") : null;
    if (vb) {
      S = fresh(vb.dataset.v as VariantId);
      try {
        localStorage.setItem(VARIANT_KEY, vb.dataset.v!);
      } catch {
        // storage unavailable
      }
      render();
      return;
    }
    if (inUI(target) && target.closest(".rv-reset")) {
      S = fresh(S.variant);
      render();
      return;
    }
    const o = inUI(target) ? target.closest<HTMLElement>("[data-open]") : null;
    if (o) {
      e.preventDefault();
      const id = o.dataset.open!;
      S.open = S.open === id ? null : id;
      S.sub = null;
      render();
      return;
    }
    const t = inUI(target) ? target.closest<HTMLElement>("[data-act]") : null;
    if (t) {
      if (t.dataset.act === "close-modal-bg") {
        if (target === t) act("close-modal", {});
        return;
      }
      if (t instanceof HTMLButtonElement && t.disabled) return;
      e.preventDefault();
      act(t.dataset.act!, t.dataset);
      return;
    }
    if (S.open && !target.closest("[data-pop]")) {
      S.open = null;
      render();
    }
  };
  const onSubmit = (e: SubmitEvent) => {
    if (!inUI(e.target)) return;
    e.preventDefault();
    submit(e.target as HTMLFormElement);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (S.sub) { S.sub = null; render(); }
      else if (S.modal) { S.modal = null; render(); }
      else if (S.open) { S.open = null; render(); }
    }
    const el = e.target as HTMLInputElement;
    if (e.key === "Enter" && el.id === "q" && inUI(el)) {
      e.preventDefault();
      S.q.search = el.value;
      render();
      $<HTMLInputElement>("#q")!.focus();
    }
  };

  /* hover opens a view's options flyout (click on › still works for touch / keyboard) */
  let subT: ReturnType<typeof setTimeout> | undefined;
  const canHover = matchMedia("(hover: hover)").matches;
  function setSub(id: string | null) {
    if (S.sub === id) return;
    S.sub = id;
    root.querySelectorAll<HTMLElement>(".vmore").forEach((b) => {
      const on = b.dataset.id === id;
      b.classList.toggle("on", on);
      b.setAttribute("aria-expanded", String(on));
    });
    placeSub();
  }
  const onOver = (e: MouseEvent) => {
    if (!canHover || !S.open || !(e.target instanceof Element)) return;
    const line = e.target.closest<HTMLElement>(".vline"), inSub = e.target.closest(".pop.sub");
    if (line) { clearTimeout(subT); setSub(line.dataset.vid!); return; }
    if (inSub) { clearTimeout(subT); return; }
    if (S.sub) { clearTimeout(subT); subT = setTimeout(() => setSub(null), 220); }
  };

  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);
  document.addEventListener("keydown", onKey);
  document.addEventListener("mouseover", onOver);
  document.addEventListener("input", onInput);
  document.addEventListener("keydown", onKeyMode, true);
  document.addEventListener("pointerdown", onPointer, true);
  document.addEventListener("focusin", onFocusIn);
  render();

  return () => {
    document.removeEventListener("click", onClick);
    document.removeEventListener("submit", onSubmit);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("mouseover", onOver);
    document.removeEventListener("input", onInput);
    document.removeEventListener("keydown", onKeyMode, true);
    document.removeEventListener("pointerdown", onPointer, true);
    document.removeEventListener("focusin", onFocusIn);
    clearTimeout(tt);
    clearTimeout(subT);
  };
}

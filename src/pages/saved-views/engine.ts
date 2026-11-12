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
};
type Vis = "me" | "team";
type SavedView = { id: string; name: string; vis: Vis; q: Query };
type VariantId = "A" | "B";
type Snapshot = { views: SavedView[]; active: string; q: Query };
type Modal =
  | { type: "rename"; id: string; focused?: boolean }
  | { type: "save"; name: string; vis: Vis; focused?: boolean };
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
  { id: "all", name: "All Posts", icon: "box" },
  { id: "reviewed", name: "Reviewed (7)", icon: "eye" },
  { id: "labelled", name: "Labelled", icon: "tag" },
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
const START = (): Query => ({ brand: false, status: ["Not started"], f: { platform: ["Instagram", "TikTok"], followers: ["Micro (10K–100K)"], labels: ["Holiday Brief"] }, sort: "Newest", search: "", mode: "regular" });
const fresh = (v?: VariantId): State => ({ variant: v || "A", views: seedViews(), active: "all", q: START(), open: null, exp: "platform", modal: null, toast: null, newId: null, sub: null });

const VARIANT_KEY = "sv-variant2";

const CARDS = [
  { t: "Micro Influencer, Brand Mention", p: "A creator shares an unboxing of a handmade ceramic cup from an Airbnb Experiences pottery workshop.", s: "Positive", c1: "#E3D3C1", c2: "#66513E", who: "@airbnbexperiences", st: ["2.3K", "36", "0", "2.2%"] },
  { t: "Brand Mention", p: "A golden retriever swims in a pool at an Airbnb rental, highlighting a pet-friendly stay.", s: "Positive", c1: "#BFD7FE", c2: "#495475", who: "@goldie.travels", st: ["1.8K", "8", "0", "0.6%"] },
  { t: "Brand Safety, Social Queries", p: "A host in Puerto Rico warns investors about hidden expenses like pool maintenance and housekeeping.", s: "Negative", m: 22, c1: "#DCAFC0", c2: "#510C22", who: "@robertogreenjr", st: ["967", "32", "14", "5.8%"] },
  { t: "Brand Mention", p: "Casa Doon Pop promotes a spacious 3 BHK Airbnb in Dehradun with mountain views.", s: "Positive", m: 2, c1: "#CDB7BF", c2: "#39242D", who: "@casadoonpop", st: ["46", "0", "0", "0%"] },
];

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
  const fCount = () => (S.q.brand ? 1 : 0) + CATS.reduce((n, c) => n + (S.q.f[c.k]?.length || 0), 0);
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
    let n = ({ all: 1243, reviewed: 7, labelled: 388 } as Record<string, number>)[S.active] ?? 1243;
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
    let h = '<div class="seg" role="tablist" aria-label="Views">';
    PRESETS.forEach((p) => (h += `<button role="tab" aria-selected="${S.active === p.id}" class="${S.active === p.id ? "on" : ""}" data-act="go" data-id="${p.id}">${I(p.icon)}${p.name}</button>`));
    return h + "</div>";
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
    if (fCount()) h += `<div class="fs-head"><span>${fCount()} selected</span><button class="lnk" data-act="clearflt" data-keep="1">Clear all</button></div>`;
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
    const v = S.variant, nf = fCount(), dirty = isDirty(), sv = view(S.active);
    let h = '<div class="row tbrow">';
    if (v === "B") {
      h += `<div class="rel"><div class="sbtn"><button ${dirty && !sv ? 'data-act="save-new"' : 'data-open="splitm"'} title="${sv ? esc(sv.name) : dirty ? "Save these filters as a view" : "Saved views"}">${I("bookmark")}<span class="tb-label">${sv ? esc(sv.name) : "Save view"}</span>${sv && dirty ? '<span class="edited">Edited</span>' : ""}</button><button aria-label="More save options" data-open="splitm">${I("chev")}</button></div>${menu("splitm", splitMenu(sv, dirty), "right wide")}</div>`;
    }
    h += `<div class="rel tb"><button class="btn-soft sm trail tbb" data-open="status"><span class="tbi">${I("status")}</span>Status${I("chev")}</button>${S.q.status.length ? `<span class="badge">${S.q.status.length}</span>` : ""}${menu("status", `<div class="pg"><div class="ph">Status</div>${STATUSES.map((x) => `<button class="fopt ${S.q.status.includes(x) ? "on" : ""}" data-act="togs" data-v="${x}" data-keep="1"><span class="pcb">${I("check")}</span><span class="fl1">${x}</span></button>`).join("")}</div>`, "right")}</div>`;
    const flabel = v === "A" && sv ? esc(sv.name) + (dirty ? ' <span class="fn">· Edited</span>' : "") : "Filter";
    h += `<div class="rel tb"><button class="btn-soft sm trail tbb" data-open="filter"><span class="tbi">${I(v === "A" && sv ? "bookmark" : "sliders")}</span><span class="tb-label">${flabel}</span>${I("chev")}</button>${nf ? `<span class="badge">${nf}</span>` : ""}${menu("filter", filterMenu(), "right fmenu")}</div>`;
    h += `<div class="rel tb"><button class="btn-soft sm trail tbb" data-open="sort"><span class="tbi">${I("sort")}</span>Sort by${I("chev")}</button>${menu("sort", `<div class="pg"><div class="ph">Sort by</div>${SORTS.map((x) => `<button class="pr ${S.q.sort === x ? "on" : ""}" data-act="sort" data-v="${x}"><span class="pl"><span>${x}</span></span>${S.q.sort === x ? tick() : ""}</button>`).join("")}</div>`, "right")}</div>`;
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

  function cards() {
    const n = count();
    return `<div class="rhead"><span>Showing <b>${n.toLocaleString()}</b> posts</span><span>${S.q.sort}</span></div><div class="cards">${CARDS.slice(0, Math.min(4, n)).map((c) => `<article class="card"><h4>${c.t}</h4><p>${c.p}</p><div class="thumb" style="--c1:${c.c1};--c2:${c.c2}"><div class="tags"><span class="chip ${c.s === "Positive" ? "g" : "r"}">${I("smile", 12)}${c.s}</span>${c.m ? `<span class="chip t">${I("msg", 12)}${c.m} mentions</span>` : ""}</div><div class="who"><span>${c.who}</span><span>Nov 09</span></div></div><div class="stats">${c.st.map((x) => `<span>${x}</span>`).join("")}</div><span class="status">${S.q.status[0] || "Not started"}</span></article>`).join("")}</div>`;
  }

  function modal() {
    const m = S.modal;
    if (!m) return "";
    if (m.type === "rename")
      return `<div class="scrim" data-act="close-modal-bg"><form class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT" data-form="rename">
    <div class="hd"><div><h3 id="dlgT">Rename view</h3></div><button type="button" class="icon-btn" aria-label="Close" data-act="close-modal">${I("close")}</button></div>
    <div class="fld"><label class="fl" for="vname">Name</label><input id="vname" class="inpx" maxlength="48" value="${esc(view(m.id)!.name)}" autocomplete="off"></div>
    <div class="dacts"><button type="button" class="btn-soft" data-act="close-modal">Cancel</button><button class="btn-dark" id="vsave">Save</button></div></form></div>`;
    const q = S.q, row = (ic: string, k: string, v: string) => `<span class="lchip">${I(ic)}<span><em>${k}</em> ${esc(v)}</span></span>`;
    const items = [row("spark", "Topic", "Airbnb’s Brand Mention")];
    if (q.search.trim()) items.push(row("search", "Search", `“${q.search.trim()}”${q.mode === "smart" ? " · Smart" : ""}`));
    if (q.status.length) items.push(row("status", "Status", q.status.join(", ")));
    if (q.brand) items.push(row("store", "Only", "brand mentions"));
    CATS.forEach((c) => {
      if (q.f[c.k]?.length) items.push(row(c.icon, c.label, q.f[c.k].join(", ")));
    });
    items.push(row("sort", "Sort", q.sort));
    const where = { A: "the Filter menu", B: "Saved views" }[S.variant];
    return `<div class="scrim" data-act="close-modal-bg"><form class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT" data-form="save">
    <div class="hd"><div><h3 id="dlgT">Save view</h3><p class="sub">Open these posts again in one click from ${where}.</p></div><button type="button" class="icon-btn" aria-label="Close" data-act="close-modal">${I("close")}</button></div>
    <div class="sum"><div class="lbl">What’s saved</div><div class="list">${items.join("")}</div></div>
    <div class="fld"><label class="fl" for="vname">Name</label><input id="vname" class="inpx" maxlength="48" value="${esc(m.name)}" autocomplete="off"></div>
    <div class="fld"><span class="fl" id="visL">Who can see it</span><div class="seg sm" role="radiogroup" aria-labelledby="visL" style="justify-self:start"><button type="button" role="radio" aria-checked="${m.vis === "me"}" class="${m.vis === "me" ? "on" : ""}" data-act="vis-pick" data-v="me">${I("lock")}Only me</button><button type="button" role="radio" aria-checked="${m.vis === "team"}" class="${m.vis === "team" ? "on" : ""}" data-act="vis-pick" data-v="team">${I("users")}Everyone at Airbnb</button></div>
    <p class="hint">${m.vis === "me" ? "Only you will see this view." : "Everyone with access to this brand sees it."}</p></div>
    <div class="dacts"><button type="button" class="btn-soft" data-act="close-modal">Cancel</button><button class="btn-dark" id="vsave">Save view</button></div></form></div>`;
  }

  function render() {
    const v = S.variant, V = VARIANTS[v];
    const sc = $(".fmenu-scroll")?.scrollTop;
    // overlays sit outside the stage, so mirror the dock's font choice onto them
    layer.style.fontFamily = getComputedStyle(root).fontFamily;
    root.querySelectorAll<HTMLButtonElement>(".vseg button").forEach((b) => {
      b.classList.toggle("on", b.dataset.v === v);
      b.setAttribute("aria-pressed", String(b.dataset.v === v));
    });
    $(".sv-notes")!.innerHTML = `<div><div class="k">Variant ${v} · ${V.name}</div><div class="v">${V.save}</div></div><div><div class="k">Where views live</div><div class="v">${V.views}</div></div><div><div class="k">Editing a saved view</div><div class="v">${V.edit}</div></div><div><div class="k">Pattern source · Mobbin</div><div class="v">${V.refs.map((r) => `<a href="${r[1]}" target="_blank" rel="noopener">${r[0]}</a>`).join(", ")}<span class="pro">${V.tradeoff}</span></div></div>`;
    $(".pbody")!.innerHTML = `
    <div class="row between"><div class="row">${tabs()}</div>${toolbar()}</div>
    <div class="topic"><h3>Airbnb’s Brand Mention ${I("chev")}</h3><div class="meta"><span class="beta">Beta</span><span>${I("refresh")}Smart assignment <small>Off</small></span></div></div>
    <div class="untag"><span>${I("spark", 14).replace("<svg", '<svg style="display:inline;vertical-align:-2px;color:var(--maroon-900)"')} <b>144 of 1.2K brand mentions were untagged</b> · Plot captured 12% you’d otherwise miss</span><span class="pct">12%</span></div>
    <div class="searchrow"><label class="inp" for="q">${I("search")}<input id="q" placeholder="Search keywords like “sneakers”, “#haul”, or “10k views”" value="${esc(S.q.search)}" autocomplete="off"><button class="go" aria-label="Search" data-act="search">${I("up")}</button></label>
      <div class="rest"><div class="seg"><button class="${S.q.mode === "regular" ? "on" : ""}" data-act="mode" data-v="regular">Regular search</button><button class="${S.q.mode === "smart" ? "on" : ""}" data-act="mode" data-v="smart">Smart search</button></div><button class="btn-soft">${I("plus")}Add post</button><button class="btn-soft">${I("export")}Export</button></div></div>
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
      case "reset": S.sub = null; S.q = clone(base()); if (!keep) S.open = null; break;
      case "sort": S.q.sort = d.v!; S.open = null; break;
      case "mode": S.q.mode = d.v as Query["mode"]; break;
      case "search": S.q.search = $<HTMLInputElement>("#q")!.value; break;
      case "save-new": S.open = null; S.modal = { type: "save", name: suggest(), vis: "me" }; break;
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

  function submit(form: HTMLFormElement) {
    const input = $<HTMLInputElement>("#vname")!;
    const name = input.value.trim();
    if (!name) {
      input.focus();
      input.style.boxShadow = "inset 0 0 0 1px #C93B3B";
      return;
    }
    if (form.dataset.form === "rename" && S.modal?.type === "rename") {
      view(S.modal.id)!.name = name;
      S.modal = null;
      toast(`Renamed to “${name}”`);
    } else if (S.modal?.type === "save") {
      const snap = snapshot(), id = "v" + Date.now();
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
  render();

  return () => {
    document.removeEventListener("click", onClick);
    document.removeEventListener("submit", onSubmit);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("mouseover", onOver);
    clearTimeout(tt);
    clearTimeout(subT);
  };
}

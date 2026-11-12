import { useEffect, useRef, useState, type ReactNode } from "react";
import { asset } from "../../asset";
import { mountSavedViews } from "./engine";
import "./saved-views.css";

/* Layout and copy match the production Engagement page (Figma: Community Hub V2, node 477:5526). */

const a = (name: string) => asset(`/figma/saved-views/${name}`);

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  return <img className="p-ic" src={a(name)} alt="" width={size} height={size} />;
}

function NavLink({ icon, label, on = false, badge }: { icon: string; label: string; on?: boolean; badge?: ReactNode }) {
  return (
    <a className={on ? "p-nav is-on" : "p-nav"} href="#saved-views" title={label} onClick={(e) => e.preventDefault()}>
      <Icon name={icon} />
      <span className="p-nav-l">{label}</span>
      {badge}
    </a>
  );
}

const Pill = ({ tone, children }: { tone: "new" | "beta"; children: ReactNode }) => <span className={`p-pill ${tone}`}>{children}</span>;

function Bookmark({ title, brand, img }: { title: string; brand: string; img: string }) {
  return (
    <div className="p-bm">
      <Icon name="sb-bookmark-item.svg" />
      <div className="p-bm-t">
        <span>{title}</span>
        <small>
          <img src={a(img)} alt="" width={15} height={15} />· {brand}
        </small>
      </div>
    </div>
  );
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside className="p-side" aria-label="Workspace" id="p-side">
      <div className="p-side-scroll">
        <div className="p-brand">
          <span className="p-brand-pick">
            <img src={a("sb-brand.png")} alt="" width={24} height={24} />
            <span>Airbnb</span>
            <Icon name="sb-brand-chev.svg" size={14} />
          </span>
          <button
            type="button"
            className="p-collapse"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            aria-controls="p-side"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggle}
          >
            <Icon name="sb-collapse.svg" size={24} />
          </button>
        </div>
        <button type="button" className="p-create">
          Create
        </button>
        <NavLink icon="sb-notifications.svg" label="Notifications" badge={<span className="p-count">99+</span>} />
        <NavLink icon="sb-chat.svg" label="Chat" />
        <NavLink icon="sb-workflows.svg" label="Workflows" badge={<Pill tone="new">New</Pill>} />
        <hr className="p-rule" />
        <NavLink icon="sb-home.svg" label="Home" />
        <NavLink icon="sb-engagement.svg" label="Engagement" on />
        <div className="p-nav p-group">
          <Icon name="sb-brand-analytics.svg" />
          <span className="p-nav-l">Brand Analytics</span>
          <img className="p-ic p-up" src={a("sb-chev.svg")} alt="" width={16} height={16} />
        </div>
        {["Owned", "UGC", "Sentiment", "Topics"].map((label) => (
          <a key={label} className="p-nav p-sub" href="#saved-views" onClick={(e) => e.preventDefault()}>
            {label}
          </a>
        ))}
        <NavLink icon="sb-dashboards.svg" label="Dashboards" badge={<Pill tone="beta">Beta</Pill>} />
        <NavLink icon="sb-competitor.svg" label="Competitor Analytics" />
        <NavLink icon="sb-outbound.svg" label="Outbound" />
        <NavLink icon="sb-community.svg" label="Community Hub" />
        <NavLink icon="sb-creator.svg" label="Creator Intelligence" badge={<Pill tone="beta">Beta</Pill>} />
        <NavLink icon="sb-report.svg" label="Custom Report" />
        <hr className="p-rule" />
        <NavLink icon="sb-trends.svg" label="Trends" />
        <NavLink icon="sb-juicebox.svg" label="Creative Juicebox" badge={<Icon name="sb-juicebox-x.svg" />} />
        <NavLink icon="sb-research.svg" label="Deep Research" badge={<Pill tone="beta">Beta</Pill>} />
        <hr className="p-rule" />
        <div className="p-nav p-group">
          <Icon name="sb-bookmarks.svg" />
          <span className="p-nav-l">Bookmarks</span>
          <img className="p-ic p-up" src={a("sb-chev.svg")} alt="" width={16} height={16} />
        </div>
        <Bookmark title="Outbound" brand="Benefit Cosmetics" img="sb-bm1.jpg" />
        <Bookmark title="Engagement" brand="Youth to the People" img="sb-bm2.jpg" />
        <Bookmark title="Engagement" brand="Zoetis" img="sb-bm3.jpg" />
      </div>
      <div className="p-side-foot">
        <div className="p-acct">
          <img src={a("sb-cs.png")} alt="" width={16} height={16} />
          <div>
            <b>Customer Success</b>
            <small>success@plot.so</small>
            <span className="p-plan">Enterprise Plan</span>
          </div>
        </div>
        <hr className="p-rule flush" />
        <div className="p-settings">
          <span>
            <Icon name="sb-settings.svg" />
            Settings
          </span>
          <button type="button" aria-label="More">
            <Icon name="sb-more.svg" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="p-top">
      <nav className="p-crumbs" aria-label="Breadcrumb">
        <Icon name="top-back.svg" size={20} />
        <span className="p-crumb muted">Airbnb</span>
        <span className="p-crumb">/</span>
        <span className="p-crumb">Engagement</span>
      </nav>
      <div className="p-top-acts">
        <button type="button" className="p-invite">
          <Icon name="top-invite.svg" />
          Invite
        </button>
        <button type="button" className="p-more" aria-label="More">
          <Icon name="top-more.svg" size={24} />
        </button>
        <button type="button" className="p-ai" aria-label="Ask Plot AI">
          <img src={a("top-ai.svg")} alt="" width={19} height={16} />
        </button>
      </div>
    </header>
  );
}

/** Saved views on the production Engagement page: variant A (Filter menu) and variant B (Toolbar split button). */
export function SavedViews() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Modal, flyout and toast are position: fixed. The stage uses size containment, which would trap
    // fixed elements inside its scroll box, so they render into a layer on <body> instead.
    const layer = document.createElement("div");
    layer.className = "sv sv-layer";
    layer.innerHTML = '<div class="sv-modal"></div><div class="sv-subpop"></div><div class="sv-toast"></div>';
    document.body.appendChild(layer);
    const unmount = mountSavedViews(root, layer);
    return () => {
      unmount();
      layer.remove();
    };
  }, []);

  return (
    <div className={collapsed ? "sv is-collapsed" : "sv"} ref={rootRef}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="p-main">
        <TopBar />
        <div className="p-page">
          <div className="p-head">
            <h1>Engagement</h1>
            <button type="button" className="p-gear" aria-label="Settings">
              <Icon name="gear.svg" size={22} />
            </button>
          </div>
          <hr className="p-head-rule" />
          <div className="pbody" />
        </div>
        <div className="p-proto" role="group" aria-label="Prototype controls">
          <span>Prototype</span>
          <div className="vseg">
            <button type="button" data-v="A">
              <b>A</b>Filter menu
            </button>
            <button type="button" data-v="B">
              <b>B</b>Toolbar
            </button>
          </div>
          <button type="button" className="rv-reset">
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}

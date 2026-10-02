import type { ReactNode } from "react";
import { asset } from "./asset";
import { IconBack, IconChevron, IconMenu, IconMore } from "./icons";

export function TopBar({
  crumbs,
  action,
}: {
  crumbs: { label: string; current?: boolean }[];
  action: string;
}) {
  return (
    <header className="topbar">
      <div className="crumbs">
        <button className="icon-btn" type="button" aria-label="Open menu">
          <IconMenu />
        </button>
        <button className="icon-btn" type="button" aria-label="Back">
          <IconBack />
        </button>
        {crumbs.map((crumb, index) => (
          <span key={crumb.label} className="crumb-pair">
            {index > 0 ? <span className="slash demi">/</span> : null}
            <span className={crumb.current ? "crumb demi" : "crumb demi muted"}>{crumb.label}</span>
          </span>
        ))}
      </div>
      <div className="top-actions">
        <span className="avatars" aria-hidden="true">
          <img src={asset("/media/avatar-a.png")} alt="" />
          <img src={asset("/media/avatar-b.png")} alt="" />
          <span className="num">+8</span>
        </span>
        <button className="solid" type="button">
          {action}
        </button>
        <button className="icon-btn" type="button" aria-label="More">
          <IconMore />
        </button>
      </div>
    </header>
  );
}

export function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <button className={active ? "chip is-on" : "chip"} type="button">
      {children}
      <IconChevron />
    </button>
  );
}

import { useEffect, useRef } from "react";
import { mountSavedViews } from "./engine";
import "./saved-views.css";

const back = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

const gear = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2" />
  </svg>
);

/** Saved views on Engagement: variant A (Filter menu) and variant B (Toolbar split button). */
export function SavedViews() {
  const rootRef = useRef<HTMLDivElement>(null);

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
    <div className="sv" ref={rootRef}>
      <div className="shell">
        <header className="rv-top">
          <div>
            <h1>Saved views on Engagement</h1>
            <p>
              Two ways to save a filter view, built on the Status / Filter dropdowns as they work today: selections live
              inside the menus, not on the page. Every variant is clickable.
            </p>
          </div>
          <div className="rv-ctl">
            <div className="vseg" role="group" aria-label="Prototype variant">
              <button type="button" data-v="A">
                <b>A</b>Filter menu
              </button>
              <button type="button" data-v="B">
                <b>B</b>Toolbar
              </button>
            </div>
            <button type="button" className="rv-reset">
              Reset prototype
            </button>
          </div>
        </header>
        <section className="notes sv-notes" aria-live="polite" />
        <div className="app">
          <div className="crumb">
            {back}
            <span>Airbnb</span>
            <span>/</span>
            <b>Engagement</b>
          </div>
          <div className="ptitle">
            <h2>Engagement</h2>
            <span className="gear" aria-hidden="true">
              {gear}
            </span>
          </div>
          <div className="pbody" />
        </div>
      </div>
    </div>
  );
}

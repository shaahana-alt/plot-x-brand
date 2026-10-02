import { useEffect, useState } from "react";
import { fontById, fonts, pageById, pages, type FontId, type PageId } from "./fonts";
import { Chat } from "./pages/Chat";
import { Newsfeed } from "./pages/Newsfeed";
import { Outbound } from "./pages/Outbound";

function readRoute(): { page: PageId; font: FontId } {
  const [page, font] = window.location.hash.replace(/^#/, "").split("/");
  return { page: pageById(page ?? "").id, font: fontById(font ?? "").id };
}

export default function App() {
  const initial = readRoute();
  const [page, setPage] = useState<PageId>(initial.page);
  const [fontId, setFontId] = useState<FontId>(initial.font);
  const font = fontById(fontId);

  useEffect(() => {
    const next = `#${page}/${fontId}`;
    if (window.location.hash !== next) history.replaceState(null, "", next);
  }, [page, fontId]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const index = fonts.findIndex((item) => item.id === fontId);
        const delta = event.key === "ArrowRight" ? 1 : -1;
        setFontId(fonts[(index + delta + fonts.length) % fonts.length].id);
      }
      if (/^[0-9]$/.test(event.key)) {
        const index = event.key === "0" ? 9 : Number(event.key) - 1;
        if (index < fonts.length) setFontId(fonts[index].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fontId]);

  return (
    <>
      <div className="stage" style={{ fontFamily: `"${font.family}", sans-serif` }}>
        {page === "outbound" ? <Outbound /> : null}
        {page === "chat" ? <Chat /> : null}
        {page === "newsfeed" ? <Newsfeed /> : null}
      </div>
      <footer className="dock">
        <div className="dock-pages" role="tablist" aria-label="Page">
          {pages.map((item) => (
            <button
              key={item.id}
              className={item.id === page ? "is-on" : ""}
              type="button"
              role="tab"
              aria-selected={item.id === page}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="dock-fonts" role="listbox" aria-label="Font">
          {fonts.map((item, index) => (
            <button
              key={item.id}
              className={item.id === fontId ? "is-on" : ""}
              type="button"
              role="option"
              aria-selected={item.id === fontId}
              style={{ fontFamily: `"${item.family}", sans-serif` }}
              title={"note" in item ? item.note : index < 10 ? `${(index + 1) % 10}` : undefined}
              onClick={() => setFontId(item.id)}
            >
              {index < 10 ? <span className="key">{(index + 1) % 10}</span> : null}
              {item.label}
            </button>
          ))}
        </div>
        {"note" in font ? <p className="dock-note">{font.note}.</p> : null}
      </footer>
    </>
  );
}

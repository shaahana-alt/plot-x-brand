import type { CSSProperties } from "react";
import { asset } from "../asset";
import { Chip, TopBar } from "../chrome";

const picks = Array.from({ length: 10 }, (_, index) => index);

const caption = "A beauty creator names Victoria Beckham by Augustinus Bader The Foundation Drops as one of her top";

function CreatorCard({ image, handle, tilt = 0, hero = false }: { image: string; handle: string; tilt?: number; hero?: boolean }) {
  return (
    <figure className={hero ? "creator-card is-hero" : "creator-card"} style={{ "--tilt": `${tilt}deg` } as CSSProperties}>
      <img src={image} alt="" />
      <figcaption>
        <p className="creator-handle">{handle}</p>
        <p className="creator-caption">{caption}</p>
      </figcaption>
    </figure>
  );
}

const stories = [
  {
    title: "Bridal Lip Combos Built Around Portofino ’97",
    body: "Brides and makeup artists are pairing Victoria Beckham’s Portofino ’97 liner with glossy nudes, calling it the one combo that survives a full wedding day.",
    image: asset("/figma/bridal-post.png"),
    wash: asset("/figma/bridal-bg.jpg"),
    handle: "@glowbymaya",
    tilt: 1,
  },
  {
    title: "Anne Hathaway’s Red Carpet Looks Drive Brown Shadow Tutorials",
    body: "Beauty editors are breaking down Anne Hathaway’s monochrome brown eyes and soft updos, and creators are recreating them step by step with drugstore swaps.",
    image: asset("/figma/anne-post.jpg"),
    wash: asset("/figma/anne-bg.jpg"),
    handle: "@allure",
    tilt: -1,
  },
];

export function Newsfeed() {
  return (
    <div className="page">
      <TopBar
        action="Invite"
        crumbs={[
          { label: "📣 Social Listening" },
          { label: "Unwell" },
          { label: "Home", current: true },
        ]}
      />
      <div className="page-body feed">
        <section>
          <h1 className="display section-kicker">Daily Picks</h1>
          <div className="picks">
            <div className="streaks">
              <div><p className="soft">Your Streak</p><p className="display num streak-num">0 days 🔥</p></div>
              <div><p className="soft">Longest streak</p><p className="display num streak-num">0 days ⚡️</p></div>
              <div><p className="soft">Total reviewed</p><p className="display num streak-num">0 posts 📣</p></div>
            </div>
            <div className="filmstrip">
              {picks.map((index) => (
                <figure key={index}>
                  <img src={asset("/media/picks.png")} alt="" />
                  {index === 1 || index === 6 ? <span className="bookmark" aria-hidden="true" /> : null}
                </figure>
              ))}
            </div>
            <div className="pick-actions">
              <button className="ghost" type="button">Preferences</button>
              <button className="ghost" type="button">Saved for later · 2</button>
              <button className="ghost" type="button">Reviewed posts</button>
              <button className="solid" type="button">Let’s go →</button>
            </div>
          </div>
        </section>

        <section className="stories-section">
          <div className="stories-head">
            <h1 className="display section-kicker">Feed Stories</h1>
            <div className="filters">
              <Chip>Last 14 days</Chip>
              <Chip active>Sort by Recency</Chip>
              <Chip>Theme filters</Chip>
            </div>
          </div>
          <div className="stories">
            <article className="story story-hero">
              <div className="story-copy">
                <h3 className="display story-title">NYX Brow Glue: ‘Crazy Lift’ and Long-Lasting Hold</h3>
                <p className="soft">Creators are showcasing the NYX The Brow Glue product, emphasizing its strong hold and ability to defy droopiness for lifted, laminated, and fluffy brows.</p>
                <div className="metrics">
                  <div><p className="display nums">144 🔥</p><span className="soft">Posts</span></div>
                  <div><p className="display nums">2.39M 👀</p><span className="soft">View count</span></div>
                  <div><p className="display nums">237.5k 👀</p><span className="soft">Total engagement</span></div>
                </div>
                <div className="story-foot"><button type="button">View details →</button></div>
              </div>
              <div className="story-visual" style={{ backgroundImage: `url(${asset("/figma/nyx-bg.jpg")})` }}>
                <CreatorCard image={asset("/figma/nyx-post.png")} handle="@uhodom_edinym" hero />
              </div>
            </article>
            {stories.map((story) => (
              <article key={story.title} className="story">
                <div className="story-visual" style={{ backgroundImage: `url(${story.wash})` }}>
                  <CreatorCard image={story.image} handle={story.handle} tilt={story.tilt} />
                </div>
                <div className="story-copy">
                  <h3 className="display story-title small">{story.title}</h3>
                  <p className="soft">{story.body}</p>
                  <div className="story-foot"><button type="button">View details →</button></div>
                </div>
              </article>
            ))}
            <article className="story lulu">
              <div className="story-visual" style={{ backgroundImage: `url(${asset("/figma/lulu-bg.jpg")})` }}>
                <CreatorCard image={asset("/figma/lulu-post.png")} handle="@lululemon" tilt={1} />
              </div>
              <div className="story-copy">
                <h3 className="display story-title small">Lululemon’s Summer Series Turns Pilates Into a Mood</h3>
                <p className="soft">Lululemon’s rooftop Pilates videos are being stitched by instructors who love the pacing, while a few call out the “no distractions” line as a little much.</p>
                <div className="story-foot"><button type="button">View details →</button></div>
              </div>
            </article>
            <article className="quick">
              <p className="eyebrow">Quick check</p>
              <h3 className="display story-title small">What should we surface more of?</h3>
              <p className="soft">Pick a few and we’ll shape your Feed Stories around them.</p>
              <div className="tags">
                {["Product launches", "Creator tutorials", "Celebrity moments", "Dupes and swaps", "Competitor moves", "Complaints"].map((tag) => (
                  <button key={tag} type="button">{tag}</button>
                ))}
              </div>
              <div className="quick-actions">
                <button className="ghost" type="button">Not now</button>
                <button className="solid" type="button">Save</button>
              </div>
            </article>
          </div>
          <button className="show-more" type="button">+ Show all themes</button>
        </section>

        <section className="watch">
          <h1 className="display section-kicker">Your Watchlist</h1>
          <div className="watch-row">
            <div>
              <p className="eyebrow">Saved posts</p>
              <p className="med">From Daily Picks</p>
            </div>
            <span className="soft">2 posts</span>
          </div>
          {[
            ["NYX Brow Glue hold vs. stiffness", "September 24, 2026", ""],
            ["NYX Butter Gloss creator mentions", "September 18, 2026", "Arthur Contractor"],
            ["NYX vs. drugstore brow gel dupes", "September 9, 2026", ""],
          ].map(([title, date, person]) => (
            <div key={title} className="watch-row">
              <div>
                <p className="eyebrow">Custom Report</p>
                <p className="med">{title}</p>
              </div>
              <div className="watch-meta">
                {person ? <span className="person-pill">{person}</span> : null}
                <span className="soft">{date}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

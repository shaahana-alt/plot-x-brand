import { asset } from "../asset";
import { TopBar } from "../chrome";

const stats = [
  { label: "Likes", value: "10k", mark: "♥️", delta: "63%", down: false },
  { label: "Replies", value: "5k", mark: "💬", delta: "10%", down: true },
  { label: "Impressions", value: "20k", mark: "👁️", delta: "20", down: false },
  { label: "EMV", value: "$43,312", mark: "💲", delta: "56%", down: false },
];

const comments = [
  { text: "boss", likes: "9K", replies: "900", impressions: "10,290", emv: "$14,523", by: "Robert Wallis", tone: "#f6e1e6", ink: "#c78181", thumb: asset("/figma/post-b.png") },
  { text: "Love how you styled this! Our community is loving the Fenty foundation with that glow lately ✨", likes: "8K", replies: "780", impressions: "9,882", emv: "$12,523", by: "Martin Levin", tone: "#f8e8ca", ink: "#9d762e", thumb: asset("/figma/post-a.png") },
  { text: "We see you!! This energy is giving ✨ empowered ✨ — love it!", likes: "7K", replies: "670", impressions: "8,656", emv: "$10,523", by: "Roger Lipshutz", tone: "#cde2df", ink: "#698884", thumb: asset("/figma/ob-thumb.png") },
  { text: "This is what self-expression looks like. Thank you for inspiring us 💕 #SephoraSquad", likes: "5.6K", replies: "500", impressions: "7,433", emv: "$5,523", by: "Martin Baptista", tone: "#e8e2ed", ink: "#726e87", thumb: asset("/figma/post-c.png") },
  { text: "Obsessed with this vibe. We’re sending this", likes: "2.3K", replies: "456", impressions: "6,434", emv: "$14,543", by: "Maren George", tone: "#dfe5f1", ink: "#697b88", thumb: asset("/figma/post-d.png") },
];

const leaders = [
  { rank: "1", name: "Robert Wallis", engagement: "9K", average: "9K", posts: "9K", likes: "10,290", score: "9.8", scoreBg: "#e0e4ca", scoreInk: "#888569", tone: "#f6e1e6", ink: "#c78181" },
  { rank: "2", name: "Martin Levin", engagement: "8K", average: "8K", posts: "8K", likes: "9,882", score: "8.6", scoreBg: "#e0e4ca", scoreInk: "#888569", tone: "#f8e8ca", ink: "#9d762e" },
  { rank: "3", name: "Roger Lipshutz", engagement: "7K", average: "7K", posts: "7K", likes: "8,656", score: "5.6", scoreBg: "#d9e3f3", scoreInk: "#697b88", tone: "#cde2df", ink: "#698884" },
  { rank: "4", name: "Martin Baptista", engagement: "5.6K", average: "5.6K", posts: "5.6K", likes: "7,433", score: "5.2", scoreBg: "#d9e3f3", scoreInk: "#697b88", tone: "#e8e2ed", ink: "#726e87" },
  { rank: "4", name: "Maren George", engagement: "5.6K", average: "5.6K", posts: "5.6K", likes: "7,433", score: "3.5", scoreBg: "#f6e1e6", scoreInk: "#886969", tone: "#dfe5f1", ink: "#697b88" },
  { rank: "4", name: "Maria Roggers", engagement: "1k", average: "1k", posts: "5.6K", likes: "7,433", score: "2.6", scoreBg: "#f6e1e6", scoreInk: "#886969", tone: "#e8e2ed", ink: "#726e87" },
];

function Delta({ value, down = false }: { value: string; down?: boolean }) {
  return (
    <p className="ob-delta">
      <span className={down ? "is-down" : "is-up"}>{down ? "↓" : "↑"} {value}</span>
      <span> vs last week</span>
    </p>
  );
}

function Person({ name, tone, ink }: { name: string; tone: string; ink: string }) {
  return (
    <span className="ob-person">
      <span className="ob-bubble" style={{ background: tone, color: ink }}>{name[0]}</span>
      {name}
    </span>
  );
}

export function Outbound() {
  return (
    <div className="page">
      <TopBar
        action="Invite"
        crumbs={[
          { label: "📣 Social Listening" },
          { label: "Sephora" },
          { label: "Outbound", current: true },
        ]}
      />
      <div className="page-body ob">
        <div className="ob-title-row">
          <h1>Outbound</h1>
          <div className="ob-filters">
            {["Source", "Platforms", "Commenters"].map((label) => (
              <button key={label} type="button">{label} ▾</button>
            ))}
            <button className="is-quiet" type="button">7 days ▾</button>
            <button className="ob-gear" type="button" aria-label="Settings">⚙</button>
          </div>
        </div>

        <section className="ob-hero">
          <div className="ob-hero-top">
            <div>
              <h2>A little quieter this week 🤫</h2>
              <p>July 7 - July 15, 2025</p>
            </div>
            <button className="ob-report" type="button">Community Growth Report→</button>
          </div>
          <div className="ob-hero-grid">
            <div className="ob-glass">
              <div className="ob-glass-head">
                <div className="ob-total">
                  <span className="ob-num">200</span>
                  <span className="ob-total-label">Total comments</span>
                  <Delta value="63%" />
                </div>
                <div className="ob-verify">
                  <span>Verified</span>
                  <span className="ob-switch" aria-hidden="true" />
                  <b>All</b>
                </div>
              </div>
              <div className="ob-stats">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="ob-stat-label">{stat.label}</p>
                    <p className="ob-stat-value">
                      {stat.value}
                      <span>{stat.mark}</span>
                    </p>
                    <Delta value={stat.delta} down={stat.down} />
                  </div>
                ))}
              </div>
            </div>
            <div className="ob-glass ob-side">
              <p className="ob-kicker">Top comment</p>
              <div className="ob-comment-preview">
                <img src={asset("/figma/ob-thumb.png")} alt="" />
                <div>
                  <p>We see you!! This energy is giving ✨ empowered ✨ — love it!</p>
                  <p className="ob-metrics">♥ 28.7k · 594 · 6577 · $ 323 EMV</p>
                </div>
              </div>
              <p className="ob-kicker">Top community manager</p>
              <div className="ob-manager">
                <img src={asset("/figma/robert.png")} alt="" />
                <div>
                  <p className="ob-name">Robert Wallis <span>9.8</span></p>
                  <p className="ob-metrics">56 comments · 10.2k max likes · 6577 avg engagement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ob-panel">
          <div className="ob-panel-head">
            <div>
              <h2>Total Replies</h2>
              <p className="ob-big">240</p>
              <p className="ob-sub">Total comments you've made on creators' posts.</p>
            </div>
            <div className="ob-toggles">
              {["🖊️ Brand comments", "♥️ Likes", "💬 Replies", "👁️ Impressions", "💲 EMV"].map((item) => (
                <span key={item} className={item.includes("Replies") ? "is-on" : ""}>{item}</span>
              ))}
            </div>
          </div>
          <div className="ob-chart">
            <div className="ob-y">
              {["200", "150", "100", "50", "0"].map((tick) => <span key={tick}>{tick}</span>)}
            </div>
            <div className="ob-plot">
              <p className="ob-high">All time high</p>
              <img className="ob-fill" src={asset("/figma/chart-fill.svg")} alt="" />
              <img className="ob-line" src={asset("/figma/chart-line.svg")} alt="" />
              <div className="ob-x">
                {["Feb 26", "Mar 4", "Mar 11", "Mar 18", "Mar 25", "Apr 1", "Apr 8", "Apr 15", "Apr 22", "Apr 29", "May 6", "May 13", "May 20"].map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
            <aside className="ob-tip">
              <p className="ob-tip-date">Apr 8, 2025</p>
              <p className="ob-tip-value"><b>240</b> replies</p>
              <p><i>🖊️</i> <b>90</b> brand comments</p>
              <p><i>♥️</i> <b>280k</b> likes</p>
              <p><i>👁️</i> <b>800k</b> impressions</p>
              <p><i>💲</i> <b>433</b> EMV</p>
            </aside>
          </div>
          <p className="ob-updated">Last updated yesterday at 12pm</p>
        </section>

        <section className="ob-panel">
          <div className="ob-panel-head">
            <div className="ob-brand-title">
              <img src={asset("/figma/brand.png")} alt="" />
              <div>
                <h2>Brand’s comments</h2>
                <p className="ob-sub">See your brand’s most engaging comments.</p>
              </div>
            </div>
            <div className="ob-filters">
              <button type="button">Recency ▾</button>
              <button type="button">Export</button>
            </div>
          </div>
          <label className="ob-search">
            <input placeholder="Search" aria-label="Search comments" />
            <span>120 comments</span>
          </label>
          <div className="table-scroll">
            <table className="ob-table">
              <thead>
                <tr>
                  {["Rank", "Date", "Post", "Brand Comments", "Likes", "Replies", "Impressions", "EMV Generated", "Commented by"].map((heading) => (
                    <th key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comments.map((row, index) => (
                  <tr key={row.by}>
                    <td>{index + 1}</td>
                    <td>July 15, 2024</td>
                    <td><img className="ob-thumb" src={row.thumb} alt="" /></td>
                    <td className="ob-copy">{row.text}</td>
                    <td>{row.likes}</td>
                    <td>{row.replies}</td>
                    <td>{row.impressions}</td>
                    <td>{row.emv}</td>
                    <td><Person name={row.by} tone={row.tone} ink={row.ink} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ob-panel">
          <div className="ob-panel-head">
            <div>
              <h2>👑 Community Leaderboard</h2>
              <p className="ob-sub">Your community team’s leaderboard—measuring visibility, voice, and vibe.</p>
            </div>
            <div className="ob-filters">
              <button type="button">Topics ▾</button>
              <button type="button">Platforms ▾</button>
              <button className="is-quiet" type="button">7 days ▾</button>
            </div>
          </div>
          <label className="ob-search">
            <input placeholder="Search for community managers" aria-label="Search community managers" />
          </label>
          <div className="table-scroll">
            <table className="ob-table">
              <thead>
                <tr>
                  {["Rank", "Name", "Total Engagement", "Average Engagement", "# posts Commented on", "Max Likes", "Posts", "Score"].map((heading) => (
                    <th key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaders.map((row) => (
                  <tr key={row.name}>
                    <td>{row.rank}</td>
                    <td><Person name={row.name} tone={row.tone} ink={row.ink} /></td>
                    <td>{row.engagement}</td>
                    <td>{row.average}</td>
                    <td>{row.posts}</td>
                    <td>{row.likes}</td>
                    <td className="ob-post-stack"><img src={asset("/figma/post-a.png")} alt="" /><img src={asset("/figma/post-b.png")} alt="" /><img src={asset("/figma/post-c.png")} alt="" /></td>
                    <td><span className="ob-score" style={{ background: row.scoreBg, color: row.scoreInk }}>{row.score}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

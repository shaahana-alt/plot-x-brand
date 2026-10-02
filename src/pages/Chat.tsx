import { asset } from "../asset";
import { IconBack, IconChevron, IconMore, IconSearch, IconSend } from "../icons";

const nav = [
  "Home",
  "Engagement",
  "Topics",
  "Competitor Analytics",
  "Outbound",
  "Community Hub",
  "Creator Sourcing",
  "Trends",
  "Creative Juicebox",
  "Bookmarks",
];

const brand = ["Owned", "UGC", "Sentiment"];

const bars = [
  { label: "Effectiveness", parts: [40, 48, 82] },
  { label: "Affordibility", parts: [16, 13, 88] },
  { label: "Sun protection", parts: [55, 76, 67] },
  { label: "Ease of making", parts: [30, 54, 60] },
  { label: "Seasonal appeal", parts: [37, 36, 93] },
];

const takeaways = [
  ["Rising Popularity:", "Platforms like TikTok and Instagram feature creative allergen-free recipes and products, appealing to those with allergies and health-conscious consumers."],
  ["Innovative Products:", "Allergen-free foods now mimic traditional flavors and textures, with a focus on plant-based, high-protein, and gut-friendly options."],
  ["Sustainability and Wellness:", "Trends often combine allergy-free eating with eco-friendly practices and wellness themes like mental health and sustainability."],
  ["Community Engagement:", "Social media fosters inclusive communities sharing recipes, dining tips, and viral food hacks, normalizing allergy-friendly diets."],
];

const related = [
  "Which of these hacks are likely to transition from trends to long-term staples in home baking?",
  "What is the sentiment around the taste authenticity of the gluten-free snacks compared to their traditional counterparts?",
  "Are there any emerging or niche brands gaining significant traction specifically due to their association with these baking hack trends?",
  "Which brands are most effectively engaging with content creators and influencers to promote their products within the context of these baking hacks?",
];

export function Chat() {
  return (
    <div className="chat-shell">
      <aside className="side">
        <div className="side-top">
          <div className="brand-row">
            <img src={asset("/media/logo.png")} alt="" />
            <span className="med">Anthropologie</span>
            <IconChevron />
          </div>
          <button className="solid wide" type="button">Create</button>
          <button className="nav-item" type="button">Notifications</button>
          <button className="nav-item is-on" type="button">Chat</button>
          {nav.map((item) => (
            <span key={item}>
              <button className="nav-item" type="button">
                {item}
                {item === "Topics" || item === "Bookmarks" ? <IconChevron /> : null}
              </button>
              {item === "Topics" ? (
                <div className="subnav">
                  <span>Brand Analytics</span>
                  {brand.map((child) => (
                    <span key={child} className={child === "Sentiment" ? "is-here" : ""}>{child}</span>
                  ))}
                </div>
              ) : null}
            </span>
          ))}
        </div>
        <div className="profile">
          <img src={asset("/media/rhea.png")} alt="" />
          <div>
            <p className="med">Rhea Mehta</p>
            <p className="soft">rhea@plot.so</p>
          </div>
          <button className="nav-item" type="button">Settings</button>
        </div>
      </aside>
      <div className="chat-main">
        <header className="chat-head">
          <div className="crumbs">
            <button className="icon-btn" type="button" aria-label="Back"><IconBack /></button>
            <span className="demi muted">Anthropologie</span>
            <span className="slash demi">/</span>
            <span className="demi">Sentiment towards Effaclar products</span>
          </div>
          <div className="top-actions">
            <button className="solid" type="button">Share</button>
            <button className="icon-btn" type="button" aria-label="More"><IconMore /></button>
          </div>
        </header>
        <article className="thread">
          <h1 className="display thread-title">GenZ’s sentiment towards the Effaclair product line</h1>
          <div className="searched">
            <p><span className="med">Searched</span><br /><span className="demi nums">1248 </span><span className="med">posts</span></p>
            <span className="tilts">
              <img src={asset("/media/chat-a.png")} alt="" />
              <img src={asset("/media/chat-b.png")} alt="" />
              <img src={asset("/media/chat-c.png")} alt="" />
            </span>
          </div>
          <p className="overall demi">Overall: Positive</p>
          <section className="chart-card">
            <div className="chart-head">
              <div>
                <h2 className="demi chart-title">Effaclair Sentiment Analysis</h2>
                <div className="pills">
                  <span className="pill pos">Positive</span>
                  <span className="pill neu">Neutral</span>
                  <span className="pill neg">Negative</span>
                </div>
              </div>
              <p className="soft">January 1 – January 7, 2025</p>
            </div>
            <div className="bars" aria-hidden="true">
              <div className="num y-axis soft">
                {["900k", "600k", "300k", "100k", "0"].map((tick) => <span key={tick}>{tick}</span>)}
              </div>
              <div className="bar-row">
                {bars.map((bar) => (
                  <div key={bar.label} className="bar-col">
                    <div className="stack">
                      <i className="neg" style={{ height: bar.parts[0] }} />
                      <i className="neu" style={{ height: bar.parts[1] }} />
                      <i className="pos" style={{ height: bar.parts[2] }} />
                    </div>
                    <span>{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="prose">
            <p>Social media is a hub for allergy-free food trends, highlighting both demand and innovation. Key takeaways:</p>
            {takeaways.map(([title, body]) => (
              <p key={title}><span className="demi">{title}</span> {body}</p>
            ))}
          </div>
          <div className="related">
            <h2 className="demi">Related</h2>
            {related.map((question) => (
              <div key={question} className="related-row">
                <p>{question}</p>
                <button type="button" aria-label="Search this question"><IconSearch /></button>
              </div>
            ))}
          </div>
          <form className="ask" onSubmit={(event) => event.preventDefault()}>
            <img src={asset("/media/rhea.png")} alt="" />
            <input aria-label="Ask a follow-up" placeholder="Ask a follow-up" />
            <button type="submit" aria-label="Send"><IconSend /></button>
          </form>
        </article>
      </div>
    </div>
  );
}

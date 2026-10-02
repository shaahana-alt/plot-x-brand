export const fonts = [
  { id: "apercu", label: "Apercu", family: "Apercu", note: "Light trial only — every weight renders light" },
  { id: "diatype", label: "ABC Diatype", family: "ABC Diatype" },
  { id: "sohne", label: "Söhne", family: "Söhne" },
  { id: "saans", label: "Saans", family: "Saans" },
  { id: "geist", label: "Geist", family: "Geist" },
  { id: "suisse", label: "Suisse", family: "Suisse Intl" },
  { id: "graphik", label: "Graphik", family: "Graphik" },
  { id: "inter", label: "Inter", family: "Inter" },
  { id: "america", label: "GT America", family: "GT America" },
  { id: "goodsans", label: "Good Sans", family: "Good Sans", note: "Only regular and medium exist — semibold and bold render as medium" },
  { id: "ttcommons", label: "TT Commons Pro", family: "TT Commons Pro" },
] as const;

export type FontId = (typeof fonts)[number]["id"];

export const pages = [
  { id: "outbound", label: "Outbound" },
  { id: "chat", label: "AI chat" },
  { id: "newsfeed", label: "Newsfeed" },
] as const;

export type PageId = (typeof pages)[number]["id"];

export function fontById(id: string) {
  return fonts.find((font) => font.id === id) ?? fonts[1];
}

export function pageById(id: string) {
  return pages.find((page) => page.id === id) ?? pages[0];
}

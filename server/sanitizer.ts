const sanitizedTokens: { [key: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
};

export const sanitizeHtml = (html: string | Buffer) =>
  String(html).replace(/[&<>"'\/]/g, (key) => sanitizedTokens[key]);

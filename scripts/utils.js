import { API } from "./config.js";

export function logEvent(eventName, details = {}) {
  const tgUser = Telegram.WebApp.initDataUnsafe?.user || {};
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    platform: navigator.platform,
    user_id: tgUser.id || "unknown",
    username: tgUser.username || "unknown",
    user_first_name: tgUser.first_name || "unknown",
    ...details
  };

  fetch(API.log, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function fetchBooksFromCSV() {
  const response = await fetch(API.books);
  const text = await response.text();

  const results = Papa.parse(text, { header: true }).data;

  const books = {};
  const categories = {};
  const authorsSet = new Set();

  results.forEach(row => {
    if (!row.title || typeof row.title !== "string") return;
    const key = row.title.trim().toLowerCase();
    books[key] = {
      title: row.title,
      author: row.author,
      verdict: row.verdict,
      reason: row.reason,
      alt: row.alt,
      episode: row.episode,
      category: row.category
    };

    if (row.author) authorsSet.add(row.author);

    if (row.category) {
      row.category.split(',').forEach(tag => {
        const cat = tag.trim().toLowerCase();
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(key);
      });
    }
  });

  return {
    books,
    titles: Object.keys(books),
    categories,
    authors: Array.from(authorsSet)
  };
}

export function createTagElement(tag, onClick) {
  const el = document.createElement('span');
  el.className = 'tag';
  el.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
  el.onclick = onClick;
  return el;
}

export function scrollIntoViewIfNeeded(element) {
  setTimeout(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }, 100);
}

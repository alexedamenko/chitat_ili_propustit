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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

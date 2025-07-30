import { initApp } from './app.js';
import { logEvent } from './utils.js';

Telegram.WebApp.ready();
logEvent("app_open");

window.startApp = function () {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  initApp(); // запускаем основное приложение
};

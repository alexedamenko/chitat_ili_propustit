import { logEvent, fetchBooksFromCSV, createTagElement, scrollIntoViewIfNeeded } from './utils.js';

let books = {};
let titles = [];
let categories = {};
let authors = [];

export async function initApp() {
  const container = document.getElementById('mainApp');

  container.innerHTML = `
    <h1>Читать или пропустить?</h1>
    <div class="tag-cloud" id="tagCloud"></div>

    <input id="bookInput" type="text" placeholder="Введите название книги..." />
    <div id="autocompleteList" class="autocomplete-list" style="display:none;"></div>

    <input id="authorInput" type="text" placeholder="Поиск по автору..." />
    <div id="authorAutocompleteList" class="autocomplete-list" style="display:none;"></div>

    <div class="button-group">
      <button id="checkBtn">Проверить</button>
      <button id="randomBtn">🎲 Совет дня</button>
      <button id="toggleSuggestBtn">📩 Предложить книгу</button>
    </div>  

    <div id="tagResults"></div>
    <div class="result" id="resultBox" style="display: none;"></div>
    <div class="result" id="categoryResults" style="display: none;"></div>
    <div class="result" id="authorResults" style="display: none;"></div>

    <div id="suggestForm" style="display:none;" class="suggest-form">
      <h3>📩 Предложить книгу</h3>
      <input id="suggTitle" type="text" placeholder="Название книги" />
      <input id="suggAuthor" type="text" placeholder="Автор (необязательно)" />
      <textarea id="suggComment" placeholder="Комментарий (необязательно)" rows="3"></textarea>
      <button id="submitSuggestionBtn">Отправить</button>
    </div>
  `;

  const data = await fetchBooksFromCSV();
  books = data.books;
  titles = data.titles;
  categories = data.categories;
  authors = data.authors;

  renderTags();

  // События
  document.getElementById('checkBtn').onclick = () => checkBook();
  document.getElementById('randomBtn').onclick = () => randomBook();
  document.getElementById('toggleSuggestBtn').onclick = () => toggleSuggestForm();
  document.getElementById('submitSuggestionBtn').onclick = () => submitSuggestion();
  document.getElementById('bookInput').oninput = () => showSuggestions();
  document.getElementById('authorInput').oninput = () => showAuthorSuggestions();
}

function renderTags() {
  const tagCloud = document.getElementById('tagCloud');
  tagCloud.innerHTML = '';
  Object.keys(categories).forEach(tag => {
    const el = createTagElement(tag, () => showCategory(tag));
    tagCloud.appendChild(el);
  });
}

function showCategory(tag) {
  const container = document.getElementById('categoryResults');
  const resultBox = document.getElementById('resultBox');
  const authorResults = document.getElementById('authorResults');

  resultBox.style.display = 'none';
  authorResults.style.display = 'none';
  container.innerHTML = '';
  container.style.display = 'block';

  const bookList = categories[tag];
  if (!bookList) return;
  bookList.forEach(key => {
    const book = books[key];
    const div = document.createElement('div');
    div.className = 'book-option';
    div.textContent = `📖 ${book.title}`;
    div.onclick = () => {
      document.getElementById('bookInput').value = key;
      checkBook();
    };
    container.appendChild(div);
  });
  scrollIntoViewIfNeeded(container);
}

function checkBook(nameOverride = null) {
  const input = document.getElementById('bookInput');
  const name = nameOverride || input.value.trim().toLowerCase();
  const resultBox = document.getElementById('resultBox');

  resultBox.innerHTML = '';
  resultBox.style.display = 'none';
  document.getElementById('categoryResults').style.display = 'none';
  document.getElementById('authorResults').style.display = 'none';

  if (books[name]) {
    const b = books[name];
    resultBox.innerHTML = `
      <h3>📖 ${b.title}</h3>
      <p>✍️ ${b.author}</p>
      <p><strong>${b.verdict}</strong></p>
      <p><strong>Почему:</strong> ${b.reason}</p>
      <p><strong>Альтернатива:</strong> ${b.alt}</p>
      ${b.episode ? `<p><a href="${b.episode}" target="_blank">🎧 Слушать выпуск</a></p>` : ''}
    `;
  } else {
    resultBox.innerHTML = `<p>Книга не найдена. Можешь предложить свою 👇</p>`;
    toggleSuggestForm();
  }

  resultBox.style.display = 'block';
  scrollIntoViewIfNeeded(resultBox);
  logEvent("check_book", { book_title: name });
}

function randomBook() {
  const keys = Object.keys(books);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  document.getElementById('bookInput').value = '';
  document.getElementById('authorInput').value = '';
  document.getElementById('authorAutocompleteList').style.display = 'none';
  document.getElementById('authorResults').style.display = 'none';
  document.getElementById('categoryResults').style.display = 'none';
  document.getElementById('tagResults').style.display = 'none';
  checkBook(randomKey);
  logEvent("random_book");
}

function toggleSuggestForm() {
  const form = document.getElementById('suggestForm');
  const resultBox = document.getElementById('resultBox');
  resultBox.style.display = 'none';
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
  scrollIntoViewIfNeeded(form);
}

function submitSuggestion() {
  const title = document.getElementById('suggTitle').value.trim();
  if (!title) return alert("Пожалуйста, введите название книги");

  const author = document.getElementById('suggAuthor').value.trim();
  const comment = document.getElementById('suggComment').value.trim();

  fetch("https://script.google.com/macros/s/AKfycbwujPIzB1194lWMmUy8ah8ZHbZbRk04RtXMzCbVjIEFajFhCh0flZzePhWhoMTEdHk/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, comment })
  }).then(() => {
    alert("📨 Данные отправлены!");
    document.getElementById('suggTitle').value = '';
    document.getElementById('suggAuthor').value = '';
    document.getElementById('suggComment').value = '';
    document.getElementById('suggestForm').style.display = 'none';
    document.getElementById('resultBox').style.display = 'none';
  }).catch(err => {
    alert("❌ Ошибка при отправке. Попробуйте ещё раз.");
    console.error(err);
  });

  logEvent("suggest_sent", { title });
}
export function setupSearch(titles, authors, { onBookSelect, onAuthorSelect }) {
  const bookInput = document.getElementById('bookInput');
  const bookList = document.getElementById('autocompleteList');
  const authorInput = document.getElementById('authorInput');
  const authorList = document.getElementById('authorAutocompleteList');

  bookInput.oninput = () => {
    showSuggestions(bookInput, bookList, titles, title => {
      bookInput.value = title;
      bookList.style.display = 'none';
      onBookSelect(title);
    });
  };

  authorInput.oninput = () => {
    showSuggestions(authorInput, authorList, authors, author => {
      authorInput.value = author;
      authorList.style.display = 'none';
      onAuthorSelect(author);
    });
  };
}

function showSuggestions(inputEl, listEl, sourceArray, onSelect) {
  const query = inputEl.value.trim().toLowerCase();
  listEl.innerHTML = '';

  if (!query) {
    listEl.style.display = 'none';
    return;
  }

  const matches = sourceArray.filter(item =>
    item.toLowerCase().includes(query)
  );

  matches.forEach(match => {
    const item = document.createElement('div');
    item.classList.add('autocomplete-item');
    item.textContent = match;
    item.onclick = () => onSelect(match);
    listEl.appendChild(item);
  });

  listEl.style.display = matches.length > 0 ? 'block' : 'none';
}

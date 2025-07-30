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

  if (matches.length > 0) {
  listEl.style.display = 'block';

  // Принудительно скроллим страницу вверх к списку
  setTimeout(() => {
    const rect = listEl.getBoundingClientRect();
    const offset = rect.top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }, 100);
} else {
  listEl.style.display = 'none';
}
  }

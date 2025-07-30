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

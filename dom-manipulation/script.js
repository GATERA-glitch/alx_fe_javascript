// ======= Config =======
const STORAGE_KEY = 'dqg_quotes_v1';
const SESSION_KEY = 'dqg_last_viewed';
const CATEGORY_KEY = 'dqg_last_category';

const defaultQuotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson", category: "Inspiration" }
];

// ======= State =======
let quotes = [];

// ======= DOM refs =======
const quoteList = document.getElementById('quoteList');
const lastViewedEl = document.getElementById('lastViewed');
const categoryFilterEl = document.getElementById('categoryFilter');

// ======= Storage helpers =======
function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error('Failed to save', err);
    alert('Unable to save quotes — storage may be full.');
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      quotes = [...defaultQuotes];
      saveQuotes();
      return;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Invalid array');
    quotes = parsed.map(q => ({
      text: String(q.text || '').trim(),
      author: q.author ? String(q.author).trim() : '',
      category: q.category ? String(q.category).trim() : 'General'
    })).filter(q => q.text.length > 0);
    if (!quotes.length) {
      quotes = [...defaultQuotes];
      saveQuotes();
    }
  } catch {
    quotes = [...defaultQuotes];
    saveQuotes();
  }
}

// ======= Categories =======
function populateCategories() {
  const lastSelected = localStorage.getItem(CATEGORY_KEY) || 'all';
  const categories = Array.from(new Set(quotes.map(q => q.category))).sort();
  categoryFilterEl.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilterEl.appendChild(opt);
  });
  categoryFilterEl.value = lastSelected;
}

// ======= Filtering =======
function filterQuotes() {
  const selectedCategory = categoryFilterEl.value;
  localStorage.setItem(CATEGORY_KEY, selectedCategory);
  quoteList.innerHTML = '';

  const filtered = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
  filtered.forEach(q => {
    const li = document.createElement('li');

    const catEl = document.createElement('div');
    catEl.className = 'quote-category';
    catEl.textContent = q.category;

    const textEl = document.createElement('div');
    textEl.className = 'quote-text';
    textEl.textContent = `"${q.text}"`;

    const authorEl = document.createElement('div');
    authorEl.className = 'quote-author';
    authorEl.textContent = q.author ? `— ${q.author}` : '— unknown';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn-ghost small';
    viewBtn.textContent = 'View';
    viewBtn.addEventListener('click', () => viewQuote(quotes.indexOf(q)));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-ghost small';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteQuote(quotes.indexOf(q)));

    actions.appendChild(viewBtn);
    actions.appendChild(delBtn);

    li.appendChild(catEl);
    li.appendChild(textEl);
    li.appendChild(authorEl);
    li.appendChild(actions);

    quoteList.appendChild(li);
  });
  updateLastViewedUI();
}

// ======= Actions =======
function addQuote(text, author, category = 'General') {
  const trimmed = String(text || '').trim();
  if (!trimmed) return alert('Add quote text.');
  const entry = { text: trimmed, author: String(author || '').trim(), category: String(category || 'General').trim() };
  quotes.push(entry);
  saveQuotes();
  populateCategories();
  filterQuotes();
}

function deleteQuote(idx) {
  if (idx < 0 || idx >= quotes.length) return;
  if (!confirm('Delete this quote?')) return;
  quotes.splice(idx, 1);
  saveQuotes();

  const lastIdx = sessionStorage.getItem(SESSION_KEY);
  if (lastIdx !== null) {
    const li = Number(lastIdx);
    if (li === idx) sessionStorage.removeItem(SESSION_KEY);
    else if (li > idx) sessionStorage.setItem(SESSION_KEY, String(li - 1));
  }

  populateCategories();
  filterQuotes();
}

function viewQuote(idx) {
  if (idx < 0 || idx >= quotes.length) return;
  const q = quotes[idx];
  alert(`"${q.text}"\n\n— ${q.author || 'unknown'}`);
  sessionStorage.setItem(SESSION_KEY, String(idx));
  updateLastViewedUI();
}

function updateLastViewedUI() {
  const li = sessionStorage.getItem(SESSION_KEY);
  if (li === null) {
    lastViewedEl.textContent = '—';
    return;
  }
  const idx = Number(li);
  if (!Number.isFinite(idx) || idx < 0 || idx >= quotes.length) {
    lastViewedEl.textContent = '—';
    return;
  }
  const q = quotes[idx];
  lastViewedEl.textContent = q.text.length > 40 ? q.text.slice(0, 40) + '…' : q.text;
}

// ======= Export / Import JSON =======
function exportQuotes() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export failed', err);
    alert('Failed to export quotes.');
  }
}

function importFromJsonFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) return alert('JSON must be an array of quote objects.');
      const sanitized = parsed
        .map(q => ({ text: String(q.text || '').trim(), author: q.author ? String(q.author).trim() : '', category: q.category ? String(q.category).trim() : 'General' }))
        .filter(q => q.text.length > 0);

      if (!sanitized.length) return alert('No valid quotes found.');

      const append = confirm(`Import ${sanitized.length} quotes. Press OK to append, Cancel to replace all.`);
      quotes = append ? [...quotes, ...sanitized] : sanitized;

      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    } catch (err) {
      console.error('Import failed', err);
      alert('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
}

// ======= Server Sync Simulation =======
async function fetchQuotesFromServer() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    if (!res.ok) throw new Error('Server error');
    const serverData = await res.json();

    const serverQuotes = serverData.map(item => ({
      text: item.title || 'No text',
      author: `User ${item.userId}`,
      category: 'Server'
    }));

    // Merge: server takes precedence
    serverQuotes.forEach(sq => {
      if (!quotes.some(lq => lq.text === sq.text && lq.author === sq.author)) {
        quotes.push(sq);
      }
    });

    saveQuotes();
    populateCategories();
    filterQuotes();

    alert('Quotes synced successfully from server!');
  } catch (err) {
    console.error('Server fetch failed:', err);
    alert('Server sync failed.');
  }
}

// ======= Wiring =======
document.getElementById('addForm').addEventListener('submit', e => {
  e.preventDefault();
  const t = document.getElementById('quoteText');
  const a = document.getElementById('quoteAuthor');
  const c = document.getElementById('quoteCategory');
  addQuote(t.value, a.value, c.value);
  t.value = '';
  a.value = '';
  c.value = '';
});

document.getElementById('exportBtn').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', e => {
  importFromJsonFile(e.target.files[0]);
  e.target.value = '';
});
document.getElementById('clearLocal').addEventListener('click', () => {
  if (!confirm('Clear all saved quotes?')) return;
  localStorage.removeItem(STORAGE_KEY);
  quotes = [...defaultQuotes];
  saveQuotes();
  sessionStorage.removeItem(SESSION_KEY);
  populateCategories();
  filterQuotes();
});
document.getElementById('randomView').addEventListener('click', () => {
  if (!quotes.length) return alert('No quotes available');
  const idx = Math.floor(Math.random()

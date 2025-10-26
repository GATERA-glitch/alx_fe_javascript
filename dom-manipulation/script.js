// ======= Config =======
const STORAGE_KEY = 'dqg_quotes_v1';
const SESSION_KEY = 'dqg_last_viewed';
const CATEGORY_KEY = 'dqg_last_category';

// ======= Default Quotes =======
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

// ======= Load / Save =======
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { quotes = [...defaultQuotes]; saveQuotes(); return; }
  try {
    const parsed = JSON.parse(raw);
    quotes = parsed.map(q => ({
      text: q.text || '',
      author: q.author || '',
      category: q.category || 'General'
    }));
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

// ======= Render / Filter =======
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

// ======= Last Viewed =======
function viewQuote(idx) {
  if (idx < 0 || idx >= quotes.length) return;
  const q = quotes[idx];
  alert(`"${q.text}"\n\n— ${q.author || 'unknown'}`);
  sessionStorage.setItem(SESSION_KEY, idx);
  updateLastViewedUI();
}

function updateLastViewedUI() {
  const idx = sessionStorage.getItem(SESSION_KEY);
  if (idx === null) { lastViewedEl.textContent = '—'; return; }
  const q = quotes[idx];
  if (!q) { lastViewedEl.textContent = '—'; return; }
  lastViewedEl.textContent = q.text.length > 40 ? q.text.slice(0,40)+'…' : q.text;
}

// ======= Add / Delete =======
function addQuote(text, author, category='General') {
  const trimmed = text.trim();
  if (!trimmed) return alert('Add quote text.');
 

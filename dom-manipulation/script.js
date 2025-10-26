// Simulated server endpoint using JSONPlaceholder
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Local storage key
const LOCAL_KEY = 'quotes';

// Local quotes
let quotes = [];

// Notification element
const notification = document.getElementById('notification');

// Fetch quotes from "server"
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.slice(0, 5).map(item => item.title);
  } catch (err) {
    console.error('Error fetching from server', err);
    return [];
  }
}

// Post a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: quote })
    });
    const data = await response.json();
    console.log('Quote posted to server:', data);
  } catch (err) {
    console.error('Error posting to server', err);
  }
}

// Sync function
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];

  // Conflict resolution: server takes precedence
  const mergedQuotes = Array.from(new Set([...serverQuotes, ...localQuotes]));
  if (mergedQuotes.length !== localQuotes.length) {
    notification.textContent = 'Quotes updated from server!';
  } else {
    notification.textContent = '';
  }

  quotes = mergedQuotes;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
  displayQuote();
}

// Display a random quote
function displayQuote() {
  if (quotes.length === 0) {
    document.getElementById('quote').textContent = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById('quote').textContent = quotes[randomIndex];
}

// Add a new random quote locally and post to server
function addRandomQuote() {
  const newQuote = 'New quote ' + Math.floor(Math.random() * 1000);
  quotes.push(newQuote);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
  notification.textContent = 'New quote added locally!';
  displayQuote();
  postQuoteToServer(newQuote); // POST to server
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', displayQuote);
document.getElementById('addQuote').addEventListener('click', addRandomQuote);

// Initial load
(function init() {
  quotes = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
  displayQuote();
  syncWithServer(); // Initial sync
  // Periodic sync every 10 seconds
  setInterval(syncWithServer, 10000);
})();

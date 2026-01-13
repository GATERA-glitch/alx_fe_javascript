// Array of quote objects
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${quote.category}:</strong> "${quote.text}"`;
}

// Function to add a new quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both quote text and category!");
    return;
  }

  // Add new quote to array
  quotes.push({ text: newText, category: newCategory });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Give feedback
  alert("Quote added successfully!");
}

// Event listener for the 'Show New Quote' button
newQuoteButton.addEventListener("click", showRandomQuote);
// === Initial Quotes Array ===
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// === DOM Elements ===
const quoteList = document.getElementById("quoteList");
const quoteInput = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuote");
const exportBtn = document.getElementById("exportBtn");
const importFileInput = document.getElementById("importFile");

// === Save quotes to localStorage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Display Quotes ===
function displayQuotes() {
  quoteList.innerHTML = "";
  quotes.forEach((q) => {
    const li = document.createElement("li");
    li.textContent = q;
    quoteList.appendChild(li);
  });
}

// === Add New Quote ===
function addQuote() {
  const newQuote = quoteInput.value.trim();
  if (newQuote !== "") {
    quotes.push(newQuote);
    saveQuotes();
    displayQuotes();
    quoteInput.value = "";
  }
}

// === Export Quotes to JSON ===
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// === Import Quotes from JSON ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    displayQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Event Listeners ===
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFileInput.addEventListener("change", importFromJsonFile);

// === Initialize ===
displayQuotes();
// === Load data from localStorage or initialize ===
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// === DOM Elements ===
const quoteList = document.getElementById("quoteList");
const quoteInput = document.getElementById("newQuote");
const categoryInput = document.getElementById("newCategory");
const addQuoteBtn = document.getElementById("addQuote");
const categoryFilter = document.getElementById("categoryFilter");
const exportBtn = document.getElementById("exportBtn");
const importFileInput = document.getElementById("importFile");

// === Save to Local Storage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Display Quotes ===
function displayQuotes(filteredQuotes = quotes) {
  quoteList.innerHTML = "";
  filteredQuotes.forEach((q) => {
    const li = document.createElement("li");
    li.textContent = `${q.text} — [${q.category}]`;
    quoteList.appendChild(li);
  });
}
function syncQuotes() {
  // 1. جلب البيانات من السيرفر الوهمي (mock API)
  fetch('https://jsonplaceholder.typicode.com/posts') // مثال لسيرفر وهمي
    .then(response => response.json())
    .then(serverQuotes => {
      // 2. تحديث localStorage بالبيانات الجديدة
      localStorage.setItem('quotes', JSON.stringify(serverQuotes));

      // 3. إشعار المستخدم أو تحديث الواجهة
      alert("Quotes synchronized with server!");
    })
    .catch(error => console.error("Error syncing quotes:", error));
}

// === Populate Categories in Dropdown ===
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = categories
    .map(
      (cat) =>
        `<option value="${cat}" ${
          cat === lastSelectedCategory ? "selected" : ""
        }>${cat}</option>`
    )
    .join("");
}

document.getElementById("syncButton").addEventListener("click", syncQuotes);

// === Filter Quotes by Category ===
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    displayQuotes(quotes);
  } else {
    const filtered = quotes.filter((q) => q.category === selectedCategory);
    displayQuotes(filtered);
  }
}

// === Add New Quote ===
function addQuote() {
  const newQuote = quoteInput.value.trim();
  const newCategory = categoryInput.value.trim() || "Uncategorized";

  if (newQuote !== "") {
    quotes.push({ text: newQuote, category: newCategory });
    saveQuotes();
    populateCategories();
    filterQuotes();
    quoteInput.value = "";
    categoryInput.value = "";
  }
}

// === Export Quotes to JSON ===
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// === Import Quotes from JSON ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Event Listeners ===
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFileInput.addEventListener("change", importFromJsonFile);

// === Initialize ===
populateCategories();
filterQuotes();
// === Load from localStorage or initialize ===
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // fake API

// === DOM Elements ===
const quoteList = document.getElementById("quoteList");
const quoteInput = document.getElementById("newQuote");
const categoryInput = document.getElementById("newCategory");
const addQuoteBtn = document.getElementById("addQuote");
const categoryFilter = document.getElementById("categoryFilter");
const exportBtn = document.getElementById("exportBtn");
const importFileInput = document.getElementById("importFile");

// === Save to Local Storage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Display Quotes ===
function displayQuotes(filteredQuotes = quotes) {
  quoteList.innerHTML = "";
  filteredQuotes.forEach((q) => {
    const li = document.createElement("li");
    li.textContent = `${q.text} — [${q.category}]`;
    quoteList.appendChild(li);
  });
}

// === Populate Categories ===
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = categories
    .map(
      (cat) =>
        `<option value="${cat}" ${
          cat === lastSelectedCategory ? "selected" : ""
        }>${cat}</option>`
    )
    .join("");
}

// === Filter Quotes ===
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    displayQuotes(quotes);
  } else {
    const filtered = quotes.filter((q) => q.category === selectedCategory);
    displayQuotes(filtered);
  }
}

// === Add Quote ===
function addQuote() {
  const newQuote = quoteInput.value.trim();
  const newCategory = categoryInput.value.trim() || "Uncategorized";

  if (newQuote !== "") {
    const newObj = { id: Date.now(), text: newQuote, category: newCategory };
    quotes.push(newObj);
    saveQuotes();
    populateCategories();
    filterQuotes();

    // Sync with server
    syncQuoteToServer(newObj);

    quoteInput.value = "";
    categoryInput.value = "";
  }
}

// === Export Quotes ===
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// === Import Quotes ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// === SYNC WITH SERVER ===

// Send a single quote to the server (simulation)
async function syncQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log("Synced to server:", data);
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

// Fetch quotes from server (simulate periodic updates)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    // Simulate server sending only a few quotes
    const serverData = serverQuotes.slice(0, 5).map((q) => ({
      id: q.id,
      text: q.title,
      category: "Server",
    }));

    // === Conflict resolution ===
    let conflicts = [];
    serverData.forEach((serverQuote) => {
      const existing = quotes.find((q) => q.id === serverQuote.id);
      if (existing && existing.text !== serverQuote.text) {
        conflicts.push({ local: existing, server: serverQuote });
        // Server takes precedence
        Object.assign(existing, serverQuote);
      } else if (!existing) {
        quotes.push(serverQuote);
      }
    });

    if (conflicts.length > 0) {
      alert("Conflicts detected! Server data has been prioritized.");
      console.log("Conflicts resolved:", conflicts);
    }

    saveQuotes();
    populateCategories();
    filterQuotes();
  } catch (err) {
    console.error("Failed to fetch server data:", err);
  }
}

// === Periodic sync every 30 seconds ===
setInterval(fetchQuotesFromServer, 30000);

// === Event Listeners ===
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFileInput.addEventListener("change", importFromJsonFile);

// === Initialize ===
populateCategories();
filterQuotes();
fetchQuotesFromServer(); // initial sync
document.getElementById("syncButton").addEventListener("click", syncQuotes);

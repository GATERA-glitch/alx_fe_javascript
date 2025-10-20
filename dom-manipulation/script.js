// Array to hold quote objects
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

// References to DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const textInput = document.getElementById("newQuoteText");
const categoryInput = document.getElementById("newQuoteCategory");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Function to display a random quote (renamed as required)
function displayRandomQuote() {
  // Clear previous content
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }

  if (quotes.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No quotes available.";
    quoteDisplay.appendChild(message);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `— ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to add a new quote
function addQuote() {
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// Event listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

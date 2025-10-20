// Array to hold quote objects
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

// Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — ${quote.category}`;
}

// Function to create the Add Quote form dynamically
function createAddQuoteForm() {
  const container = document.createElement("div");
  container.id = "addQuoteContainer";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.innerHTML = "Add Quote";

  // Append elements to container
  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);

  // Append container to body
  document.body.appendChild(container);

  // Event listener for adding a quote
  addButton.addEventListener("click", addQuote);
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// Initialize the app
function init() {
  // Create the Add Quote form dynamically
  createAddQuoteForm();

  // Event listener for showing random quotes
  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
}

// Run the app
window.onload = init;

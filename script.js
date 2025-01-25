let quotes = [];
let originalQuotes = [];
let currentQuoteIndex = 0;
let isLoading = false;

const loader = document.getElementById('loader');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

async function loadQuotes() {
    isLoading = true;
    loader.style.display = 'block';
    quoteText.textContent = 'Loading...';
    quoteAuthor.textContent = '';

    try {
        const response = await fetch('quotes.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        quotes = data.quotes;
        originalQuotes = [...quotes];
        localStorage.setItem('quotes', JSON.stringify(quotes));
        displayQuote(currentQuoteIndex);
    } catch (error) {
        console.error('Error loading quotes:', error);
        quoteText.textContent = 'Failed to load quotes. Please try again later.';
    } finally {
        isLoading = false;
        loader.style.display = 'none';
    }
}

function displayQuote(index) {
    if (quotes.length === 0) return;

    const quote = quotes[index];
    quoteText.classList.add('fade-out');
    quoteAuthor.classList.add('fade-out');

    setTimeout(() => {
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `- ${quote.author}`;

        quoteText.classList.remove('fade-out');
        quoteAuthor.classList.remove('fade-out');
    }, 300);
}

function nextQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    displayQuote(currentQuoteIndex);
}

function prevQuote() {
    currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
    displayQuote(currentQuoteIndex);
}

function searchQuotes() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredQuotes = originalQuotes.filter(quote =>
        quote.text.toLowerCase().includes(searchTerm) ||
        quote.author.toLowerCase().includes(searchTerm)
    );

    if (filteredQuotes.length > 0) {
        quotes = filteredQuotes;
        currentQuoteIndex = 0;
        displayQuote(currentQuoteIndex);
    } else {
        quoteText.textContent = 'No quotes found.';
        quoteAuthor.textContent = '';
    }
}

function resetSearch() {
    document.getElementById('search-input').value = '';
    quotes = [...originalQuotes];
    currentQuoteIndex = 0;
    displayQuote(currentQuoteIndex);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

document.getElementById('next-quote').addEventListener('click', nextQuote);
document.getElementById('prev-quote').addEventListener('click', prevQuote);
document.getElementById('search-input').addEventListener('input', debounce(searchQuotes, 300));
document.getElementById('reset-search').addEventListener('click', resetSearch);

// Load quotes from local storage if available
const cachedQuotes = localStorage.getItem('quotes');
if (cachedQuotes) {
    quotes = JSON.parse(cachedQuotes);
    originalQuotes = [...quotes];
    displayQuote(currentQuoteIndex);
} else {
    loadQuotes();
}
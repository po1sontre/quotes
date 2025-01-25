let quotes = [];
let originalQuotes = [];
let currentQuoteIndex = 0;

async function loadQuotes() {
    try {
        const response = await fetch('quotes.json');
        const data = await response.json();
        quotes = data.quotes;
        originalQuotes = [...quotes];
        displayQuote(currentQuoteIndex);
    } catch (error) {
        console.error('Error loading quotes:', error);
        document.getElementById('quote-text').textContent = 'Failed to load quotes.';
    }
}

function displayQuote(index) {
    if (quotes.length === 0) return;
    
    const quote = quotes[index];
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    
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
        document.getElementById('quote-text').textContent = 'No quotes found.';
        document.getElementById('quote-author').textContent = '';
    }
}

function resetSearch() {
    document.getElementById('search-input').value = '';
    quotes = [...originalQuotes];
    currentQuoteIndex = 0;
    displayQuote(currentQuoteIndex);
}

document.getElementById('next-quote').addEventListener('click', nextQuote);
document.getElementById('prev-quote').addEventListener('click', prevQuote);
document.getElementById('search-input').addEventListener('input', searchQuotes);
document.getElementById('reset-search').addEventListener('click', resetSearch);

loadQuotes();
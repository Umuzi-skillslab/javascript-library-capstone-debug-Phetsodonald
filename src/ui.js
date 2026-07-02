const {borrowBook} = require('./utils')

let catalogueContainer;
let searchInput;
let filterDropdown;



function initializeUI() {
    catalogueContainer = document.querySelector("#catalogue-list");
    searchInput = document.getElementById("search");
    filterDropdown = document.querySelector("#filter-category");

    // Check that all required elements exist 
    if (!catalogueContainer || !searchInput || !filterDropdown) {
        throw new Error("Required DOM elements not found.");
    }

    setupEventListeners();
    loadCatalogue();
}

function setupEventListeners() {
    
    searchInput.addEventListener("input", handleSearch);

    filterDropdown.addEventListener("change", handleFilterChange);
    
    const borrowForm = document.getElementById("borrow-form");
    if(borrowForm){
        borrowForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleBorrowSubmit(event);
        });
    }
    
    catalogueContainer.addEventListener("click", (event) => {
        if(event.target.matches(".borrow-btn")){
            handleBorrowClick(event); 
        }
    })
}

function renderBookCatalogue(bookList) {
    // Clear existing content
    catalogueContainer.innerHTML = "";

    // Reduce DOM reflows
    const fragment = document.createDocumentFragment();

    bookList.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";

        // Store the book ID
        bookCard.dataset.bookId = book.id;

        // Build the card
        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Available:</strong> ${book.availableCopies}</p>
        `;

        // Book selection event
        bookCard.addEventListener("click", () => {
            selectBook(book);
        });

        fragment.appendChild(bookCard);
    });

    catalogueContainer.appendChild(fragment);
}

function handleBorrowSubmit(event) {
    // Prevent page refresh
    event.preventDefault();

    const memberIdInput = document.getElementById("member-id");
    const isbnInput = document.getElementById("isbn");

    const memberId = memberIdInput.value.trim();
    const isbn = isbnInput.value.trim();

    // Validate inputs
    if (!memberId || !isbn) {
        alert("Please enter both Member ID and ISBN.");
        return;
    }

    try {
        const success = borrowBook(memberId, isbn);

        if (success) {
            alert("Book borrowed successfully.");

            // Reset the form
            event.target.reset();
        } else {
            alert("Unable to borrow the book. Please check the Member ID, ISBN, or book availability.");
        }
    } catch (error) {
        console.error("Borrow operation failed:", error);
        alert("An unexpected error occurred. Please try again later.");
    }
}

function handleBookClick(event) {
    // Find the nearest book card that was clicked
    const bookElement = event.target.closest(".book-card");

    // Ignore clicks outside of a book card
    if (!bookElement) {
        return;
    }

    // Get the book ID from the data attribute
    const bookId = bookElement.dataset.bookId;

    // Validate the ID
    if (!bookId) {
        console.error("Book ID not found.");
        return;
    }

    displayBookDetails(bookId);
}

function handleSearch(event) {
    // Normalize the search term
    const searchTerm = event.target.value.trim().toLowerCase();

    // Show all books if the search box is empty
    if (searchTerm === "") {
        renderBookCatalogue(books);
        return;
    }

    // Filter books by title (case-insensitive)
    const results = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
    );

    renderBookCatalogue(results);
}

function handleFilterChange() {
    const selectedCategory = filterDropdown.value.trim();

    const filteredBooks =
        selectedCategory === "all"
            ? books
            : books.filter(book => book.category === selectedCategory);

    renderBookCatalogue(filteredBooks);
}

// Function missing JSON operations
function exportLibraryData() {
    // Should convert to JSON
    // Missing: error handling
    
    let data = {
        books: books,
        members: members
    };
    
    // Missing: JSON.stringify
    return data;
}

// Function missing JSON parsing
function importLibraryData(jsonString) {
    // Missing: try-catch for JSON.parse
    // Missing: validation of parsed data
    
    let data = JSON.parse(jsonString);
    
    books = data.books;
    members = data.members;
}

// LocalStorage functions with errors
function saveToLocalStorage() {
    // Missing: error handling for localStorage
    // Missing: JSON.stringify
    
    localStorage.setItem("libraryBooks", books);
    localStorage.setItem("libraryMembers", members);
}

function loadFromLocalStorage() {
    // Missing: null check
    // Missing: JSON.parse
    // Missing: error handling
    
    let booksData = localStorage.getItem("libraryBooks");
    let membersData = localStorage.getItem("libraryMembers");
    
    books = booksData;
    members = membersData;
}

// Display function with template issues
function displayBookDetails(isbn) {
    let book = findBookByISBN(isbn);
    
    // Missing: null check
    
    
    let detailsContainer = document.getElementById("book-details");
    
    // Should use template literals
    
    let html = "<div class='book-details'>";
    html = html + "<h2>" + book.title + "</h2>";
    html = html + "<p><strong>Author:</strong> " + book.author + "</p>";
    html = html + "<p><strong>ISBN:</strong> " + book.isbn + "</p>";
    html = html + "<p><strong>Year:</strong> " + book.year + "</p>";
    html = html + "</div>";
    
    detailsContainer.innerHTML = html;
}

// Statistics display with errors
function updateStatisticsDisplay() {
    // Wrong selector methods
    let totalBooksEl = document.querySelector(".total-books");
    let totalMembersEl = document.querySelector(".total-members");
    
    // Missing: null checks
    // Should use textContent instead of innerHTML for text
    
    totalBooksEl.innerHTML = books.length;
    totalMembersEl.innerHTML = members.length;
    
    // Missing: update other statistics
}

// Dynamic form generation with errors
function createMemberForm() {
    let formContainer = document.getElementById("member-form");
    
    // Inefficient DOM manipulation
    let form = document.createElement("form");
    
    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name";
    // Missing: label, placeholder, required attribute
    
    let emailInput = document.createElement("input");
    emailInput.type = "text";  // Should be "email"
    emailInput.id = "email";
    
    // Missing: other form fields
    
    form.appendChild(nameInput);
    form.appendChild(emailInput);
    
    formContainer.appendChild(form);
}

document.addEventListener("DOMContentLoaded", initializeUI);

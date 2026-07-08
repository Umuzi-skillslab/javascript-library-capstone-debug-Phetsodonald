import {borrowBook, findBookByISBN, searchBooksByCategory} from './utils.js';
import { books, members } from "./storage.js";

let catalogueContainer;
let searchInput;
let filterDropdown;

export function initializeUI() {
    catalogueContainer = document.querySelector("#catalogue-list");
    searchInput = document.getElementById("search");
    filterDropdown = document.querySelector("#filter-category");

    // Check that all required elements exist 
    if (!catalogueContainer || !searchInput || !filterDropdown) {
        throw new Error("Required DOM elements not found.");
    }
    renderBookCatalogue([...books.values()]);
    setupEventListeners();
  
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

        // Store the book ISBN
        bookCard.dataset.bookISBN = book.isbn;

        // Build the card
        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Available:</strong> ${book.copies}</p>
        `;

        // Book selection event
        bookCard.addEventListener("click", (event) => {
            handleBookClick(event)
        })
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
    const bookISBN = bookElement.dataset.bookISBN;

    // Validate the ID
    if (!bookISBN) {
        console.error("Book ISBN not found.");
        return;
    }

    displayBookDetails(bookISBN);
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
    const results = [...books.values()].filter(book =>
        book.title.toLowerCase().includes(searchTerm)
    );

    renderBookCatalogue(results);
}

function handleFilterChange() {
    const selectedCategory = filterDropdown.value.trim();

    if (selectedCategory === "all") {
        renderBookCatalogue([...books.values()]);
        return;
    }

    const filteredBooks = searchBooksByCategory(
        books,
        selectedCategory
    );

    renderBookCatalogue(filteredBooks);
}



function displayBookDetails(isbn) {
    const book = findBookByISBN(isbn);

    if (!book) {
        console.error("Book not found.");
        return false;
    }

    const detailsContainer = document.getElementById("book-details");

    if (!detailsContainer) {
        console.error("Book details container not found.");
        return false;
    }

    detailsContainer.innerHTML = `
        <div class="book-details">
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <p><strong>Available Copies:</strong> ${book.availableCopies}</p>
        </div>
    `;

    return true;
}

function updateStatisticsDisplay() {
    const totalBooksEl = document.querySelector(".total-books");
    const totalMembersEl = document.querySelector(".total-members");

    if (totalBooksEl) {
        totalBooksEl.textContent = books.size;
    }

    if (totalMembersEl) {
        totalMembersEl.textContent = members.length;
    }

    
    const availableBooksEl = document.querySelector(".available-books");
    if (availableBooksEl) {
        const availableBooks = [...books.values()]
            .filter(book => book.availableCopies > 0).length;
        availableBooksEl.textContent = availableBooks;
    }

    const borrowedBooksEl = document.querySelector(".borrowed-books");
    if (borrowedBooksEl) {
        const borrowedBooks = [...books.values()]
            .filter(book => book.availableCopies < book.totalCopies).length;
        borrowedBooksEl.textContent = borrowedBooks;
    }
}

function createMemberForm() {
    const formContainer = document.getElementById("member-form");

    if (!formContainer) {
        return;
    }

    // Prevent duplicate forms
    formContainer.innerHTML = "";

    const form = document.createElement("form");

    // Name
    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "name");
    nameLabel.textContent = "Name";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name";
    nameInput.name = "name";
    nameInput.placeholder = "Enter full name";
    nameInput.required = true;

    // Email
    const emailLabel = document.createElement("label");
    emailLabel.setAttribute("for", "email");
    emailLabel.textContent = "Email";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.id = "email";
    emailInput.name = "email";
    emailInput.placeholder = "Enter email address";
    emailInput.required = true;

    // Member ID
    const memberIdLabel = document.createElement("label");
    memberIdLabel.setAttribute("for", "member-id");
    memberIdLabel.textContent = "Member ID";

    const memberIdInput = document.createElement("input");
    memberIdInput.type = "text";
    memberIdInput.id = "member-id";
    memberIdInput.name = "memberId";
    memberIdInput.placeholder = "Enter member ID";
    memberIdInput.required = true;

    // Membership Type
    const membershipLabel = document.createElement("label");
    membershipLabel.setAttribute("for", "membership-type");
    membershipLabel.textContent = "Membership Type";

    const membershipSelect = document.createElement("select");
    membershipSelect.id = "membership-type";
    membershipSelect.name = "membershipType";
    membershipSelect.required = true;

    ["Standard", "Premium"].forEach(type => {
        const option = document.createElement("option");
        option.value = type.toLowerCase();
        option.textContent = type;
        membershipSelect.appendChild(option);
    });

    // Submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Add Member";

    form.append(
        nameLabel,
        nameInput,
        emailLabel,
        emailInput,
        memberIdLabel,
        memberIdInput,
        membershipLabel,
        membershipSelect,
        submitButton
    );

    formContainer.appendChild(form);
}

document.addEventListener("DOMContentLoaded", initializeUI);

import {borrowBook, returnBook, findBookByISBN, searchBooksByCategory, addMultipleMembers, findMemberById} from './utils.js';
import { books, members, saveToLocalStorage } from "./storage.js";
import {Member, PremiumMember} from "./library.js";

let catalogueContainer, 
    controls, 
    statisticsTab, 
    membersList, 
    createMemberToggle, 
    formContainer, 
    borrowBookBtn,
    membersTab, 
    statisticsSection, 
    borrowSection,
    returnSection,
    memberSection, 
    searchInput, 
    filterDropdown, 
    bookDetails,
    memberDetails,
    returnBookBtn, 
    catalogueTab;


export function initializeUI() {
    cacheDom();
    validateDom();
    setupEventListeners();
    renderBookCatalogue([...books.values()]);
}

function setupEventListeners() {
    
    searchInput.addEventListener("input", handleSearch);
    catalogueTab.addEventListener("click", displayCatalogue);
    borrowBookBtn.addEventListener("click", displayBorrow);
    returnBookBtn.addEventListener("click", displayReturn);
    createMemberToggle.addEventListener("click", displayAddMemberForm)
    statisticsTab.addEventListener("click", displayStatistics);
    membersTab.addEventListener("click", displayMembers);
    filterDropdown.addEventListener("change", handleFilterChange);
    
    const borrowForm = document.getElementById("borrow-form");
    if(borrowForm){
        borrowForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleBorrowSubmit(event);
        });
    }

    const returnForm = document.getElementById("return-form");
    if (returnForm) {
        returnForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleReturnSubmit(event);
        });
    }
    
    catalogueContainer.addEventListener("click", (event) => {
        if(event.target.matches(".borrow-btn")){
            handleBorrowClick(event); 
        }
    })
}

export function renderBookCatalogue(bookList) {
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
            <p><strong>Available:</strong> ${book.availableCopies}</p>
        `;

        // Book selection event
        bookCard.addEventListener("click", (event) => {
            event.preventDefault();
            handleBookClick(event)
        })
        fragment.appendChild(bookCard);
    });

    catalogueContainer.appendChild(fragment);
}

function renderMembers(memberList){
    membersList.innerHTML = "";

     // Reduce DOM reflows
    const fragment = document.createDocumentFragment();

    memberList.forEach(member => {
        const memberCard = document.createElement("div");
        memberCard.className = "member-card";

        // Store the book ISBN
        memberCard.dataset.memberId = member.id;


        // Build the card
        memberCard.innerHTML = `
            <h3>${member.name}</h3>
            <p><strong>email:</strong> ${member.email}</p>
            <p><strong>membershipType:</strong> ${member.membershipType}</p>
        `;
        memberCard.addEventListener("click", (event) => {
            event.preventDefault();
            handleMemberClick(event);
        })
        fragment.appendChild(memberCard);
    });

    membersList.append(fragment);
}

function handleReturnSubmit(event) {
    event.preventDefault();

    const memberIdInput = document.getElementById("return-member-id");
    const isbnInput = document.getElementById("return-isbn");

    const memberId = memberIdInput.value.trim();
    const isbn = isbnInput.value.trim();

    if (!memberId || !isbn) {
        alert("Please enter both Member ID and ISBN.");
        return;
    }

    try {
        const success = returnBook(memberId, isbn);

        if (success) {
            saveToLocalStorage();

            alert("Book returned successfully.");

            event.target.reset();

            renderBookCatalogue([...books.values()]);
            updateStatisticsDisplay();
        } else {
            alert("Unable to return the book. Please check the Member ID and ISBN.");
        }
    } catch (error) {
        console.error("Return operation failed:", error);
        alert("An unexpected error occurred. Please try again later.");
    }
}

function handleBorrowSubmit(event) {
    // Prevent page refresh
    event.preventDefault();

    const memberIdInput = document.getElementById("borrow-member-id");
    const isbnInput = document.getElementById("borrow-isbn");

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
            updateStatisticsDisplay();
            renderBookCatalogue([...books.values()]);
            saveToLocalStorage();

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

    // Get the book ISBN from the data attribute
    const bookISBN = bookElement.dataset.bookISBN;

    // Validate the ISBN
    if (!bookISBN) {
        console.error("Book ISBN not found.");
        return;
    }
    hideAllSections();
    bookDetails.style.display = 'block';
    displayBookDetails(bookISBN);
}

function handleMemberClick(event) {
    // Find the nearest member card that was clicked
    const bookElement = event.target.closest(".member-card");

    // Ignore clicks outside of a member card
    if (!bookElement) {
        return;
    }

    // Get the member ID from the data attribute
    const memberId = bookElement.dataset.memberId;

    // Validate the ID
    if (!memberId) {
        console.error("member ID not found.");
        return;
    }
    hideAllSections();
    memberDetails.style.display = 'block';
    displayMemberDetails(memberId);
}

function handleSearch(event) {
    // Normalize the search term
    const searchTerm = event.target.value.trim().toLowerCase();

    // Show all books if the search box is empty
    if (searchTerm === "") {
        renderBookCatalogue([...books.values()]);
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

function displayMemberDetails(id) {
    const member = findMemberById(id);

    if (!member) {
        console.error("Member not found.");
        return false;
    }

    const detailsContainer = document.getElementById("member-details");

    if (!detailsContainer) {
        console.error("Member details container not found.");
        return false;
    }

    let memberBorrowedBooks;

    if(member.borrowedBooks.length === 0){
        memberBorrowedBooks = `None`;
    }else{
        const book = member.borrowedBooks.map(book => `<li>${book}</li>`).join("");
        memberBorrowedBooks = `<ul>${book}</ul>`
    }

    detailsContainer.innerHTML = `
        <div class="member-details">
            <h2>${member.name}</h2>
            <p><strong>email:</strong> ${member.email}</p>
            <p><strong>ID:</strong> ${member.id}</p>
            <p><strong>JoinDate:</strong> ${member.joinDate}</p>
            <p><strong>MembershipType:</strong> ${member.membershipType}</p>
            <p><strong>BorrowedBooks:</strong>${memberBorrowedBooks}</p>
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

    const borrowedBooksEl = document.querySelector(".books-borrowed");
    if(borrowedBooksEl){
        const borrowedBooks = [...books.values()]
            .filter(book => book.availableCopies < book.totalCopies).length;
        borrowedBooksEl.textContent = borrowedBooks;
    }

    
}        
function createMemberForm() {

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
    memberIdLabel.setAttribute("for", "new-member-id");
    memberIdLabel.textContent = "Member ID";

    const memberIdInput = document.createElement("input");
    memberIdInput.type = "text";
    memberIdInput.id = "new-member-id";
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
    form.addEventListener("submit", handleCreateMember);
    formContainer.appendChild(form);
    
}

function hideAllSections() {
    bookDetails.style.display = "none";
    memberDetails.style.display = 'none';
    catalogueContainer.style.display = "none";
    controls.style.display = "none";
    borrowSection.style.display = "none";
    returnSection.style.display = "none";
    memberSection.style.display = "none";
    statisticsSection.style.display = "none";
}

function displayCatalogue() {
    hideAllSections();

    catalogueContainer.style.display = "grid";
    controls.style.display = "block";
}

function displayBorrow() {
    hideAllSections();

    borrowSection.style.display = "block";
}

function displayReturn(){
    hideAllSections();

    returnSection.style.display = "block";
}

function displayMembers() {
    hideAllSections();

    memberSection.style.display = "block";
    renderMembers(members);
}

function displayStatistics() {
    hideAllSections();

    statisticsSection.style.display = "block";
    updateStatisticsDisplay();
}

function displayAddMemberForm() {
    const formVisible = formContainer.style.display === "block";

    if (formVisible) {
        formContainer.style.display = "none";
        membersList.style.display = "block";
        createMemberToggle.textContent = "Add Member";
    } else {
        formContainer.style.display = "block";
        membersList.style.display = "none";
        createMemberToggle.textContent = "View Members";
        createMemberForm();
    }
}

export function handleCreateMember(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const id = document.getElementById("new-member-id").value.trim();
    const membershipType = document.getElementById("membership-type").value;

    if (!name || !email || !id || !membershipType) {
        alert("Please fill in all fields.");
        return;
    }
    

    try {
        let member;
        if (membershipType === "premium") {
            member = new PremiumMember(id, name, email);
        } else {
            member = new Member(id, name, email);
        }
        consol.log(member.constructor.name);

        addMultipleMembers(member);
        saveToLocalStorage();
        
        alert("Member added successfully.");
        event.target.reset();

        renderMembers(members);

    } catch(error) {
        console.error(error.message);
    }
}

function cacheDom(){
    catalogueContainer = document.querySelector("#catalogue-list");
    membersList = document.querySelector("#member-list");
    borrowSection = document.querySelector("#borrow-section");
    returnSection = document.querySelector("#return-section");
    memberSection = document.querySelector("#member-section");
    statisticsSection = document.querySelector("#statistics-section");
    controls = document.querySelector(".controls");
    bookDetails = document.querySelector("#book-details");
    memberDetails = document.querySelector("#member-details");
    catalogueTab = document.querySelector("#catalogue-tab");
    membersTab = document.querySelector("#members-tab");
    statisticsTab = document.querySelector("#statistics-tab");
    borrowBookBtn = document.querySelector("#borrow-book");
    returnBookBtn = document.querySelector("#return-book")
    searchInput = document.getElementById("search");
    filterDropdown = document.querySelector("#filter-category");
    createMemberToggle = document.querySelector("#create-member");
    formContainer = document.getElementById("member-form");
}

function validateDom(){
    // Check that all required elements exist 
    if (!catalogueContainer 
        || !searchInput 
        || !filterDropdown
        || !catalogueContainer
        || !borrowSection
        || !memberSection
        || !statisticsSection
        || !controls
        || !bookDetails
        || !catalogueTab
        || !membersTab
        || !statisticsTab
        || !borrowBookBtn
        || !membersList
        || !createMemberToggle
        || !returnSection
        || !memberDetails) {
        throw new Error("Required DOM elements not found.");
    }
}
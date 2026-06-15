let books = [];
let members = [];

const LATE_FEE_PER_DAY = 0.50;
const MAX_BOOKS_PER_MEMBER = 5;

const ERROR_MESSAGES = {
    invalidString: value =>  `Expected a string value: ${value}`,
    invalidNumber: value =>  `Expected an integer value: ${value}`,
    instanceError: value =>  `Expected instance of ${value}`,
    invalidId: id => `Member with ID: ${id} not found.`,
    invalidIsbn: isbn => `Book with ISBN: ${isbn} not found.`,
    invalidArray: value => `${value} must be an array.`,
};

// Represents a single book in the library system
class Book {
    constructor(isbn, title, author, year, copies) {
        verifyString(isbn, title, author);
        verifyNumber(year, copies);

        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.year = year;

        // Inventory tracking
        this.availableCopies = copies;
        this.totalCopies = copies;

        // Tracks member IDs who currently borrowed this book
        this.checkedOut = [];
    }

    // Checks if at least one copy is available for borrowing
    checkAvailability() {
        return this.availableCopies > 0;
    }

    // Returns formatted book information for display purposes
    getBookInfo() {
        return formatBookInfo(this);
    }

    // Handles borrowing logic for a member
    checkOut(memberId) {
        // Digital book class with inheritance problems
        verifyString(memberId)

        // Prevent checkout if no copies are available
        if (!this.checkAvailability()) return false;
        
        this.availableCopies--; // update inventory

        this.checkedOut.push(memberId); // track borrower
        return true;
    }
}

// Represents a digital book with download tracking and custom checkout behavior
class DigitalBook extends Book {
    constructor(isbn, title, author, year, fileSize, format) {
        verifyString(isbn, title, author, format)
        verifyNumber(year, fileSize);
        super(isbn, title, author, year, 1);

        this.fileSize = fileSize;
        this.format = format;
        this.downloads = 0;
    }
    
    // Records a download instead of reducing available copies
    download(memberId) {
        verifyString(memberId)
         
        this.downloads++;
        return true;
    }

    // Overrides physical book checkout behavior for digital books
    checkOut(memberId){
        return this.download(memberId)
    }
}

// Represents a member class
class Member {
    constructor(id, name, email, membershipType) {
        verifyString(id, name, email, membershipType); 

        this.id = id;
        this.name = name;
        this.email = email;
        this.membershipType = membershipType;
        this.borrowedBooks = [];
        this.joinDate = new Date();
    }
    
    // calculate membership duration
    membershipDuration(){
        const today = new Date();

        const differenceInMs = today - this.joinDate;
        const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
         
        return days
    }

    // returns updated member info
    getUpdatedMemberInfo(updates){    
        return updateMemberInfo(this, updates);
    }
    
    canBorrow() { 
        if (this.borrowedBooks.length >= MAX_BOOKS_PER_MEMBER) { 
            return false; 
        } 
        return true; 
    }
}

// Premium member with inheritance issues
class PremiumMember extends Member {
    constructor(id, name, email) {
        super(id, name, email, "premium");
        // Missing: additional premium benefits properties
    }
    
    // Should override canBorrow to allow more books
}

// Complex function with nested loops and errors
function findOverdueBooks(daysOverdue) {
    let overdue = [];
    
    // Inefficient nested loops - should be optimized
    for (let i = 0; i < books.length; i++) {
        for (let j = 0; j < books[i].checkedOut.length; j++) {
            // Missing: actual date checking logic
            // Wrong variable scoping
            let checkoutRecord = books[i].checkedOut[j];
            overdue.push(checkoutRecord);
        }
    }

    books.filter(book => {

    })
    
    return overdue;
}

// Processes each item in the return queue
function processReturnQueue(queue) {

    if (!Array.isArray(queue)) {
        throw new Error(ERROR_MESSAGES.invalidArray('queue'));
    }

    let index = 0;

    while (index < queue.length) {
        const item = queue[index];

        console.log(`Processing return: ${item}`);

        index++;
    }
}

// Recursive function with multiple errors
function searchBooksByCategory(bookList, category, index) {
    // Missing: base case
    // Missing: undefined/null checks
    // Wrong comparison
    
    if (bookList[index].category === category) {
        return [bookList[index]].concat(searchBooksByCategory(bookList, category, index + 1));
    }
    
    return searchBooksByCategory(bookList, category, index + 1);
}

// Returns all books by author
function getBooksByAuthor(authorName) {
    verifyString(authorName);
    return books.filter(book => book.author === authorName);
}

// Function that should use reduce
function calculateTotalLateFees(memberRecord) {
    let total = 0;
    
    // Should use reduce on array
    for (let i = 0; i < memberRecord.overdueBooks.length; i++) {
        total = total + memberRecord.overdueBooks[i].daysLate * LATE_FEE_PER_DAY;
    }
    
    return memberRecord.redu;
}

// Function missing spread operator
function combineBookCollections(fiction, nonFiction, reference) {
    // Should use spread operator
    let combined = [];
    
    for (let i = 0; i < fiction.length; i++) combined.push(fiction[i]);
    for (let i = 0; i < nonFiction.length; i++) combined.push(nonFiction[i]);
    for (let i = 0; i < reference.length; i++) combined.push(reference[i]);
    
    return combined;
}

// Adds multiple books to the library collection
function addMultipleBooks(...booksArr) {
    booksArr.forEach(book => {
        if(!(book instanceof Book)){
            throw new Error(ERROR_MESSAGES.instanceError('Book'));
        }
        books.push(book)
    });
}

// Updates member info safely without overwriting missing fields
function updateMemberInfo(member, updates) {

    const { name, email, membershipType } = updates;

    if (name !== undefined) member.name = name;
    if (email !== undefined) member.email = email;
    if (membershipType !== undefined) member.membershipType = membershipType;

    return member;
}

// Borrows a book for a member
function borrowBook(memberId, isbn) {

    try {
        verifyString(memberId, isbn);
        
        const member = findMemberById(memberId);
        const book = findBookByISBN(isbn);

        if(!member.canBorrow())return false;
        if(!book.checkOut(memberId)) return false;

        member.borrowedBooks.push(isbn);
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }

}

// Finds a member by ID and throws an error if not found
function findMemberById(id) {
    verifyString(id);

    const member = members.find(member => member.id === id);

    if (!member) {
        throw new Error(ERROR_MESSAGES.invalidId(id));
    }

    return member;
}

// Finds a book by ISBN and throws an error if not found
function findBookByISBN(isbn) {
    verifyString(isbn);

    const book = books.find(book => book.isbn === isbn);
    
    if(!book){
        throw new Error(ERROR_MESSAGES.invalidIsbn(isbn))
    }

    return book;
}

// Statistics object with missing methods
let LibraryStats = {
    totalBooks: 0,
    totalMembers: 0,
    totalBorrowings: 0,
    
    // Missing: method using Math object for calculations
    // Missing: method using for-of loop
    // Missing: method returning object with destructuring
    
    updateStats: function() {
        this.totalBooks = books.length;
        this.totalMembers = members.length;
    },
    
    getMostPopularBook: function() {
        // Inefficient implementation - should use reduce
        let maxCheckouts = 0;
        let popularBook = null;
        
        for (let i = 0; i < books.length; i++) {
            if (books[i].checkedOut.length > maxCheckouts) {
                maxCheckouts = books[i].checkedOut.length;
                popularBook = books[i];
            }
        }
        
        return popularBook;
    }
};

// Creates a formatted summary of a book's details
function formatBookInfo(book) {

    let info = 
        `
        TITLE: ${book.title.toUpperCase()}
        AUTHOR: ${book.author.toUpperCase()}
        YEAR: ${book.year}
        `.trim();
    
    return info;
}

// Function with number/type issues
function calculateFineAmount(daysLate) {
    // Missing: typeof check
    // Missing: NaN handling
    // Missing: null/undefined check
    
    let fine = daysLate * LATE_FEE_PER_DAY;
    
    // Should use toFixed for currency
    return fine;
}

// Validates that all provided values are strings
function verifyString(...strings){
    strings.forEach(string => {
        if( typeof string !== 'string' ){
            throw new Error(ERROR_MESSAGES.invalidString(string));
        }
    });
}

// Validates that all provided values are integers
function verifyNumber(...numbers){
    numbers.forEach(number => {
        if( typeof number !== 'number' || !Number.isInteger(number) || number < 0){
            throw new Error(ERROR_MESSAGES.invalidNumber(number));
        }
    });
}

// Missing: module exports
// Missing: proper data structure for ISBN lookups (Map/Set)

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
    invalidObject: "Expected an object."
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
    
    // checks if member can borrow
    canBorrow() { 
        return this.borrowedBooks.length < MAX_BOOKS_PER_MEMBER;     
    }
}

// Represents a Premium member class
class PremiumMember extends Member {
    constructor(id, name, email) {
        verifyString(id, name, email);

        super(id, name, email, "premium");
        this.maxBooks = 15;
    }
    
    // checks if premium member is able to borrow
    canBorrow(){
        return this.borrowedBooks.length < this.maxBooks;
    }
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

    verifyArray(queue);

    let index = 0;

    while (index < queue.length) {
        const item = queue[index];

        console.log(`Processing return: ${item}`);

        index++;
    }
}

// Recursive function with multiple errors
function searchBooksByCategory(bookList, category, index=0) {

    verifyArray(bookList);
    verifyString(category);
    verifyNumber(index);

    if(index >= bookList.length){
        return [];
    }
    
    if (bookList[index].category === category) {
        return [
            bookList[index], ...searchBooksByCategory(bookList, category, index + 1)
        ];
    }
    
    return searchBooksByCategory(bookList, category, index + 1);
}

// Returns all books by author
function getBooksByAuthor(authorName) {
    verifyString(authorName);
    return books.filter(book => book.author === authorName);
}

// Calculates the total late fees for a member
function calculateTotalLateFees(memberRecord) {
    verifyObject(memberRecord);
    
    return memberRecord.overdueBooks.reduce((total, book) => {
        total + (book.daysLate * LATE_FEE_PER_DAY), 0
    });
}

// Combines all book collections into a single array
function combineBookCollections(fiction, nonFiction, reference) {
    verifyArray(fiction, nonFiction, reference);
    return [...fiction, ...nonFiction, ...reference];
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
    verifyObject(updates);
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
    
    // calculates total borrowings using for of loop
    calculateTotalBorrowings: function(){
        let total = 0;

        for(book of books){
            total += book.checkedOut.length;
        }

        this.totalBorrowings = total;
        return total;
    },

    // Calculates borrowing avarage using Math objects
    calculateAvarageBorrowingsPerBook: function(){
        if(books.length === 0)return 0;

        return Math.round(this.totalBorrowings / books.length);
    },

    // return summary of the library stats
    getSummary: function(){
        const { totalBooks, totalMembers, totalBorrowings} = this;

        return {totalBooks, totalMembers, totalBorrowings};  
    },
    
    updateStats: function() {
        this.totalBooks = books.length;
        this.totalMembers = members.length;
    },
    
    getMostPopularBook: function() {
        // Checks for a popular book
        if (books.length === 0)return null;

        return books.reduce((previousBook, currentBook) => 
            currentBook.checkedOut.length > previousBook.checkedOut.length
         ? currentBook 
         : previousBook
        );


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

// Validates that all provided values are objects
function verifyObject(...objects) {
    objects.forEach(object => {
        if (typeof object !== 'object' || object === null) {
            throw new Error();
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

function verifyArray(...arrays) {
    arrays.forEach(array => {
        if(!Array.isArray(array)){
            throw new Error(ERROR_MESSAGES.invalidArray(array));
        }
    })
}

// Missing: module exports
// Missing: proper data structure for ISBN lookups (Map/Set)

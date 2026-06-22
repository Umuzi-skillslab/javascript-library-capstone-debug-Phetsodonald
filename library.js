let books = new Map();
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
    invalidObject: "Expected an object.",
    idDuplicateError: id => `Member with ID ${id} already exists.`,
    isbnDuplicateError: isbn => `Book with ISBN ${book.isbn} already exists.`
};

// Represents a single book in the library system
class Book {
    constructor(isbn, title, author, year, copies, category) {
        verifyString(isbn, title, author, category);
        verifyNumber(year, copies);

        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.year = year;
        this.category = category;

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

        this.checkedOut.push({memberId, borrowDate: new Date()}); // track borrower
        return true;
    }
}

// Represents a digital book with download tracking and custom checkout behavior
class DigitalBook extends Book {
    constructor(isbn, title, author, year, category, fileSize, format) {
        verifyString(isbn, title, author, format, category);
        verifyNumber(year, fileSize);
        super(isbn, title, author, year, 1, category);

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
    constructor(id, name, email, membershipType='standard') {
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

function findOverdueBooks(daysOverdue) {
    verifyNumber(daysOverdue);

    const today = new Date();

    return [...books.values()].flatMap(book =>
        book.checkedOut
            .filter(record => {
                const daysBorrowed = Math.floor(
                    (today - new Date(record.borrowDate)) /
                    (1000 * 60 * 60 * 24)
                );

                return daysBorrowed > daysOverdue;
            })
            .map(record => ({
                isbn: book.isbn,
                memberId: record.memberId,
                borrowDate: record.borrowDate
            }))
    );
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

// Searchs book by category
function searchBooksByCategory(bookList, category) {
    verifyMap(bookList);
    verifyString(category);

    return [...bookList.values()].filter(
        book => book.category === category
    );
}

// Returns all books by author
function getBooksByAuthor(authorName) {
    verifyString(authorName);
    return [...books.values()].filter(book => book.author === authorName);
}

// Calculates the total late fees for a member
function calculateTotalLateFees(memberRecord) {
    verifyObject(memberRecord);
    
    return memberRecord.overdueBooks.reduce((total, book) => {
        return total + (book.daysLate * LATE_FEE_PER_DAY);
    }, 0);
}

// Combines all book collections into a single array
function combineBookCollections(fiction, nonFiction, reference) {
    verifyArray(fiction, nonFiction, reference);
    return [...fiction, ...nonFiction, ...reference];
}

// Adds multiple books to the library collection
function addMultipleBooks(...booksArr) {
    booksArr.forEach(book => {
        if (!(book instanceof Book)) {
            throw new Error(ERROR_MESSAGES.instanceError("Book"));
        }

        if (books.has(book.isbn)) {
            throw new Error(ERROR_MESSAGES.isbnDuplicateError(book.isbn));
        }

        books.set(book.isbn, book);
    });
}

// Adds multiple Members to the library data
function addMultipleMembers(...membersArr) {
    membersArr.forEach(member => {
        if (!(member instanceof Member)) {
            throw new Error(ERROR_MESSAGES.instanceError("Member"));
        }
        checkMember(member.id)
        members.push(member);
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

    const book = books.get(isbn);
    
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

        for(const book of books.values()){
            total += book.checkedOut.length;
        }

        this.totalBorrowings = total;
        return total;
    },

    // Calculates borrowing avarage using Math objects
    calculateAverageBorrowingsPerBook: function(){
        if(books.size === 0)return 0;

        return Math.round(this.totalBorrowings / books.size);
    },

    // return summary of the library stats
    getSummary: function(){
        const { totalBooks, totalMembers, totalBorrowings} = this;

        return {totalBooks, totalMembers, totalBorrowings};  
    },
    
    updateStats: function() {
        this.totalBooks = books.size;
        this.totalMembers = members.size;
    },
    
    getMostPopularBook: function() {
        // Checks for a popular book
        if (books.size === 0)return null;

        const bookList = [...books.values()];

        return bookList.reduce((previousBook, currentBook) => 
            currentBook.checkedOut.length > previousBook.checkedOut.length
         ? currentBook 
         : previousBook
        );


    }
};

// Creates a formatted summary of a book's details
function formatBookInfo(book) {
        return `TITLE: ${book.title.toUpperCase()}
    AUTHOR: ${book.author.toUpperCase()}
    YEAR: ${book.year}`.trim();

}

// Calculates fine amount
function calculateFineAmount(daysLate) {

    verifyNumber(daysLate);
    
    const fine = daysLate * LATE_FEE_PER_DAY;
    
    return Number(fine.toFixed(2));
}

// Validates that all provided values are strings
function verifyString(...strings){
    strings.forEach(string => {
        if( typeof string !== 'string' ){
            throw new Error(ERROR_MESSAGES.invalidString(string));
        }
    });
}

function checkMember(memberId) {
    const memberExists = members.some(member => member.id === memberId);

    if (memberExists) {
        throw new Error(ERROR_MESSAGES.idDuplicateError(memberId));
    }
}

// Validates that all provided values are objects
function verifyObject(...objects) {
    objects.forEach(object => {
        if (typeof object !== 'object' || object === null) {
            throw new Error(ERROR_MESSAGES.invalidObject);
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

function verifyMap(...maps) {
    maps.forEach(map => {
        if (!(map instanceof Map)) {
            throw new Error(ERROR_MESSAGES.instanceError("Map"));
        }
    });
}


module.exports = {
    Book,
    DigitalBook,
    Member,
    PremiumMember,
    borrowBook,
    LibraryStats,
    ERROR_MESSAGES
};

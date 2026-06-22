const {verifyString, verifyNumber, findBookByISBN, formatBookInfo, updateMemberInfo} = require('./utils')

let books = new Map();
let members = [];

const LATE_FEE_PER_DAY = 0.50;
const MAX_BOOKS_PER_MEMBER = 5;

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





module.exports = {
    Book,
    DigitalBook,
    Member,
    PremiumMember,
    LibraryStats,
};

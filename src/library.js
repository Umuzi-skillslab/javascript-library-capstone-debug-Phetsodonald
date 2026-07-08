import { verifyString, verifyNumber, formatBookInfo, updateMemberInfo } from './utils.js';
import { LATE_FEE_PER_DAY, MAX_BOOKS_PER_MEMBER } from './constants.js';



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

        this.availableCopies = copies;
        this.totalCopies = copies;

        this.checkedOut = [];
    }

    checkAvailability() {
        return this.availableCopies > 0;
    }

    getBookInfo() {
        return formatBookInfo(this);
    }

    checkOut(memberId) {
        verifyString(memberId);

        if (!this.checkAvailability()) return false;

        this.availableCopies--;

        this.checkedOut.push({ memberId, borrowDate: new Date() });
        return true;
    }
}


// Digital Book
class DigitalBook extends Book {
    constructor(isbn, title, author, year, category, fileSize, format) {
        verifyString(isbn, title, author, format, category);
        verifyNumber(year, fileSize);

        super(isbn, title, author, year, 1, category);

        this.fileSize = fileSize;
        this.format = format;
        this.downloads = 0;
    }

    download(memberId) {
        verifyString(memberId);
        this.downloads++;
        return true;
    }

    checkOut(memberId) {
        return this.download(memberId);
    }
}


// Member
class Member {
    constructor(id, name, email, membershipType = 'standard') {
        verifyString(id, name, email, membershipType);

        this.id = id;
        this.name = name;
        this.email = email;
        this.membershipType = membershipType;
        this.borrowedBooks = [];
        this.joinDate = new Date();
    }

    membershipDuration() {
        const today = new Date();
        const diff = today - this.joinDate;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    getUpdatedMemberInfo(updates) {
        return updateMemberInfo(this, updates);
    }

    canBorrow() {
        return this.borrowedBooks.length < MAX_BOOKS_PER_MEMBER;
    }
}


// Premium Member
class PremiumMember extends Member {
    constructor(id, name, email) {
        verifyString(id, name, email);

        super(id, name, email, "premium");
        this.maxBooks = 15;
    }

    canBorrow() {
        return this.borrowedBooks.length < this.maxBooks;
    }
}


export {
    Book,
    DigitalBook,
    Member,
    PremiumMember,
};
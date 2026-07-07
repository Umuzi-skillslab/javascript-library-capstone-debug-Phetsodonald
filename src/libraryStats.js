import { books, members } from'./storage';

// Library Stats
let LibraryStats = {
    totalBooks: 0,
    totalMembers: 0,
    totalBorrowings: 0,

    calculateTotalBorrowings: function () {
        let total = 0;

        for (const book of books.values()) {
            total += book.checkedOut.length;
        }

        this.totalBorrowings = total;
        return total;
    },

    calculateAverageBorrowingsPerBook: function () {
        if (books.size === 0) return 0;
        return Math.round(this.totalBorrowings / books.size);
    },

    getSummary: function () {
        const { totalBooks, totalMembers, totalBorrowings } = this;
        return { totalBooks, totalMembers, totalBorrowings };
    },

    updateStats: function () {
        this.totalBooks = books.size;
        this.totalMembers = members.length;
    },

    getMostPopularBook: function () {
        if (books.size === 0) return null;

        const bookList = [...books.values()];

        return bookList.reduce((prev, curr) =>
            curr.checkedOut.length > prev.checkedOut.length ? curr : prev
        );
    }
};


export {
    LibraryStats
};
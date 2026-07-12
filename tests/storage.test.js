import { 
    books, 
    members, 
    saveToLocalStorage,
    loadFromLocalStorage,
    loadData,
    exportLibraryData,
    importLibraryData
} from "../src/storage.js";

describe("Storage Management", () => {

    beforeEach(() => {
        localStorage.clear();
        books.clear();
        members.length = 0;
    });


    test("should load default library data", () => {
        const result = loadData();

        expect(result).toBe(true);

        expect(books.size).toBeGreaterThan(0);
        expect(members.length).toBeGreaterThan(0);
    });


    test("should save library data to localStorage", () => {
        loadData();

        const result = saveToLocalStorage();

        expect(result).toBe(true);

        expect(localStorage.getItem("libraryBooks"))
            .not.toBeNull();

        expect(localStorage.getItem("libraryMembers"))
            .not.toBeNull();
    });


    test("should load library data from localStorage", () => {
        loadData();
        saveToLocalStorage();

        books.clear();
        members.length = 0;


        const result = loadFromLocalStorage();


        expect(result).toBe(true);

        expect(books.size).toBeGreaterThan(0);
        expect(members.length).toBeGreaterThan(0);
    });


    test("should return false when localStorage data is missing", () => {
        const result = loadFromLocalStorage();

        expect(result).toBe(false);

        expect(books.size).toBe(0);
        expect(members.length).toBe(0);
    });


    test("should handle invalid localStorage JSON", () => {
        localStorage.setItem(
            "libraryBooks",
            "invalid json"
        );

        localStorage.setItem(
            "libraryMembers",
            "invalid json"
        );


        const result = loadFromLocalStorage();


        expect(result).toBe(false);
    });


    test("should restore book properties after loading", () => {
        loadData();
        saveToLocalStorage();

        books.clear();

        loadFromLocalStorage();


        const firstBook = [...books.values()][0];


        expect(firstBook.isbn).toBeDefined();
        expect(firstBook.title).toBeDefined();
        expect(firstBook.availableCopies)
            .toBeDefined();
    });

    test("should export library data as JSON", () => {
        loadData();

        const result = exportLibraryData();

        const parsed = JSON.parse(result);

        expect(parsed.books.length).toBeGreaterThan(0);
        expect(parsed.members.length).toBeGreaterThan(0);
    });


    test("should reject invalid imported data", () => {
        const result = importLibraryData("{}");

        expect(result).toBe(false);
    });

    test("should export books and members as arrays", () => {
        loadData();

        const result = exportLibraryData();

        const parsed = JSON.parse(result);

        expect(Array.isArray(parsed.books)).toBe(true);
        expect(Array.isArray(parsed.members)).toBe(true);
    });

    test("should import valid library data", () => {
        loadData();

        const exportedData = exportLibraryData();

        books.clear();
        members.length = 0;


        const result = importLibraryData(exportedData);


        expect(result).toBe(true);

        expect(books.size).toBeGreaterThan(0);
        expect(members.length).toBeGreaterThan(0);
    });

    test("should reject malformed JSON during import", () => {
        const result = importLibraryData("invalid json");

        expect(result).toBe(false);

        expect(books.size).toBe(0);
        expect(members.length).toBe(0);
    });

    test("should reject imported data without required fields", () => {
        const invalidData = JSON.stringify({
            books: []
        });


        const result = importLibraryData(invalidData);


        expect(result).toBe(false);
    });

});
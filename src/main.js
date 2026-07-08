import { initializeUI } from "./ui.js";
import { loadFromLocalStorage, loadData, saveToLocalStorage } from "./storage.js";

async function startApp() {

    const hasLocalData = loadFromLocalStorage();

    if (!hasLocalData) {
        await loadData();
        saveToLocalStorage();
    }

    initializeUI();
}

startApp();
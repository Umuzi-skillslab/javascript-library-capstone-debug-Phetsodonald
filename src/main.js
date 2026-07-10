import { initializeUI } from "./ui.js";
import {
    loadData,
    loadFromLocalStorage,
    saveToLocalStorage
} from "./storage.js";

export function startApp() {
    try {
        let loaded = loadFromLocalStorage();

        if (!loaded) {
            loaded = loadData();

            if (loaded) {
                saveToLocalStorage();
            }
        }

        initializeUI();

    } catch (error) {
        console.error("Failed to start application:", error);
    }
}

startApp();
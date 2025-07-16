/**
 * @author Jörn Kreutel
 * MWF1: Listenansicht mit MediaItems und Künstlern
 * MWF2: Aktionsmenü für Listenelemente
 * MWF3: Dialog zur Erstellung und Modifikation
 * FINALE VERSION - ALLE PROBLEME BEHOBEN
 */
import {mwf} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";

export default class MyInitialViewController extends mwf.ViewController {

    args;
    root;
    currentView = "medien";
    artistsData = null;
    currentDialogItem = null;
    isEditMode = false;

    constructor() {
        super();
    }

    async oncreate() {
        this.root.innerHTML = `
            <header class="mwf-top">
                <h1>
                    <span class="mwf-icon-bars" id="toggleBtn"></span>
                    <span id="headerTitle">Medien</span>
                </h1>
                <button class="mwf-icon-plus" id="addBtn"></button>
            </header>
            
            <main class="mwf-scrollcontainer">
                <ul class="mwf-listview" id="itemsList">
                </ul>
            </main>
            
            <!-- MWF2: Dialog für Aktionsmenü -->
            <div id="actionDialog" class="dialog-overlay" style="display: none;">
                <div class="dialog-content">
                    <h3 id="dialogTitle"></h3>
                    <div class="dialog-actions">
                        <button id="deleteBtn" class="dialog-btn delete-btn">Löschen</button>
                        <button id="editBtn" class="dialog-btn edit-btn">Editieren</button>
                    </div>
                </div>
            </div>
            
            <!-- MWF3: Dialog für Textfeld-Eingabe -->
            <div id="textDialog" class="dialog-overlay" style="display: none;">
                <div class="dialog-content">
                    <h3 id="textDialogTitle">NEUES MEDIUM</h3>
                    <div class="text-input-container">
                        <input type="text" id="titleInput" placeholder="Titel eingeben..." maxlength="50">
                    </div>
                    <div class="dialog-actions">
                        <button id="cancelBtn" class="dialog-btn cancel-btn">Abbrechen</button>
                        <button id="saveBtn" class="dialog-btn save-btn">Hinzufügen</button>
                    </div>
                </div>
            </div>
            
            <footer class="mwf-bottom">
            </footer>
            
            <!-- MWF4: Leseansicht -->
<div id="readingView" class="reading-view" style="display: none;">
    <header class="mwf-top">
        <h1>
            <span class="mwf-icon-arrow-back" id="backBtn"></span>
            <span id="readingTitle">MediaItem Titel</span>
        </h1>
        <button class="mwf-icon-delete" id="deleteInReadingBtn"></button>
    </header>
    
    <main class="reading-main">
        <img id="readingImage" src="" alt="" class="reading-image">
    </main>
</div>
        `;

        // MWF1: Event Listener für Sandwich-Icon (Toggle)
        const toggleBtn = this.root.querySelector('#toggleBtn');
        toggleBtn.addEventListener('click', () => {
            this.toggleView();
        });

        // MWF3: Event Listener für + Button (öffnet Textfeld-Dialog)
        const addBtn = this.root.querySelector('#addBtn');
        addBtn.addEventListener('click', () => {
            if (this.currentView === "medien") {
                this.showTextDialog('create'); // MWF3!
            }
        });

        this.setupDialogListeners();

        await this.loadArtistsData();

        await this.createTestDataIfNeeded();

        await this.loadCurrentView();

        super.oncreate();
    }

    // ========== MWF1: NAVIGATION FUNKTIONEN ==========

    // MWF1: Künstler-Daten aus JSON laden
    async loadArtistsData() {
        try {
            const response = await fetch('data/artists.json');
            this.artistsData = await response.json();
        } catch (error) {
            console.error("Error loading artists data:", error);
            // Fallback zu statischen Daten
            this.artistsData = [
                {
                    img: "img/img7.png",
                    artist: "Scrambles, Anthems and...",
                    songCount: "12 SONGS",
                    date: "23. OKTOBER 2015"
                },
                {
                    img: "img/img8.png",
                    artist: "Das ewige Leben (Original...",
                    songCount: "17 SONGS",
                    date: "27. FEBRUAR 2015"
                },
                {
                    img: "img/img1.png",
                    artist: "Superluminal",
                    songCount: "10 SONGS",
                    date: "14. SEPTEMBER 2012"
                },
                {
                    img: "img/img2.png",
                    artist: "Blindside",
                    songCount: "9 SONGS",
                    date: "26. MÄRZ 2010"
                },
                {
                    img: "img/img3.png",
                    artist: "Sofa Surfers",
                    songCount: "10 SONGS",
                    date: "28. OKTOBER 2005"
                },
                {
                    img: "img/img4.png",
                    artist: "Encounters",
                    songCount: "13 SONGS",
                    date: "30. NOVEMBER 2001"
                },
                {
                    img: "img/img5.png",
                    artist: "Constructions",
                    songCount: "14 SONGS",
                    date: "30. NOVEMBER 1999"
                },
                {
                    img: "img/img1.png",
                    artist: "Prelude & Fugue",
                    songCount: "8 SONGS",
                    date: "15. APRIL 2018"
                }
            ];
        }
    }

    // MWF1: Toggle zwischen Medien und Künstler
    toggleView() {
        if (this.currentView === "medien") {
            this.currentView = "künstler";
            this.root.querySelector('#headerTitle').textContent = "KÜNSTLER";
        } else {
            this.currentView = "medien";
            this.root.querySelector('#headerTitle').textContent = "Medien";
        }
        this.loadCurrentView();
    }

    // MWF1: Lädt die aktuelle Ansicht - VERBESSERT
    async loadCurrentView() {
        try {
            console.log('🔄 Loading current view:', this.currentView);

            const list = this.root.querySelector("#itemsList");
            list.innerHTML = "";

            const addBtn = this.root.querySelector('#addBtn');
            if (addBtn) {
                if (this.currentView === "medien") {

                    addBtn.style.display = 'block';
                    addBtn.style.visibility = 'visible';
                    console.log('✅ + Button made visible for Medien view');
                } else {

                    addBtn.style.display = 'none';
                    console.log('🔒 + Button hidden for Künstler view');
                }
            }

            if (this.currentView === "medien") {
                await this.loadMediaItems();
            } else {
                this.loadArtists();
            }

            console.log('✅ Current view loaded:', this.currentView);

        } catch (error) {
            console.error('❌ Error loading current view:', error);
        }
    }

    // ========== MWF1: MEDIEN FUNKTIONEN (IndexedDB) ==========

    async loadMediaItems() {
        try {
            const items = await this.readFromIndexedDB();
            console.log('🔍 Items loaded from IndexedDB:', items.length, items);
            this.displayMediaItems(items);
        } catch (error) {
            console.error("Error loading MediaItems:", error);
        }
    }

    displayMediaItems(items) {
        const list = this.root.querySelector("#itemsList");
        list.innerHTML = "";
        list.classList.remove("artist-view");

        items.forEach(item => {
            const li = document.createElement("li");
            li.className = "mwf-listitem";

            li.setAttribute("data-mwf-id", item.id);

            li.innerHTML = `
            <img src="${item.src}" alt="${item.title}" class="mwf-img-listitem">
            <div class="mwf-listitem-content">
                <h3>${item.title}</h3>
                <p>${new Date(item.created).toLocaleDateString()}</p>
            </div>
            <button class="mwf-icon-more-vert" data-item-id="${item.id}" data-type="media"></button>
        `;

            li.addEventListener('click', (event) => {
                if (!event.target.classList.contains('mwf-icon-more-vert')) {
                    event.stopPropagation();
                    this.showReadingView(item);
                }
            });

            const optionsBtn = li.querySelector('.mwf-icon-more-vert');
            optionsBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                this.showDialog(item, 'media');
            });

            list.appendChild(li);
        });
    }
    // ========== MWF1: KÜNSTLER FUNKTIONEN (JSON-Daten) ==========

    loadArtists() {
        if (this.artistsData) {
            this.displayArtists(this.artistsData);
        }
    }

    displayArtists(artists) {
        const list = this.root.querySelector("#itemsList");
        list.innerHTML = "";
        list.classList.add("artist-view");

        artists.forEach((artist, index) => {
            const li = document.createElement("li");
            li.className = "mwf-listitem";
            li.setAttribute("data-mwf-id", index);
            li.innerHTML = `
                <img src="${artist.img}" alt="${artist.artist}" class="mwf-img-listitem">
                <div class="mwf-listitem-content">
                    <h3>${artist.artist}</h3>
                    <p>${artist.songCount} • ${artist.date}</p>
                </div>
                <button class="mwf-icon-more-vert" data-item-id="${index}" data-type="artist"></button>
            `;

            const optionsBtn = li.querySelector('.mwf-icon-more-vert');
            optionsBtn.addEventListener('click', (event) => {
                this.showDialog(artist, 'artist');
            });

            list.appendChild(li);
        });
    }

    // ========== MWF1: INDEXEDDB FUNKTIONEN (nur für MediaItems) ==========

    async readFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("mwftutdb", 1);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;

                if (!db.objectStoreNames.contains("MediaItem")) {
                    db.createObjectStore("MediaItem", { keyPath: "id" });
                }
            };


            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(["MediaItem"], "readonly");
                const store = transaction.objectStore("MediaItem");
                const getAll = store.getAll();

                getAll.onsuccess = () => {
                    resolve(getAll.result);
                };

                getAll.onerror = () => {
                    reject(getAll.error);
                };
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async writeToIndexedDB(item) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("mwftutdb", 1);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("MediaItem")) {
                    db.createObjectStore("MediaItem", { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(["MediaItem"], "readwrite");
                const store = transaction.objectStore("MediaItem");

                if (item.created && !item.id) {
                    item.id = item.created;
                } else if (!item.id) {

                    const timestamp = Date.now();
                    item.id = timestamp;
                    item.created = timestamp;
                }

                console.log('💾 Saving item with ID:', item.id, 'created:', item.created);

                const add = store.add(item);
                add.onsuccess = () => {
                    resolve(item);
                };
                add.onerror = () => {
                    reject(add.error);
                };
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // MWF1: Test-Daten erstellen - VERBESSERT mit nur vorhandenen Bildern
    async createTestDataIfNeeded() {
        try {
            const existingItems = await this.readFromIndexedDB();
            if (existingItems.length === 0) {
                const testItems = [
                    {
                        title: "Albumcover 1",
                        src: "img/img1.png",
                        created: Date.now() - 86400000,
                        id: Date.now() - 86400000
                    },
                    {
                        title: "Albumcover 2",
                        src: "img/img2.png",
                        created: Date.now() - 172800000,
                        id: Date.now() - 172800000
                    },
                    {
                        title: "Albumcover 3",
                        src: "img/img3.png",
                        created: Date.now() - 259200000,
                        id: Date.now() - 259200000
                    },
                    {
                        title: "Musiksammlung",
                        src: "img/img4.png",
                        created: Date.now() - 345600000,
                        id: Date.now() - 345600000
                    },
                    {
                        title: "Vinyl Collection",
                        src: "img/img5.png",
                        created: Date.now() - 432000000,
                        id: Date.now() - 432000000
                    }
                ];

                for (let item of testItems) {
                    await this.writeToIndexedDB(item);
                }
            }
        } catch (error) {
            console.error("Error creating test data:", error);
        }
    }
    // ========== MWF2: AKTIONSMENÜ DIALOG FUNKTIONEN ==========

    setupDialogListeners() {
        const dialog = this.root.querySelector('#actionDialog');
        const deleteBtn = this.root.querySelector('#deleteBtn');
        const editBtn = this.root.querySelector('#editBtn');

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.closeDialog();
            }
        });

        deleteBtn.addEventListener('click', () => {
            this.deleteItem();
        });

        editBtn.addEventListener('click', () => {
            console.log('Edit button clicked, currentDialogItem:', this.currentDialogItem);

            if (this.currentDialogItem) {
                if (this.currentDialogItem.type === 'media') {
                    try {

                        const tempItem = {
                            item: { ...this.currentDialogItem.item },
                            type: this.currentDialogItem.type
                        };

                        console.log('Saved temp item for edit:', tempItem);
                        this.closeDialog();

                        if (tempItem.item && tempItem.item.title) {
                            this.showTextDialog('edit', tempItem);
                        } else {
                            console.error('Missing item data for edit:', tempItem);
                            alert('Fehler: Item-Daten nicht vollständig');
                        }
                    } catch (error) {
                        console.error('Error in edit handler:', error);
                        alert('Fehler beim Öffnen des Bearbeitungsdialoges');
                    }
                } else if (this.currentDialogItem.type === 'artist') {
                    alert('Künstler können nicht bearbeitet werden');
                    this.closeDialog();
                }
            } else {
                console.error('No currentDialogItem available');
                alert('Fehler: Kein Item ausgewählt');
            }
        });

        this.setupTextDialogListeners();
    }

    showDialog(item, type) {
        console.log('showDialog called with:', { item, type });

        if (!item) {
            console.error('showDialog: item is null or undefined');
            return;
        }

        this.currentDialogItem = { item, type };
        const dialog = this.root.querySelector('#actionDialog');
        const title = this.root.querySelector('#dialogTitle');

        let displayTitle;
        if (type === 'media') {
            displayTitle = item.title || 'Unbekanntes Medium';
        } else {
            displayTitle = item.artist || 'Unbekannter Künstler';
        }

        title.textContent = displayTitle;
        dialog.style.display = 'flex';

        console.log('Dialog opened for:', displayTitle);
    }

    closeDialog() {
        const dialog = this.root.querySelector('#actionDialog');
        dialog.style.display = 'none';

        setTimeout(() => {
            this.currentDialogItem = null;
        }, 50);
    }

    async deleteItem() {
        if (!this.currentDialogItem) {
            console.error('No currentDialogItem for deletion');
            return;
        }

        const { item, type } = this.currentDialogItem;

        if (type === 'media') {
            try {
                console.log('🔄 Starting deletion process for:', item);

                this.closeDialog();
                this.removeItemFromUI(item.id);
                await this.deleteFromIndexedDB(item.id);

                setTimeout(async () => {
                    await this.loadCurrentView();
                }, 1000);

                console.log('✅ Complete deletion process finished');

            } catch (error) {
                console.error('❌ Error during deletion:', error);
                await this.loadCurrentView();
                alert('Fehler beim Löschen: ' + error.message);
            }
        } else {
            alert('Künstler können nicht gelöscht werden (statische Daten)');
            this.closeDialog();
        }
    }

    // VERBESSERTE deleteFromIndexedDB
    async deleteFromIndexedDB(itemId) {
        return new Promise((resolve, reject) => {
            console.log('🔄 Starting IndexedDB deletion for ID:', itemId, typeof itemId);

            const request = indexedDB.open("mwftutdb", 1);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("MediaItem")) {
                    db.createObjectStore("MediaItem", { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(["MediaItem"], "readwrite");
                const store = transaction.objectStore("MediaItem");

                const getRequest = store.get(itemId);

                getRequest.onsuccess = () => {
                    const foundItem = getRequest.result;
                    console.log('🔍 Found item for deletion:', foundItem);

                    if (foundItem) {

                        const deleteRequest = store.delete(itemId);

                        deleteRequest.onsuccess = () => {
                            console.log('✅ Item successfully deleted from IndexedDB:', itemId);
                        };

                        deleteRequest.onerror = () => {
                            console.error('❌ Delete operation failed:', deleteRequest.error);
                            reject(deleteRequest.error);
                        };
                    } else {
                        console.warn('⚠️ Item not found in IndexedDB:', itemId);

                        resolve();
                    }
                };

                getRequest.onerror = () => {
                    console.error('❌ Error finding item:', getRequest.error);
                    reject(getRequest.error);
                };

                transaction.oncomplete = () => {
                    console.log('✅ Delete transaction completed successfully');
                    resolve();
                };

                transaction.onerror = () => {
                    console.error('❌ Delete transaction failed:', transaction.error);
                    reject(transaction.error);
                };
            };

            request.onerror = () => {
                console.error('❌ Error opening IndexedDB:', request.error);
                reject(request.error);
            };
        });
    }

    removeItemFromUI(itemId) {
        console.log('🗑️ Removing item from UI:', itemId);
        const listItem = this.root.querySelector(`[data-mwf-id="${itemId}"]`);
        if (listItem) {
            console.log('✅ UI element removed successfully');
            // Smooth Animation beim Entfernen
            listItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            listItem.style.opacity = '0';
            listItem.style.transform = 'translateX(-100%)';

            // Nach Animation komplett entfernen
            setTimeout(() => {
                if (listItem.parentNode) {
                    listItem.parentNode.removeChild(listItem);
                    console.log('✅ UI element removed successfully');
                }
            }, 300);
        } else {
            console.warn('⚠️ UI element not found for ID:', itemId);
            console.warn('Available elements:', this.root.querySelectorAll('[data-mwf-id]'));
        }
    }

    async debugShowAllItems() {
        try {
            const items = await this.readFromIndexedDB();
            console.log('📋 All items in IndexedDB (' + items.length + '):', items);
            items.forEach(item => {
                console.log(`- ID: ${item.id}, Title: ${item.title}, Created: ${new Date(item.created).toLocaleString()}`);
            });
            return items;
        } catch (error) {
            console.error('Error reading items:', error);
        }
    }

    async debugClearDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("mwftutdb", 1);
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(["MediaItem"], "readwrite");
                const store = transaction.objectStore("MediaItem");
                const clearRequest = store.clear();
                clearRequest.onsuccess = () => {
                    console.log('✅ Database cleared successfully');
                    resolve();
                };
                clearRequest.onerror = () => reject(clearRequest.error);
            };
            request.onerror = () => reject(request.error);
        });
    }


    // ========== MWF3: TEXTFELD-DIALOG FUNKTIONEN ==========

    setupTextDialogListeners() {
        const textDialog = this.root.querySelector('#textDialog');
        const cancelBtn = this.root.querySelector('#cancelBtn');
        const saveBtn = this.root.querySelector('#saveBtn');
        const titleInput = this.root.querySelector('#titleInput');

        textDialog.addEventListener('click', (e) => {
            if (e.target === textDialog) {
                this.closeTextDialog();
            }
        });

        cancelBtn.addEventListener('click', () => {
            this.closeTextDialog();
        });

        saveBtn.addEventListener('click', () => {
            this.saveTextDialogItem();
        });

        titleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveTextDialogItem();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.closeTextDialog();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const isTextDialogOpen = textDialog.style.display === 'flex';
                const isActionDialogOpen = this.root.querySelector('#actionDialog').style.display === 'flex';

                if (isTextDialogOpen) {
                    e.preventDefault();
                    this.closeTextDialog();
                } else if (isActionDialogOpen) {
                    e.preventDefault();
                    this.closeDialog();
                }
            }
        });
    }

    showTextDialog(mode = 'create', item = null) {
        console.log('showTextDialog called with mode:', mode, 'item:', item);

        this.isEditMode = mode === 'edit';
        this.currentDialogItem = item;

        const dialog = this.root.querySelector('#textDialog');
        const title = this.root.querySelector('#textDialogTitle');
        const saveBtn = this.root.querySelector('#saveBtn');
        const titleInput = this.root.querySelector('#titleInput');

        if (this.isEditMode) {
            if (item && item.item && item.item.title) {
                title.textContent = 'MEDIUM BEARBEITEN';
                saveBtn.textContent = 'Speichern';
                titleInput.value = item.item.title;
                console.log('Edit mode set up with title:', item.item.title);
            } else {
                console.error('Edit mode but no valid item data:', item);
                alert('Fehler: Keine gültigen Item-Daten für Bearbeitung');
                return;
            }
        } else {
            title.textContent = 'NEUES MEDIUM';
            saveBtn.textContent = 'Hinzufügen';
            titleInput.value = '';
            console.log('Create mode set up');
        }

        dialog.style.display = 'flex';

        setTimeout(() => {
            titleInput.focus();
            titleInput.select();
        }, 100);
    }

    closeTextDialog() {
        const dialog = this.root.querySelector('#textDialog');
        const titleInput = this.root.querySelector('#titleInput');

        dialog.style.display = 'none';
        titleInput.value = '';
        this.isEditMode = false;
        this.currentDialogItem = null;
    }

    async saveTextDialogItem() {
        const titleInput = this.root.querySelector('#titleInput');
        const title = titleInput.value.trim();

        if (!title) {
            alert('Bitte geben Sie einen Titel ein!');
            titleInput.focus();
            return;
        }

        try {
            if (this.isEditMode && this.currentDialogItem) {
                console.log('Updating item:', this.currentDialogItem.item.id, 'with title:', title);
                await this.updateMediaItem(this.currentDialogItem.item.id, title);
            } else {
                console.log('Creating new item with title:', title);
                await this.createNewMediaItemWithTitle(title);
            }

            this.closeTextDialog();
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Fehler beim Speichern!');
        }
    }

    // VERBESSERTE Erstellung neuer Items
    async createNewMediaItemWithTitle(title) {
        try {

            const availableImages = [
                "img/img1.png",
                "img/img2.png",
                "img/img3.png",
                "img/img4.png",
                "img/img5.png"
            ];

            let hash = 0;
            for (let i = 0; i < title.length; i++) {
                const char = title.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }

            const imageIndex = Math.abs(hash % availableImages.length);

            const newItem = {
                title: title,
                src: availableImages[imageIndex],
                created: Date.now()
            };

            await this.writeToIndexedDB(newItem);

            setTimeout(async () => {
                await this.loadCurrentView();
                console.log("✅ Neues MediaItem erstellt und UI aktualisiert:", newItem);
            }, 200);

        } catch (error) {
            console.error("❌ Error creating new MediaItem:", error);
            throw error;
        }
    }

    // VERBESSERTE updateMediaItem
    async updateMediaItem(itemId, newTitle) {
        try {
            console.log('🔄 Updating MediaItem:', itemId, 'with title:', newTitle);

            if (!itemId) {
                throw new Error('Item ID is required for update');
            }

            if (!newTitle || newTitle.trim() === '') {
                throw new Error('Title is required for update');
            }

            await this.updateInIndexedDB(itemId, newTitle);

            setTimeout(async () => {
                await this.loadCurrentView();
                console.log('✅ MediaItem successfully updated and UI refreshed:', itemId, newTitle);
            }, 200);

        } catch (error) {
            console.error('❌ Error updating MediaItem:', error);
            throw error;
        }
    }

    async updateInIndexedDB(itemId, newTitle) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("mwftutdb", 1);

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(["MediaItem"], "readwrite");
                const store = transaction.objectStore("MediaItem");

                const getRequest = store.get(itemId);

                getRequest.onsuccess = () => {
                    const item = getRequest.result;
                    if (item) {
                        item.title = newTitle;
                        const updateRequest = store.put(item);

                        updateRequest.onsuccess = () => resolve();
                        updateRequest.onerror = () => reject(updateRequest.error);
                    } else {
                        reject(new Error('Item not found'));
                    }
                };

                getRequest.onerror = () => reject(getRequest.error);
            };

            request.onerror = () => reject(request.error);
        });
    }

    // ========== MWF4: LESEANSICHT FUNKTIONEN ==========

    // Ersetzen Sie auch Ihre showReadingView Funktion:

    showReadingView(item) {
        console.log('📖 Opening reading view for:', item);

        const mainElement = this.root.querySelector('main');
        const headerElement = this.root.querySelector('header');

        mainElement.style.display = 'none';
        headerElement.style.display = 'none';

        const readingView = this.root.querySelector('#readingView');
        const readingTitle = this.root.querySelector('#readingTitle');
        const readingImage = this.root.querySelector('#readingImage');

        readingTitle.textContent = item.title;
        readingImage.src = item.src;
        readingImage.alt = item.title;
        readingView.style.display = 'flex';

        this.setupReadingViewListeners(item);

        console.log('✅ Reading view opened successfully');
    }


    // EINFACHE setupReadingViewListeners ohne this-Probleme:

    setupReadingViewListeners(item) {
        console.log('🔧 Setting up reading view listeners for:', item);

        const backBtn = this.root.querySelector('#backBtn');
        const deleteInReadingBtn = this.root.querySelector('#deleteInReadingBtn');

        if (!backBtn) {
            console.error('❌ Back button not found!');
            return;
        }
        if (!deleteInReadingBtn) {
            console.error('❌ Delete button not found!');
            return;
        }

        const controller = this;

        backBtn.onclick = null;
        deleteInReadingBtn.onclick = null;

        backBtn.onclick = function() {
            console.log('🔙 Back button clicked');

            const readingView = document.querySelector('#readingView');
            const mainElement = document.querySelector('main');
            const headerElement = document.querySelector('header');
            const addBtn = document.querySelector('#addBtn');

            if (readingView) readingView.style.display = 'none';
            if (mainElement) mainElement.style.display = 'block';
            if (headerElement) headerElement.style.display = 'flex';
            if (addBtn) {
                addBtn.style.display = 'flex';
                addBtn.style.visibility = 'visible';
            }

            controller.loadCurrentView();

            console.log('✅ Back navigation completed');
        };

        deleteInReadingBtn.onclick = async function() {
            try {
                console.log('🗑️ Delete button clicked for:', item);

                if (!confirm(`Möchten Sie "${item.title}" wirklich löschen?`)) {
                    return;
                }

                await controller.deleteFromIndexedDB(item.id);
                console.log('✅ Item deleted from IndexedDB');

                const readingView = document.querySelector('#readingView');
                const mainElement = document.querySelector('main');
                const headerElement = document.querySelector('header');
                const addBtn = document.querySelector('#addBtn');

                if (readingView) readingView.style.display = 'none';
                if (mainElement) mainElement.style.display = 'block';
                if (headerElement) headerElement.style.display = 'block';
                if (addBtn) {
                    addBtn.style.display = 'block';
                    addBtn.style.visibility = 'visible';
                }

                setTimeout(async () => {
                    try {
                        await controller.loadCurrentView();
                        console.log('✅ UI updated after deletion');
                    } catch (error) {
                        console.error('❌ Error updating UI:', error);
                    }
                }, 500);

            } catch (error) {
                console.error('❌ Error in delete process:', error);
                alert('Fehler beim Löschen: ' + error.message);
            }
        };

        console.log('✅ Reading view listeners set up successfully');
    }


        closeReadingView() {
            console.log('🔙 Closing reading view');

            const readingView = this.root.querySelector('#readingView');
            readingView.style.display = 'none';

            const mainElement = this.root.querySelector('main');
            const headerElement = this.root.querySelector('header');

            mainElement.style.display = 'block';
            headerElement.style.display = 'flex';

            const addBtn = this.root.querySelector('#addBtn');
            if (addBtn) {
                addBtn.style.display = 'block';
                addBtn.style.visibility = 'visible';
                addBtn.style.width      = '';
            }

            const headerTitle = this.root.querySelector('#headerTitle');
            if (headerTitle) {
                if (this.currentView === "medien") {
                    headerTitle.textContent = "Medien";
                } else {
                    headerTitle.textContent = "KÜNSTLER";
                }
            }
            console.log('✅ Reading view closed, main view restored');
        }
}
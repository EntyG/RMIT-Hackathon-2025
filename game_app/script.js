document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const tooltip = document.getElementById('tooltip');
    const homeScreen = document.getElementById('home-screen');
    const startGameButton = document.getElementById('start-game-button');
    const settingsButton = document.getElementById('settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsButton = document.getElementById('close-settings');
    const backToHomeButton = document.getElementById('back-to-home-button');
    const introOverlay = document.getElementById('intro-video-overlay');
    const introVideo = document.getElementById('intro-video');
    const skipIntroButton = document.getElementById('skip-intro');
    const menuScreen = document.getElementById('menu-screen');
    const gameScreen = document.getElementById('game-screen');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const howToPlayButton = document.getElementById('how-to-play-button');
    const howToPlayModal = document.getElementById('how-to-play-modal');
    const closeHowToPlayButton = document.getElementById('close-how-to-play');
    const boardElement = document.getElementById('game-board');
    const yearStat = document.getElementById('year-stat');
    const treasuryStatText = document.getElementById('treasury-stat-text');
    const treasuryBar = document.getElementById('treasury-bar');
    const salinityStatText = document.getElementById('salinity-stat-text');
    const salinityBar = document.getElementById('salinity-bar');
    const actionButtons = document.querySelectorAll('.action-btn');
    const endTurnButton = document.getElementById('end-turn-button');
    const reduceSalinityButton = document.getElementById('reduce-salinity-button');
    const eventText = document.getElementById('event-text');
    const gameOverModal = document.getElementById('game-over-modal');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');
    const playAgainButton = document.getElementById('play-again-button');
    const eventAnimationModal = document.getElementById('event-animation-modal');
    const eventImage = document.getElementById('event-image');
    const eventTitle = document.getElementById('event-title');
    const eventDescription = document.getElementById('event-description');

    // --- GAME STATE & CONSTANTS ---
    let gameState = {};
    let selectedTile = null;
    const TILE_TYPES = { EMPTY: 'empty', RICE: 'rice', ORCHARD: 'orchard', MANGROVE: 'mangrove', COMMUNITY_HOUSE: 'community-house' };
const events = [
        { title: "Bountiful Harvest", image: "event-harvest.png", description: "Good weather blesses your crops! All crops gain 20 health.", effect: (gs) => { gs.board.flat().forEach(tile => { if (tile.health) tile.health = Math.min(tile.maxHealth, tile.health + 20); }); } },
        { title: "Government Subsidy", image: "event-subsidy.png", description: "The government provides aid for sustainable farming. Treasury +300 VND.", effect: (gs) => { gs.treasury += 300; } },
        { title: "Illegal Logging", image: "event-logging.png", description: "Loggers have illegally cut down a mangrove forest!", effect: (gs) => { const mt = []; gs.board.forEach((row, r) => row.forEach((tile, c) => { if (tile.type === TILE_TYPES.MANGROVE) mt.push({r,c}); })); if (mt.length > 0) { const tgt = mt[Math.floor(Math.random() * mt.length)]; gs.board[tgt.r][tgt.c] = createTile(TILE_TYPES.EMPTY); } } },
        { title: "Upstream Dam", image: "event-dam.png", description: "A new dam upstream reduces freshwater flow. Global salinity increases.", effect: (gs) => { gs.salinity += 8; } },
        { title: "Coastal Flood", image: "event-flood.png", description: "A coastal flood hits the southern farms! The bottom two rows of crops take 30 damage.", effect: (gs) => { for(let r = 3; r < 5; r++) { for (let c = 0; c < 5; c++) { const tile = gs.board[r][c]; if (tile.health && tile.type !== TILE_TYPES.MANGROVE) tile.health -= 30; } } } },
        { title: "Ocean Acidification", image: "event-acidification.png", description: "Changing ocean chemistry weakens your coastal defenses. Reduce the health of all mangroves by half", effect: (gs) => { gs.board.flat().forEach(tile => { if (tile.type === TILE_TYPES.MANGROVE) { tile.health = Math.floor(tile.health / 2); } }); } },
        { title: "Mangrove Weevil Infestation", image: "event-infestation.png", description: "A pest infestation is attacking your mangroves! All mangroves take 50 damage.", effect: (gs) => { gs.board.flat().forEach(tile => { if (tile.type === TILE_TYPES.MANGROVE) { tile.health -= 50; } }); } },
    ];

    // --- GAME FUNCTIONS ---
    function initGame(difficulty) {
        const difficulties = { easy: { goal: 10000, startSalinity: 10 }, medium: { goal: 15000, startSalinity: 25 }, hard: { goal: 20000, startSalinity: 50 } };
        const settings = difficulties[difficulty];
        gameState = { year: 1, treasury: 1000, salinity: settings.startSalinity, board: createInitialBoard(), targetTreasury: settings.goal };
        selectedTile = null;
        menuScreen.classList.remove('active');
        gameScreen.classList.add('active');
        renderAll();
    }

    function createTile(type) {
        const baseTile = { type };
        switch(type) {
            case TILE_TYPES.RICE: return { ...baseTile, health: 100, maxHealth: 100, production: 200 };
            case TILE_TYPES.ORCHARD: return { ...baseTile, health: 50, maxHealth: 50, production: 500 };
            case TILE_TYPES.MANGROVE: return { ...baseTile, health: 150, maxHealth: 150, production: 0 };
            case TILE_TYPES.COMMUNITY_HOUSE: return { type, health: null };
            default: return { type: TILE_TYPES.EMPTY, health: null };
        }
    }

    function createInitialBoard() {
        const board = Array(5).fill(null).map(() => Array(5).fill(null).map(() => createTile(TILE_TYPES.EMPTY)));
        board[2][2] = createTile(TILE_TYPES.COMMUNITY_HOUSE);
        return board;
    }

    function renderBoard() {
        boardElement.innerHTML = '';
        const mangroveLocations = [];
        gameState.board.forEach((row, r) => row.forEach((tile, c) => { if (tile.type === TILE_TYPES.MANGROVE) mangroveLocations.push({r, c}); }));
        
        gameState.board.forEach((row, r) => {
            row.forEach((tileData, c) => {
                const tileDiv = document.createElement('div');
                tileDiv.className = `tile ${tileData.type}`;
                tileDiv.dataset.r = r;
                tileDiv.dataset.c = c;
                const isProtected = mangroveLocations.some(loc => Math.abs(loc.r - r) <= 1 && Math.abs(loc.c - c) <= 1);
                if (isProtected) tileDiv.classList.add('protected');

                if (tileData.maxHealth) {
                    // Add the health bar
                    const healthBar = document.createElement('div');
                    healthBar.className = 'health-bar';
                    const healthBarInner = document.createElement('div');
                    healthBarInner.className = 'health-bar-inner';
                    healthBarInner.style.width = `${(tileData.health / tileData.maxHealth) * 100}%`;
                    healthBar.appendChild(healthBarInner);
                    tileDiv.appendChild(healthBar);
                    
                    // NEW: Add the permanent health text
                    const healthText = document.createElement('div');
                    healthText.className = 'tile-health-text';
                    healthText.textContent = `${Math.round(tileData.health)}/${tileData.maxHealth}`;
                    tileDiv.appendChild(healthText);
                    
                    // REMOVED: The old tooltip event listeners are gone
                }
                boardElement.appendChild(tileDiv);
            });
        });
    }

    function renderStats() {
        yearStat.textContent = `${Math.min(gameState.year, 20)} / 20`;
        treasuryStatText.textContent = `${gameState.treasury.toLocaleString()} / ${gameState.targetTreasury.toLocaleString()} VND`;
        const treasuryPercent = Math.min(100, (gameState.treasury / gameState.targetTreasury) * 100);
        treasuryBar.style.width = `${treasuryPercent}%`;
        salinityStatText.textContent = `${Math.round(gameState.salinity)} / 100`;
        salinityBar.style.width = `${gameState.salinity}%`;
    }
    
    function renderAll() { renderBoard(); renderStats(); }

    function handleTileClick(e) {
        const tile = e.target.closest('.tile');
        if (!tile) return;
        if (selectedTile) {
            selectedTile.div.classList.remove('selected');
        }
        if (selectedTile && selectedTile.div === tile) {
            selectedTile = null;
            return;
        }
        const r = parseInt(tile.dataset.r);
        const c = parseInt(tile.dataset.c);
        if (gameState.board[r][c].type === TILE_TYPES.COMMUNITY_HOUSE) {
            selectedTile = null;
            return;
        }
        tile.classList.add('selected');
        selectedTile = { div: tile, r, c };
    }
    
    function handleActionClick(action) {
        if (!selectedTile) { alert("Please select a tile first!"); return; }
        const costs = { rice: 100, orchard: 200, mangrove: 150 };
        const cost = costs[action];
        const currentTile = gameState.board[selectedTile.r][selectedTile.c];
        if (currentTile.type !== TILE_TYPES.EMPTY) { alert("This tile is already developed!"); return; }
        if (gameState.treasury >= cost) {
            gameState.treasury -= cost;
            gameState.board[selectedTile.r][selectedTile.c] = createTile(action);
            selectedTile.div.classList.remove('selected');
            selectedTile = null;
            renderAll();
        } else {
            alert("Not enough money!");
        }
    }

    function cleanupDeadPlants() {
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const tile = gameState.board[r][c];
                if (tile.maxHealth && tile.health <= 0) {
                    gameState.board[r][c] = createTile(TILE_TYPES.EMPTY);
                }
            }
        }
    }

    function showEventAnimation(event) {
        return new Promise(resolve => {
            // Update modal content
            eventImage.src = `assets/${event.image}`;
            eventTitle.textContent = event.title;
            eventDescription.textContent = event.description;

            // Show modal and start animation
            const content = eventAnimationModal.querySelector('.event-modal-content');
            content.style.animation = 'none'; // Reset animation
            void content.offsetWidth; // Trigger reflow
            content.style.animation = 'fadeInOut 3.5s forwards';
            eventAnimationModal.classList.add('active');

            // Wait for the animation to finish, then hide modal and resolve the promise
            setTimeout(() => {
                eventAnimationModal.classList.remove('active');
                resolve();
            }, 3500); // Must match the animation duration
        });
    }

    async function endTurn() {
        // Disable the button to prevent double clicks during animation
        endTurnButton.disabled = true;

        // 1. Show the event animation and WAIT for it to finish
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        await showEventAnimation(randomEvent);

        // --- The rest of the game logic runs AFTER the animation is done ---
        eventText.textContent = randomEvent.description; // Update the small box as well
        randomEvent.effect(gameState);
        cleanupDeadPlants();

        gameState.salinity += 1;
        let income = 0;
        
        const mangroveLocations = [];
        gameState.board.flat().forEach((tile, i) => { if (tile.type === TILE_TYPES.MANGROVE) mangroveLocations.push({r: Math.floor(i/5), c: i%5}); });
        
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const tile = gameState.board[r][c];
                if (!tile.health || tile.type === TILE_TYPES.MANGROVE) continue;
                let isProtected = mangroveLocations.some(loc => Math.abs(loc.r - r) <= 1 && Math.abs(loc.c - c) <= 1);
                const damage = isProtected ? gameState.salinity / 2 : gameState.salinity;
                tile.health -= damage;
            }
        }
        cleanupDeadPlants();

        for (const tile of gameState.board.flat()) {
            if (tile.health > 0 && tile.production > 0) {
                income += tile.production * (tile.health / 100);
            }
        }
        
        gameState.treasury += Math.round(income);
        gameState.salinity = Math.max(0, Math.min(100, gameState.salinity));
        gameState.year++;
        renderAll();
        checkGameOver();

        // Re-enable the button for the next turn
        endTurnButton.disabled = false;
    }
    
    function checkGameOver() {
        if (gameState.treasury >= gameState.targetTreasury) {
            showGameOver(true, `Congratulations! You raised ${gameState.treasury.toLocaleString()} VND in ${Math.min(gameState.year - 1, 20)} years.`);
        }
        else if (gameState.year > 20) {
            showGameOver(false, `The 20 years are over, but you only raised ${gameState.treasury.toLocaleString()} VND out of the required ${gameState.targetTreasury.toLocaleString()}.`);
        }
    }

    function showGameOver(isWin, message) {
        gameOverModal.classList.add('active');
        gameOverTitle.textContent = isWin ? "Victory!" : "Game Over";
        gameOverMessage.textContent = message;
    }

    // --- EVENT LISTENERS ---
    // Difficulty selection -> starts the game and hides the menu
    difficultyButtons.forEach(btn => btn.addEventListener('click', () => initGame(btn.dataset.difficulty)));
    // Home / modal buttons
    // When Start Game is clicked, show intro video overlay first (user gesture allows sound).
    startGameButton.addEventListener('click', () => {
        // Show overlay and attempt to play
        introOverlay.classList.add('active');
        try {
            // Play returns a promise; browsers may block autoplay with sound, but because this is a direct user gesture it should play.
            introVideo.currentTime = 0;
            const playPromise = introVideo.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(err => {
                    // If playback fails, fallback to showing the menu
                    console.warn('Intro video playback failed:', err);
                    introOverlay.classList.remove('active');
                    homeScreen.classList.remove('active');
                    menuScreen.classList.add('active');
                });
            }
        } catch (e) {
            console.warn('Error starting intro video', e);
            introOverlay.classList.remove('active');
            homeScreen.classList.remove('active');
            menuScreen.classList.add('active');
        }
    });
    backToHomeButton.addEventListener('click', () => { menuScreen.classList.remove('active'); homeScreen.classList.add('active'); });
    settingsButton.addEventListener('click', () => settingsModal.classList.add('active'));
    closeSettingsButton.addEventListener('click', () => settingsModal.classList.remove('active'));
    howToPlayButton.addEventListener('click', () => howToPlayModal.classList.add('active'));
    closeHowToPlayButton.addEventListener('click', () => howToPlayModal.classList.remove('active'));
    boardElement.addEventListener('click', handleTileClick);
    actionButtons.forEach(btn => btn.addEventListener('click', () => handleActionClick(btn.dataset.action)));
    endTurnButton.addEventListener('click', endTurn);
    reduceSalinityButton.addEventListener('click', () => {
        const cost = 500;
        if (gameState.treasury >= cost) {
            gameState.treasury -= cost;
            gameState.salinity = Math.max(0, gameState.salinity - 5);
            renderStats();
        } else {
            alert("Not enough money to purify the water!");
        }
    });
    playAgainButton.addEventListener('click', () => {
        gameOverModal.classList.remove('active');
        gameScreen.classList.remove('active');
        // Return to Home screen after game over
        homeScreen.classList.add('active');
    });

    // Intro video controls: when video ends or errors, go to difficulty menu
    if (introVideo) {
        introVideo.addEventListener('ended', () => {
            introOverlay.classList.remove('active');
            homeScreen.classList.remove('active');
            menuScreen.classList.add('active');
        });
        introVideo.addEventListener('error', (e) => {
            console.warn('Intro video error', e);
            introOverlay.classList.remove('active');
            homeScreen.classList.remove('active');
            menuScreen.classList.add('active');
        });
    }

    if (skipIntroButton) {
        skipIntroButton.addEventListener('click', () => {
            if (introVideo && !introVideo.paused) {
                try { introVideo.pause(); } catch(e){}
            }
            introOverlay.classList.remove('active');
            homeScreen.classList.remove('active');
            menuScreen.classList.add('active');
        });
    }
});
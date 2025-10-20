# Delta Guardians 🎮

> A Game of Strategy and Survival in the Face of Climate Change.

Delta Guardians is a web-based, turn-based strategy game developed for the **Vibe Coding - Play to Impact Challenge**. It puts players in the role of a community leader in Vietnam's Mekong Delta, tasking them with balancing economic growth against the devastating environmental threat of rising sea levels and saltwater intrusion.

The game is designed to be fun, educational, and impactful, giving players a direct, interactive experience with the real-world challenges faced by communities on the front lines of climate change.

## 🌱 Features

-   **Resource Management:** Carefully manage your starting funds (VND) to build a resilient and profitable farm.
-   **Turn-Based Strategy:** Each turn represents one year. You have 20 years to reach your economic goal.
-   **Diverse Plant Types:** Choose between reliable Rice, high-risk/high-reward Orchards, and the vital defensive Mangroves.
-   **Dynamic Environmental Threats:** A rising Salinity level directly damages your crops each year, reducing their health and income.
-   **Random Yearly Events:** Be prepared for anything! Events can bring subsidies and good harvests, or disasters like floods and mangrove-destroying pests.
-   **Variable Difficulty:** Choose from Easy, Medium, or Hard modes, each with a different starting environment and a higher monetary goal.
-   **Responsive Design:** The game layout adapts to fit your screen for a great experience on any device.
-   **100% Client-Side:** Runs entirely in your browser using only HTML, CSS, and JavaScript. No backend or installation required!

## 🚀 How to Play

The game is designed to be run instantly in any modern web browser.

1.  Clone or download this repository.
2.  Open the `index.html` file in your browser (e.g., Chrome, Firefox, Edge).
3.  That's it! The game will start on the menu screen.

## 📖 Gameplay Guide

### Objective

Your goal is to reach the **target Treasury amount** by the end of **Year 20**.

### The Plants

Each plant has unique strengths and weaknesses. Choose wisely!

| Plant               | Cost    | Health | Production/Year | Special Notes                                     |
| ------------------- | ------- | ------ | --------------- | ------------------------------------------------- |
| **🌾 Rice Paddy**   | 100 VND | 100    | 200 VND         | A reliable and sturdy source of income.           |
| **🍎 Fruit Orchard**| 200 VND | 50     | 500 VND         | Extremely profitable but very fragile.            |
| **🌳 Mangrove**     | 150 VND | 150    | 0 VND           | Produces no income but is your key to survival. |

### The Threat: Salinity

-   **Damage:** Each year, your crops take damage based on the global Salinity level. Their income is proportional to their remaining health. If health reaches 0, the plant is destroyed.
-   **Protection:** Mangroves are **immune** to Salinity damage. Furthermore, they protect all tiles (including other plants) in a **3x3 square** around themselves, cutting Salinity damage in half for those tiles.

### Yearly Events

At the start of each year, a random event will occur. These can include:
-   **Positive Events:** Government subsidies, bountiful harvests.
-   **Negative Events:** Floods that damage crops in a specific region.
-   **Dangerous Events:** Pests or ocean acidification that can damage even your mighty mangroves!

## 🤖 Vibe Coding: The Role of AI in Development

This project was built following the "vibe coding" philosophy, leveraging various AI models to accelerate development, generate content, and create assets.

### 💡 Game Design & Content (Gemini 2.5 Pro)

-   **Initial Concept:** Brainstormed core mechanics for a game about climate change in the Mekong Delta.
-   **Event Generation:** AI was prompted to create a list of positive and negative event ideas, complete with descriptions and gameplay effects (e.g., `Give me 10 event ideas for a climate change game, with effects like 'salinity +8' or 'treasury +300'`).
-   **Instructional Text:** The text for the in-game "How to Play" guide was drafted and refined with AI assistance.

### 💻 Code Generation (Gemini 2.5 Pro)

-   **Boilerplate HTML/CSS:** Initial layouts for the game board and dashboard were generated via prompts like `Write HTML and CSS for a 5x5 grid next to a stats panel using Flexbox`.
-   **JavaScript Logic:** AI helped scaffold complex functions, including:
    -   The main `endTurn()` game loop.
    -   The `renderBoard()` function for displaying tiles.
    -   Utility functions for damage calculation and checking for game-over conditions.

### 🎨 Asset Generation (Nano Banana)

All visual assets in the game were generated using AI image models.

-   **Background Art:** `Digital painting, beautiful landscape of the Mekong Delta, game background art`
-   **Plant Sprites:** `pixel art game asset, a lush green rice paddy tile, top-down view, simple, 2D sprite`
-   **Favicon:** `pixel art favicon, a simple mangrove tree, 32x32, vibrant green`

## 🛠️ Technology Stack

-   **HTML5**
-   **CSS3** (Flexbox & Grid for layout)
-   **JavaScript (ES6)**
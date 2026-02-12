# Thai Money Math - เกมรวมเงินให้ครบ 💰

A web-based educational game designed for children (ages 4-5) to practice addition and counting using Thai currency.

## 🎮 Features

- **Realistic Thai Currency**: Uses images of 1, 2, 5, 10 Baht coins and 20, 50, 100, 500, 1000 Baht banknotes.
- **Interactive Gameplay**: Click or tap to add money to your wallet to match the target amount.
- **Smart Grouping**: Money is automatically sorted and grouped by denomination for easier counting.
- **Sound Effects**: Auditory feedback for actions (coin clink, paper rustle, success fanfare) using Web Audio API (no external downloads).
- **Responsive Design**: optimized for both Landscape (Desktop/Tablet) and Portrait (Mobile) views. Fits on a single screen without scrolling.
- **Custom Targets**: Parents or teachers can set specific target amounts for focused practice by clicking the pencil icon ✏️.

## 🚀 How to Play

1.  **Check the Target**: Look at the orange box to see the target amount (e.g., "เป้าหมาย: 125 บาท").
2.  **Add Money**: Click on coins or banknotes in the "Bank" section to add them to your wallet.
3.  **Count**: Valid money items appear in the blue "Wallet" zone. They group together automatically.
4.  **Remove**: If you added too much, click on the money in your wallet to return it.
5.  **Win**: Match the exact amount to trigger the celebration! 🎉
6.  **Reset**: Click "เริ่มใหม่" to get a new random target.

## 🛠️ Technical Details

- **Tech Stack**: HTML5, CSS3, Vanilla JavaScript.
- **Audio**: Uses `window.AudioContext` for synthesized sound effects.
- **Storage**: No local storage or database required; runs entirely in the browser.

## 📂 Project Structure

```
thai_money_math/
├── index.html      # Main game structure
├── style.css       # Responsive styling and animations
├── script.js       # Game logic, state management, and audio
├── assets/         # Images for coins and banknotes
└── README.md       # Project documentation
```

## 👨‍🏫 For Parents/Teachers

To set a specific number for practice:
1. Click the **Pencil Icon (✏️)** next to the target amount.
2. Enter a whole number (e.g., 50, 100, 999).
3. The game will update immediately to that target.

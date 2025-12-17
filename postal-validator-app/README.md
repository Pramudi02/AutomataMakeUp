# Sri Lankan Postal Code Validator (React + PDA)

## 🎓 Automata Theory Assignment

A modern web application implementing a **Pushdown Automaton (PDA)** to validate Sri Lankan postal codes. This project demonstrates the practical application of automata theory by visualizing the validation process step-by-step.

![Project Preview](https://via.placeholder.com/800x400?text=Postal+Code+Validator+Preview)

---

## 🌟 Overview

This application validates Sri Lankan 5-digit postal codes across all 25 districts and 9 provinces. Unlike simple regex validators, this system simulates a PDA state machine, showing users exactly how the input is processed through states, stack operations, and transitions.

### Key Features
- **Interactive PDA Visualization**: Watch the state transitions and stack operations in real-time.
- **Full District Coverage**: Validates codes for all 25 districts in Sri Lanka.
- **Visual Feedback**: Clear acceptance/rejection status with detailed reasons.
- **Reference Guide**: Built-in reference table for all district postal code ranges.
- **Modern UI**: Built with React and Tailwind CSS for a clean, responsive experience.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript / JavaScript

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1.  **Navigate to the project directory:**
    ```bash
    cd postal-validator-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Visit `http://localhost:5173` to see the application.

---

## 🧠 PDA Formal Definition

The validator implements the following Pushdown Automaton logic:

- **States ($Q$):** $\{q_0, q_1, q_2, q_3, q_4, q_{accept}, q_{reject}\}$
- **Alphabet ($\Sigma$):** $\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\}$
- **Stack Alphabet ($\Gamma$):** $\{0-9, Z_0\}$
- **Start State:** $q_0$
- **Accept States ($F$):** $\{q_{accept}\}$

### Transition Logic ($\delta$)

1.  **$q_0 \to q_1$**: Check input length (must be 5).
2.  **$q_1 \to q_2$**: Verify all characters are digits.
3.  **$q_2$ (Loop)**: Push all digits onto the stack.
4.  **$q_2 \to q_3$**: Extract the first 2 digits (prefix).
5.  **$q_3 \to q_4$**: Match prefix with district ranges and validate the full number.
6.  **$q_4 \to q_{accept}$**: Pop stack and accept if valid.
7.  **Any Error \to q_{reject}$**: Reject input immediately.

---

## 📂 Project Structure

```
postal-validator-app/
├── src/
│   ├── PostalCodeValidator.tsx  # Main component with PDA logic
│   ├── App.tsx                  # Root component
│   ├── index.css                # Tailwind imports
│   └── main.tsx                 # Entry point
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🇱🇰 Supported Districts

| Province | Districts | Prefix |
|----------|-----------|--------|
| **Western** | Colombo, Gampaha, Kalutara | 00, 10, 11, 12 |
| **Central** | Kandy, Matale, Nuwara Eliya | 20, 21, 22 |
| **Southern** | Galle, Matara, Hambantota | 80, 81, 82 |
| **Northern** | Jaffna, Kilinochchi, Mannar, Vavuniya, Mullaitivu | 40-44 |
| **Eastern** | Batticaloa, Ampara, Trincomalee | 30, 31, 32 |
| **North Western** | Kurunegala, Puttalam | 60, 61 |
| **North Central** | Anuradhapura, Polonnaruwa | 50, 51 |
| **Uva** | Badulla, Monaragala | 90, 91 |
| **Sabaragamuwa** | Ratnapura, Kegalle | 70, 71 |

---

## 📝 License

This project is created for educational purposes.

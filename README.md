# Sri Lankan Postal Code Validator (PDA)

This project implements a **Pushdown Automaton (PDA)** to validate Sri Lankan postal codes based on district ranges. It is designed as a full-stack application to demonstrate the practical application of Automata Theory.

## 📂 Project Structure & File Descriptions

### 1. `backend/` (Python Flask API)
This directory contains the core logic and the server.

*   **`pda_logic.py`**: **The Core Automaton.**
    *   Contains the `PostalCodePDA` class.
    *   **Logic:** Implements the states ($q_0$ to $q_{accept}$), stack operations (push/pop), and transition rules.
    *   **Data:** Stores the `district_ranges` dictionary mapping Sri Lankan districts (e.g., Colombo, Kandy) to their valid postal code ranges.
*   **`postal_code_validator.py`**: **The API Server.**
    *   A Flask application that exposes the PDA logic to the web.
    *   **Endpoint `/validate` (POST):** Receives a postal code, runs the PDA, and returns the result + execution log.
    *   **Endpoint `/districts` (GET):** Returns the list of supported districts for the UI reference table.
*   **`requirements.txt`**: Lists Python dependencies (`flask`, `flask-cors`).

### 2. `postal-validator-app/` (React Frontend)
This directory contains the user interface.

*   **`src/PostalCodeValidator.tsx`**: **The Main UI Component.**
    *   Handles user input.
    *   Fetches validation results from the Python backend.
    *   Visualizes the **PDA Execution Steps** (showing state changes and stack contents).
    *   Displays the District Reference Table.
*   **`src/App.tsx`**: The root component that renders the validator.
*   **`vite.config.ts`**: Configuration for the Vite build tool.

### 3. Root Files
*   **`terminal_test.py`**: **Terminal Testing Tool.**
    *   A standalone Python script that imports the PDA logic and runs it in the command line.
    *   **Purpose:** Allows for direct verification of the automaton's state transitions and stack operations without needing the web server or browser. Useful for debugging and quick testing.
*   **`PROJECT_REPORT.md`**: The comprehensive academic report for the assignment.
*   **`VIDEO_SCRIPT.md`**: A step-by-step script for recording the demonstration video.
*   **`GUIDE_TO_FULL_MARKS.md`**: A checklist to ensure all rubric requirements are met.

---

## 🧠 Logic Description (The Automaton)

The validation logic is modeled as a **Deterministic Pushdown Automaton (DPDA)**.

### Formal Definition
*   **States ($Q$):** $\{q_0, q_1, q_2, q_3, q_4, q_{accept}, q_{reject}\}$
*   **Alphabet ($\Sigma$):** $\{0-9\}$
*   **Stack Alphabet ($\Gamma$):** $\{0-9, Z_0\}$

### Execution Flow
1.  **Initialization ($q_0$):** The PDA starts. Stack contains $Z_0$.
2.  **Length Check ($q_1$):** The input is checked. If length $\neq$ 5, transition to $q_{reject}$.
3.  **Push to Stack ($q_2$):** The PDA reads the input digits one by one and **pushes** them onto the stack. This demonstrates the PDA's memory capability.
4.  **Prefix Extraction ($q_3$):** The PDA identifies the first two digits (District Prefix).
5.  **Range Validation ($q_4$):**
    *   The logic checks if the number falls within the specific range for that district (e.g., Colombo Fort is 00xxx-00999, but generally 00000-12999 for the region).
    *   If valid, the PDA **pops** the stack until empty (simulating the consumption of the input).
6.  **Acceptance ($q_{accept}$):** If the stack is successfully processed and the range is valid, the input is accepted.

---

## 🚀 How to Run

### Prerequisites
*   Python 3.x
*   Node.js & npm

### Step 1: Start the Backend
```bash
cd backend
python postal_code_validator.py
```
*Server runs at `http://localhost:5000`*

### Step 2: Start the Frontend
Open a new terminal:
```bash
cd postal-validator-app
npm install
npm run dev
```
*App runs at `http://localhost:5173`*

### Step 3: Test (Web)
Open your browser to `http://localhost:5173` and enter a code like `10100`.

### Step 4: Test (Terminal Only)
If you prefer to test the logic without the web UI:
```bash
python terminal_test.py
```

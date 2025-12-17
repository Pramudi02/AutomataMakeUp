# Sri Lankan NIC Validator (PDA)

This project implements a **Pushdown Automaton (PDA)** to validate Sri Lankan National Identity Card (NIC) numbers. It supports both the **Old Format** (9 digits + V/X) and the **New Format** (12 digits).

It follows a Client-Server architecture:
- **Backend**: Python (Flask) - Handles the PDA logic and validation.
- **Frontend**: React (Vite) - Provides the user interface.

## 📂 Project Structure

- `backend/`: Contains the Python Flask application and PDA logic.
  - `nic_validator.py`: The Flask server entry point.
  - `nic_pda_logic.py`: The `NICPDA` class implementation.
- `nic-validator-app/`: The React frontend application.
- `terminal_test.py`: A standalone Python script to test the PDA logic directly in the terminal.

## Prerequisites

- Python 3.x
- Node.js and npm

## Setup & Running

### 1. Backend (Python)

Navigate to the `backend` directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Start the Flask server:

```bash
python nic_validator.py
```

The server will start at `http://localhost:5001`.

### 2. Frontend (React)

Open a new terminal, navigate to the `nic-validator-app` directory, and install dependencies:

```bash
cd nic-validator-app
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### 3. Terminal Testing

To test the logic without the web UI:

```bash
python terminal_test.py
```

## Usage

1. Open the web application in your browser.
2. Enter an NIC number (e.g., `951234567V` or `199512345678`).
3. Click "Validate".
4. View the validation result and the step-by-step PDA execution log.

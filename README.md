# Sri Lankan Postal Code Validator (PDA)

This project implements a Pushdown Automaton (PDA) to validate Sri Lankan postal codes based on district ranges.
It follows a Client-Server architecture as per the assignment requirements:
- **Backend**: Python (Flask) - Handles the PDA logic and validation.
- **Frontend**: React (Vite) - Provides the user interface.

## Project Structure

- `backend/`: Contains the Python Flask application and PDA logic.
  - `app.py`: The Flask server entry point.
  - `pda_logic.py`: The `PostalCodePDA` class implementation.
- `postal-validator-app/`: The React frontend application.

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
python app.py
```

The server will start at `http://localhost:5000`.

### 2. Frontend (React)

Open a new terminal, navigate to the `postal-validator-app` directory, and install dependencies:

```bash
cd postal-validator-app
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Usage

1. Open the web application in your browser.
2. Enter a 5-digit Sri Lankan postal code (e.g., `10100` for Colombo).
3. Click "Validate".
4. View the validation result and the step-by-step PDA execution log.

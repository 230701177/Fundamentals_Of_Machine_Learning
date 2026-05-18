# SmartClaim
SmartClaim is an AI-assisted insurance claim verification platform that analyzes incident details, environmental context, and vehicle data to assess claim consistency and reduce fraudulent claims.

## How to Run the Project

This project consists of a React frontend and a FastAPI backend. You will need two separate terminal windows to run both simultaneously.

### 1. Running the Backend (FastAPI)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional but recommended) Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   python main.py
   # OR
   uvicorn main:app --reload
   ```
   The backend will be running at `http://localhost:5000` (if using `python main.py`).

### 2. Running the Frontend (React + Vite)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will typically be running at `http://localhost:5173`. Open this URL in your browser to access the application.

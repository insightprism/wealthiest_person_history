# Sovereign Asset Valuation Engine (SAVE)

Calculate the "Real Wealth" of historical sovereign rulers using the Consolidated Imperial Valuation (CIV) methodology. All values expressed in **Gold Ounces (oz)** to neutralize inflation and currency debasement.

## Quick Start

### 1. Start the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The API will be available at `http://localhost:8000`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

- **Income-Based Valuation**: Calculate wealth from recurring imperial income
- **Asset-Based Valuation**: Sum infrastructure, treasury, real estate, and extraordinary gains
- **Sensitivity Analysis**: See impact of +/- 20% changes to key variables
- **Comparison Mode**: Compare two rulers side-by-side
- **CFO Dashboard**: Executive metrics including Income-to-Asset ratio

## API Endpoints

- `POST /api/calculate` - Calculate single ruler valuation
- `POST /api/sensitivity` - Get sensitivity analysis
- `POST /api/compare` - Compare two rulers

## Test Cases

### British Empire (1913)
- Population: 412M
- Expected Total: ~5.407B oz

### Roman Empire (Augustus, 14 AD)
- Population: 60M
- Expected Total: ~522M oz

## Running Tests

```bash
cd backend
pytest test_engine.py -v
```

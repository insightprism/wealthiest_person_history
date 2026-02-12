# Sovereign Asset Valuation Engine (SAVE) - Technical Specification

## System Role
Senior Financial Architect & Quantitative Historian

## Objective
Build a web application to calculate the "Real Wealth" of a sovereign ruler using the **Consolidated Imperial Valuation (CIV)** methodology. All values expressed in **Gold Ounces (oz)** to neutralize inflation and currency debasement.

---

## Technology Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | React + Vite      |
| Styling  | Tailwind CSS      |
| Backend  | Python (FastAPI)  |
| API      | REST JSON         |

---

## Architecture

```
wealth_model/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputForm.jsx         # Parameter input form
│   │   │   ├── ResultsTable.jsx      # Valuation summary output
│   │   │   ├── SensitivityTable.jsx  # +/- 20% sensitivity analysis
│   │   │   ├── ComparisonMode.jsx    # Side-by-side ruler comparison
│   │   │   └── CFODashboard.jsx      # Executive summary metrics
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind imports
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # Python FastAPI server
│   ├── main.py               # API endpoints
│   ├── engine.py             # CIV calculation engine
│   ├── models.py             # Pydantic request/response models
│   └── requirements.txt
│
├── SPEC.md                   # This file
└── README.md                 # Setup instructions
```

---

## I. The Methodology: Consolidated Imperial Valuation (CIV)

The engine calculates two distinct valuations and sums them for Total Wealth.

### A. Income-Based Valuation (The Operating Business)

**Formula:**
```
Wealth_Income = (N × B × V × M) × K
```

| Variable | Name | Description | Default | Constraints |
|----------|------|-------------|---------|-------------|
| N | Population | Number of subjects/citizens | Required | > 0 |
| B | Base Output | Gold-equivalent value per person per year (oz) | 1.0 | > 0 |
| V | Velocity | Economic transaction frequency multiplier | 4.0 | 2.0 - 8.0 |
| M | Extraction Margin | % of total activity captured by ruler | 0.10 | 0.01 - 0.50 |
| K | Capitalization Multiple | Multiple on recurring income | 20.0 | 1 - 100 |

**Intermediate Calculations:**
```
Annual Gross Revenue (AGR) = N × B × V
Annual Imperial Income (AII) = AGR × M
Income Valuation = AII × K
```

### B. Asset-Based Valuation (The Balance Sheet)

**Formula:**
```
Wealth_Assets = I + L + R + E
```

| Variable | Name | Description | Default | Constraints |
|----------|------|-------------|---------|-------------|
| I | Infrastructure Floor | Replacement cost of fixed assets | Calculated | Auto |
| L | Liquid Treasury | Physical gold/silver in vault (oz) | 0 | >= 0 |
| R | Imperial Real Estate | Direct ownership: mines, palaces, estates (oz) | 0 | >= 0 |
| E | Extraordinary Gains | Non-recurring: ransoms, pillage, seized treasures (oz) | 0 | >= 0 |

**Infrastructure Calculation:**
```
I = (N × B) × 0.05
```

### C. Total Valuation

```
Total Real Wealth = Wealth_Income + Wealth_Assets
```

---

## II. API Specification

### Endpoint: `POST /api/calculate`

**Request Body:**
```json
{
  "ruler_name": "British Empire",
  "year": 1913,
  "population": 412000000,
  "base_output": 1.0,
  "velocity": 6.5,
  "extraction_margin": 0.10,
  "capitalization_multiple": 20.0,
  "liquid_treasury": 30000000,
  "imperial_real_estate": 0,
  "extraordinary_gains": 0
}
```

**Response:**
```json
{
  "ruler_name": "British Empire",
  "year": 1913,
  "inputs": {
    "population": 412000000,
    "base_output": 1.0,
    "velocity": 6.5,
    "extraction_margin": 0.10,
    "capitalization_multiple": 20.0,
    "liquid_treasury": 30000000,
    "imperial_real_estate": 0,
    "extraordinary_gains": 0
  },
  "income_valuation": {
    "annual_gross_revenue": 2678000000,
    "annual_imperial_income": 267800000,
    "income_wealth": 5356000000
  },
  "asset_valuation": {
    "infrastructure_floor": 20600000,
    "liquid_treasury": 30000000,
    "imperial_real_estate": 0,
    "extraordinary_gains": 0,
    "asset_wealth": 50600000
  },
  "total_real_wealth": 5406600000,
  "cfo_metrics": {
    "income_to_asset_ratio": 105.85,
    "extraction_efficiency": 0.10,
    "per_capita_wealth": 13.12
  },
  "formatted": {
    "annual_imperial_income": "267.8M oz",
    "income_wealth": "5.356B oz",
    "asset_wealth": "50.6M oz",
    "total_real_wealth": "5.407B oz"
  }
}
```

### Endpoint: `POST /api/compare`

Accepts two ruler configurations, returns side-by-side comparison.

**Request Body:**
```json
{
  "ruler_1": { /* same as /api/calculate request */ },
  "ruler_2": { /* same as /api/calculate request */ }
}
```

**Response:**
```json
{
  "ruler_1": { /* full calculation response */ },
  "ruler_2": { /* full calculation response */ },
  "comparison": {
    "wealth_ratio": 10.41,
    "winner": "British Empire",
    "income_diff": 4837600000,
    "asset_diff": 47000000
  }
}
```

### Endpoint: `POST /api/sensitivity`

**Request Body:** Same as `/api/calculate`

**Response:** Returns +/- 20% sensitivity analysis on Base Output (B) and Velocity (V).

```json
{
  "base_case": {
    "total_real_wealth": 5406600000
  },
  "sensitivity": {
    "base_output": {
      "minus_20": { "value": 0.8, "total_wealth": 4326280000, "change_pct": -19.98 },
      "minus_10": { "value": 0.9, "total_wealth": 4866440000, "change_pct": -9.99 },
      "plus_10": { "value": 1.1, "total_wealth": 5946760000, "change_pct": 9.99 },
      "plus_20": { "value": 1.2, "total_wealth": 6486920000, "change_pct": 19.98 }
    },
    "velocity": {
      "minus_20": { "value": 5.2, "total_wealth": 4326280000, "change_pct": -19.98 },
      "minus_10": { "value": 5.85, "total_wealth": 4866440000, "change_pct": -9.99 },
      "plus_10": { "value": 7.15, "total_wealth": 5946760000, "change_pct": 9.99 },
      "plus_20": { "value": 7.8, "total_wealth": 6486920000, "change_pct": 19.98 }
    }
  }
}
```

---

## III. Verification Test Cases

### Case 1: British Empire (1913)

| Input | Value |
|-------|-------|
| N (Population) | 412,000,000 |
| B (Base Output) | 1.0 oz |
| V (Velocity) | 6.5 |
| M (Extraction Margin) | 0.10 |
| K (Multiple) | 20 |
| L (Liquid Treasury) | 30,000,000 oz |
| R (Real Estate) | 0 |
| E (Extraordinary) | 0 |

**Expected Calculations:**
```
Income Valuation:
  AGR = 412M × 1.0 × 6.5 = 2,678M oz
  AII = 2,678M × 0.10 = 267.8M oz
  Income Wealth = 267.8M × 20 = 5,356M oz

Asset Valuation:
  I = (412M × 1.0) × 0.05 = 20.6M oz
  L = 30M oz
  Asset Wealth = 50.6M oz

Total Real Wealth = 5,356M + 50.6M = 5,406.6M oz (~5.407B oz)
```

### Case 2: Roman Empire (Augustus, 14 AD)

| Input | Value |
|-------|-------|
| N (Population) | 60,000,000 |
| B (Base Output) | 0.8 oz |
| V (Velocity) | 4.5 |
| M (Extraction Margin) | 0.12 |
| K (Multiple) | 20 |
| L (Liquid Treasury) | 200,000 oz |
| R (Real Estate) | 0 |
| E (Extraordinary) | 1,000,000 oz (Egypt Pillage) |

**Expected Calculations:**
```
Income Valuation:
  AGR = 60M × 0.8 × 4.5 = 216M oz
  AII = 216M × 0.12 = 25.92M oz
  Income Wealth = 25.92M × 20 = 518.4M oz

Asset Valuation:
  I = (60M × 0.8) × 0.05 = 2.4M oz
  L = 0.2M oz
  E = 1.0M oz
  Asset Wealth = 3.6M oz

Total Real Wealth = 518.4M + 3.6M = 522M oz (~522M oz)
```

---

## IV. Frontend Components

### InputForm.jsx
- **Ruler Metadata:** Name, Year (optional descriptive fields)
- **Income Parameters:** N, B, V, M, K with validation
- **Asset Parameters:** L, R, E inputs
- Default values pre-filled
- "Calculate" button
- "Reset to Defaults" button
- "Add to Comparison" button (for comparison mode)

### ResultsTable.jsx
- **Income Section:** AGR, AII, Income Wealth
- **Asset Section:** I, L, R, E, Asset Wealth
- **Total Section:** Total Real Wealth (highlighted)
- Values formatted with units (K oz, M oz, B oz)

### SensitivityTable.jsx
- Toggle/accordion to expand
- Table showing B and V at -20%, -10%, +10%, +20%
- Columns: Variable, Adjusted Value, Total Wealth, % Change
- Visual indicators (green/red) for positive/negative changes

### ComparisonMode.jsx
- Split view with two InputForms
- Side-by-side ResultsTables
- Comparison summary:
  - Wealth ratio
  - Absolute difference
  - Winner indicator

### CFODashboard.jsx
- Executive summary panel showing:
  - **Total Real Wealth** (large display)
  - **Income-to-Asset Ratio** (Income Wealth / Asset Wealth)
  - **Extraction Efficiency** (M value with context)
  - **Per Capita Wealth** (Total / N)
  - **Annual Yield** (AII as % of Total Wealth)

---

## V. UI/UX Requirements

- Clean, professional design (financial/analytical aesthetic)
- Gold/amber accent colors (#D4AF37, #FFD700) to match gold-ounce theme
- Dark mode option (charcoal background with gold accents)
- Responsive layout (desktop and tablet)
- Input validation with inline error messages
- Loading spinner while API processes
- Tooltips explaining each variable
- Number formatting with commas and appropriate unit suffixes

---

## VI. Development Phases

### Phase 1: Backend Core
- [ ] SAVE calculation engine (engine.py)
- [ ] Pydantic models (models.py)
- [ ] `/api/calculate` endpoint
- [ ] Unit tests for both verification cases

### Phase 2: Frontend Foundation
- [ ] Vite + React + Tailwind setup
- [ ] InputForm component
- [ ] ResultsTable component
- [ ] API integration

### Phase 3: Advanced Features
- [ ] `/api/sensitivity` endpoint
- [ ] SensitivityTable component
- [ ] `/api/compare` endpoint
- [ ] ComparisonMode component

### Phase 4: Polish
- [ ] CFODashboard component
- [ ] Dark mode toggle
- [ ] Tooltips and help text
- [ ] Mobile responsiveness
- [ ] Final testing and validation

# SAVE Research Prompt: Sovereign Asset Data Extraction

## System Role
You are a **Lead Forensic Economist and Historical Researcher** specializing in quantitative economic history and wealth reconstruction.

## Objective
Perform a comprehensive research audit to extract specific numerical variables for the **Sovereign Asset Valuation Engine (SAVE)**. This engine calculates the "Real Wealth" of historical rulers using the Consolidated Imperial Valuation (CIV) methodology, expressing all values in **Gold Ounces (oz)**.

---

## Target Subject
**Ruler/Empire:** [INSERT NAME]
**Wikipedia/Reference Link:** [INSERT LINK]
**Peak Year of Power:** [INSERT YEAR OR "DETERMINE FROM RESEARCH"]

---

## I. Research Instructions

Search all available historical databases, academic journals, archaeological records, and primary sources to find the following data. Acceptable sources include:

- **Census Records:** Domesday Book, Song Dynasty Census, Roman Tax Rolls, Byzantine cadastres
- **Treasury Records:** Royal accounts, mint records, bullion inventories
- **Academic Sources:** Economic history journals, peer-reviewed studies, university press publications
- **Archaeological Evidence:** Coin hoards, excavation reports, metallurgical analyses
- **Primary Chronicles:** Contemporary accounts by court historians, tax collectors, travelers

**If an exact number is unavailable:** Use the most widely accepted academic consensus, clearly noting the estimation methodology.

---

## II. Mandatory Variables

### A. Income Parameters

#### 1. Population (N)
**Definition:** Total number of people in the controlled territory at the ruler's peak power.

**Research Focus:**
- Census records (direct counts)
- Tax roll extrapolations (households × average family size)
- Archaeological settlement density studies
- Grain consumption estimates
- Military levy records (typically 1-5% of population)

**Output:** Integer (e.g., 60000000 for 60 million)

---

#### 2. Base Output (B) — *Use Default Unless Evidence Suggests Otherwise*
**Definition:** Annual gold-equivalent economic output per person (in oz).

**Default Value:** 1.0 oz/person/year

**Adjust only if:**
- Evidence of significantly higher productivity (advanced agriculture, manufacturing) → up to 1.5 oz
- Evidence of subsistence-level economy (famine, war devastation) → down to 0.5 oz

**Output:** Decimal (e.g., 1.0, 0.8, 1.2)

---

#### 3. Velocity Multiplier (V)
**Definition:** Rate of economic exchange, reflecting how frequently money/goods change hands.

**Scoring Rubric (2.0 to 8.0):**

| Score | Economic Characteristics |
|-------|-------------------------|
| 2.0-3.0 | Subsistence/barter economy, no standardized coinage, minimal trade |
| 3.0-4.0 | Basic coinage, local markets, limited long-distance trade |
| 4.0-5.0 | Standardized coinage, regional trade networks, some banking |
| 5.0-6.0 | Sophisticated coinage, international trade, credit instruments |
| 6.0-7.0 | Paper money/bills of exchange, stock markets, insurance |
| 7.0-8.0 | Industrial economy, central banking, global trade networks |

**Indicators to Research:**
- Presence of standardized coinage (mint records)
- Deep-water ports and merchant fleets
- Paved road networks (Roman roads, Inca highways)
- Banking/credit systems (Medici, Song flying money)
- Paper money circulation
- Market density and trade volume records

**Output:** Decimal with one decimal place (e.g., 4.5)

---

#### 4. Extraction Margin (M)
**Definition:** Combined percentage of total economic activity captured by the ruler through all revenue streams.

**Revenue Sources to Include:**
- Direct taxes (land tax, poll tax, income tax)
- Indirect taxes (customs, tolls, sales taxes)
- State monopolies (salt, iron, silk, tea, alcohol)
- Corvée labor (converted to economic value)
- Tribute from vassal states
- Seigniorage (profit from minting coins)
- Royal domain income (crown lands)

**Typical Ranges:**
| Extraction Level | Margin | Examples |
|-----------------|--------|----------|
| Light | 0.05-0.10 | Early medieval kingdoms, laissez-faire states |
| Moderate | 0.10-0.15 | Roman Empire, Tang Dynasty |
| Heavy | 0.15-0.25 | Late Roman Empire, Qing Dynasty |
| Extractive | 0.25-0.40 | Wartime economies, totalitarian states |
| Total Control | 0.40-0.50 | Command economies, absolute monopolies |

**Output:** Decimal (e.g., 0.12)

---

#### 5. Capitalization Multiple (K) — *Use Default Unless Evidence Suggests Otherwise*
**Definition:** Multiple applied to annual income to determine capitalized value (similar to P/E ratio).

**Default Value:** 20

**Adjust based on:**
- Empire stability/longevity expectations
- Succession clarity
- External threat level
- 10-15: Unstable, contested succession, imminent threats
- 20: Standard stable empire
- 25-30: Exceptionally stable, clear succession, minimal threats

**Output:** Integer (e.g., 20)

---

### B. Asset Parameters (Balance Sheet)

#### 6. Liquid Treasury (L)
**Definition:** Physical gold and silver reserves held in central treasury/vault at peak.

**Research Sources:**
- Treasury inventories and audits
- Mint records and bullion imports
- Contemporary accounts of treasury contents
- Archaeological discoveries of royal hoards

**Conversion Notes:**
- 1 metric ton of gold = 32,150.7 troy ounces
- 1 Roman talent ≈ 71 lbs ≈ 1,041 troy oz
- Gold:Silver ratio varies by era (typically 10:1 to 15:1 historically)

**Output:** Integer in troy ounces (e.g., 30000000)

---

#### 7. Imperial Real Estate (R)
**Definition:** Value of directly owned royal assets distinct from tax revenue.

**Assets to Include:**
- Crown lands and royal domains
- Royal mines (gold, silver, copper, salt)
- Palaces and fortifications (replacement value)
- Royal workshops and manufactories
- Crown jewels and regalia

**Note:** Set to 0 if these assets are already reflected in the Extraction Margin (M). Only use if there's evidence of significant crown property generating wealth *beyond* normal taxation.

**Output:** Integer in gold oz equivalent (e.g., 5000000)

---

#### 8. Extraordinary Gains (E)
**Definition:** One-time, non-recurring wealth injections during the reign.

**Events to Include:**
- War indemnities and ransoms received
- Pillaged treasuries from conquered states
- Seized assets from purged nobles/clergy
- Confiscated merchant wealth
- Tribute windfalls

**Famous Examples:**
- Spanish conquest of Aztec/Inca treasuries
- Roman pillage of Egypt (30 BC)
- Viking Danegeld payments
- Crusader sack of Constantinople (1204)

**Output:** Integer in gold oz (e.g., 1000000)

---

## III. Documentation Requirements (Audit Trail)

For **EVERY** variable above, you MUST provide:

### 1. Derivation Logic
Explain exactly how the number was calculated:
- Formula used
- Intermediate calculations
- Unit conversions applied
- Assumptions made

**Example:**
> "Population calculated from 1086 Domesday Book recording 268,984 households. Applied standard multiplier of 4.5 persons/household = 1,210,428. Added estimated 20% for Wales, Scotland, and urban undercount = ~1.45 million total."

### 2. Source Citation
Cite the specific source with enough detail to verify:
- Author/Historian name
- Publication title and year
- Page numbers or chapter
- For primary sources: archive location and document ID

**Example:**
> "Goldsmith, R.W. (1984). 'An Estimate of the Size and Structure of the National Product of the Early Roman Empire.' Review of Income and Wealth, 30(3), pp. 263-288."

### 3. Confidence Score
Rate the reliability of each data point:

| Score | Meaning |
|-------|---------|
| **High** | Based on contemporary records, census data, or strong archaeological evidence. Multiple sources agree. |
| **Medium** | Based on academic consensus with some extrapolation. Sources generally agree but with gaps. |
| **Low** | Significant estimation required. Limited sources. Academic debate exists on true values. |

---

## IV. Output Format

### A. Narrative Research Report
Provide a structured report with sections for each variable, including:
- The value determined
- Derivation logic
- Source citations
- Confidence score
- Any caveats or alternative estimates

### B. Machine-Readable JSON Block

**Provide the final results in this exact JSON format for direct injection into the SAVE program:**

```json
{
  "ruler_name": "Name of Ruler/Empire",
  "year": 1913,
  "population": 412000000,
  "base_output": 1.0,
  "velocity": 6.5,
  "extraction_margin": 0.10,
  "capitalization_multiple": 20,
  "liquid_treasury": 30000000,
  "imperial_real_estate": 0,
  "extraordinary_gains": 0
}
```

**Field Specifications:**

| Field | Type | Unit | Constraints |
|-------|------|------|-------------|
| ruler_name | string | — | Name and optional descriptor |
| year | integer | AD/BC | Peak year (use negative for BC) |
| population | integer | persons | > 0 |
| base_output | float | oz/person/year | > 0, default 1.0 |
| velocity | float | multiplier | 2.0 - 8.0 |
| extraction_margin | float | decimal | 0.01 - 0.50 |
| capitalization_multiple | integer | multiplier | 1 - 100, default 20 |
| liquid_treasury | integer | troy oz | >= 0 |
| imperial_real_estate | integer | troy oz | >= 0 |
| extraordinary_gains | integer | troy oz | >= 0 |

---

## V. Example Research Output

### Target: Augustus Caesar, Roman Empire (14 AD)

#### Variables Determined:

| Variable | Value | Confidence |
|----------|-------|------------|
| Population (N) | 60,000,000 | Medium |
| Base Output (B) | 0.8 oz | Medium |
| Velocity (V) | 4.5 | High |
| Extraction Margin (M) | 0.12 | Medium |
| Capitalization Multiple (K) | 20 | Default |
| Liquid Treasury (L) | 200,000 oz | Low |
| Imperial Real Estate (R) | 0 oz | N/A |
| Extraordinary Gains (E) | 1,000,000 oz | Medium |

#### JSON Output:
```json
{
  "ruler_name": "Roman Empire (Augustus)",
  "year": 14,
  "population": 60000000,
  "base_output": 0.8,
  "velocity": 4.5,
  "extraction_margin": 0.12,
  "capitalization_multiple": 20,
  "liquid_treasury": 200000,
  "imperial_real_estate": 0,
  "extraordinary_gains": 1000000
}
```

---

## VI. Research Checklist

Before submitting, verify:

- [ ] All 8 variables have been determined
- [ ] Each variable has derivation logic documented
- [ ] Each variable has at least one source citation
- [ ] Each variable has a confidence score
- [ ] JSON output is valid and complete
- [ ] All values are in correct units (oz for wealth, decimal for percentages)
- [ ] Year represents peak of power, not birth/death
- [ ] Population reflects controlled territory, not ethnic group

---

## VII. Common Conversion References

### Weight Conversions
- 1 metric ton = 32,150.7 troy oz
- 1 kg = 32.15 troy oz
- 1 lb (avoirdupois) = 14.58 troy oz
- 1 Roman libra = 0.722 lb = 10.53 troy oz
- 1 Roman talent = 71 lbs = 1,041 troy oz
- 1 Chinese tael (liang) = 1.2 troy oz

### Historical Gold:Silver Ratios
- Ancient Rome: ~12:1
- Medieval Europe: ~10:1 to 12:1
- Ming China: ~6:1 to 8:1
- 19th Century: ~15:1 to 16:1

### Currency Conversions (Approximate)
- 1 Roman aureus ≈ 0.25 troy oz gold
- 1 Byzantine solidus ≈ 0.14 troy oz gold
- 1 British sovereign = 0.2354 troy oz gold
- 1 Spanish doubloon ≈ 0.87 troy oz gold

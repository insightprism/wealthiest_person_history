"""
SAVE API - Sovereign Asset Valuation Engine

FastAPI server providing endpoints for calculating sovereign ruler wealth.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from engine import SAVEEngine, format_gold_oz
from models import (
    RulerInput,
    ValuationResponse,
    IncomeValuationResponse,
    AssetValuationResponse,
    CFOMetricsResponse,
    FormattedValues,
    SensitivityResponse,
    CompareRequest,
    CompareResponse,
    ComparisonMetrics,
)

app = FastAPI(
    title="SAVE API",
    description="Sovereign Asset Valuation Engine - Calculate Real Wealth in Gold Ounces",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:22225", "http://127.0.0.1:22225"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def create_valuation_response(inputs: RulerInput) -> ValuationResponse:
    """Create a full valuation response from inputs."""
    try:
        engine = SAVEEngine(
            population=inputs.population,
            base_output=inputs.base_output,
            velocity=inputs.velocity,
            extraction_margin=inputs.extraction_margin,
            capitalization_multiple=inputs.capitalization_multiple,
            liquid_treasury=inputs.liquid_treasury,
            imperial_real_estate=inputs.imperial_real_estate,
            extraordinary_gains=inputs.extraordinary_gains,
            ruler_name=inputs.ruler_name,
            year=inputs.year
        )

        result = engine.calculate()

        return ValuationResponse(
            ruler_name=result.ruler_name,
            year=result.year,
            inputs=inputs,
            income_valuation=IncomeValuationResponse(
                annual_gross_revenue=result.income_valuation.annual_gross_revenue,
                annual_imperial_income=result.income_valuation.annual_imperial_income,
                income_wealth=result.income_valuation.income_wealth
            ),
            asset_valuation=AssetValuationResponse(
                infrastructure_floor=result.asset_valuation.infrastructure_floor,
                liquid_treasury=result.asset_valuation.liquid_treasury,
                imperial_real_estate=result.asset_valuation.imperial_real_estate,
                extraordinary_gains=result.asset_valuation.extraordinary_gains,
                asset_wealth=result.asset_valuation.asset_wealth
            ),
            total_real_wealth=result.total_real_wealth,
            cfo_metrics=CFOMetricsResponse(
                income_to_asset_ratio=result.cfo_metrics.income_to_asset_ratio,
                extraction_efficiency=result.cfo_metrics.extraction_efficiency,
                per_capita_wealth=result.cfo_metrics.per_capita_wealth,
                annual_yield=result.cfo_metrics.annual_yield
            ),
            formatted=FormattedValues(
                annual_imperial_income=format_gold_oz(result.income_valuation.annual_imperial_income),
                income_wealth=format_gold_oz(result.income_valuation.income_wealth),
                asset_wealth=format_gold_oz(result.asset_valuation.asset_wealth),
                total_real_wealth=format_gold_oz(result.total_real_wealth)
            )
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "SAVE API", "version": "1.0.0"}


@app.post("/api/calculate", response_model=ValuationResponse)
async def calculate(inputs: RulerInput) -> ValuationResponse:
    """
    Calculate the Real Wealth of a sovereign ruler.

    Uses the Consolidated Imperial Valuation (CIV) methodology.
    All values returned in Gold Ounces (oz).
    """
    return create_valuation_response(inputs)


@app.post("/api/sensitivity", response_model=SensitivityResponse)
async def sensitivity(inputs: RulerInput) -> SensitivityResponse:
    """
    Perform sensitivity analysis on Base Output (B) and Velocity (V).

    Returns impact of +/- 10% and +/- 20% changes.
    """
    try:
        engine = SAVEEngine(
            population=inputs.population,
            base_output=inputs.base_output,
            velocity=inputs.velocity,
            extraction_margin=inputs.extraction_margin,
            capitalization_multiple=inputs.capitalization_multiple,
            liquid_treasury=inputs.liquid_treasury,
            imperial_real_estate=inputs.imperial_real_estate,
            extraordinary_gains=inputs.extraordinary_gains,
            ruler_name=inputs.ruler_name,
            year=inputs.year
        )

        result = engine.sensitivity_analysis()
        return SensitivityResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/compare", response_model=CompareResponse)
async def compare(request: CompareRequest) -> CompareResponse:
    """
    Compare two rulers side-by-side.

    Returns full valuation for each ruler plus comparison metrics.
    """
    ruler_1_response = create_valuation_response(request.ruler_1)
    ruler_2_response = create_valuation_response(request.ruler_2)

    # Calculate comparison metrics
    wealth_1 = ruler_1_response.total_real_wealth
    wealth_2 = ruler_2_response.total_real_wealth

    if wealth_2 > 0:
        wealth_ratio = round(wealth_1 / wealth_2, 2) if wealth_1 >= wealth_2 else round(wealth_2 / wealth_1, 2)
    else:
        wealth_ratio = float('inf') if wealth_1 > 0 else 0.0

    winner = ruler_1_response.ruler_name if wealth_1 >= wealth_2 else ruler_2_response.ruler_name

    income_diff = abs(
        ruler_1_response.income_valuation.income_wealth -
        ruler_2_response.income_valuation.income_wealth
    )
    asset_diff = abs(
        ruler_1_response.asset_valuation.asset_wealth -
        ruler_2_response.asset_valuation.asset_wealth
    )

    return CompareResponse(
        ruler_1=ruler_1_response,
        ruler_2=ruler_2_response,
        comparison=ComparisonMetrics(
            wealth_ratio=wealth_ratio,
            winner=winner,
            income_diff=income_diff,
            asset_diff=asset_diff
        )
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

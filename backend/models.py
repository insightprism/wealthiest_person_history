"""
Pydantic models for SAVE API request/response validation.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator


class RulerInput(BaseModel):
    """Input parameters for a sovereign ruler valuation."""

    ruler_name: str = Field(default="Unknown Ruler", description="Name of the ruler/empire")
    year: Optional[int] = Field(default=None, description="Historical year")

    # Income parameters
    population: int = Field(..., gt=0, description="Number of subjects/citizens")
    base_output: float = Field(default=1.0, gt=0, description="Gold-equivalent value per person per year (oz)")
    velocity: float = Field(default=4.0, ge=2.0, le=8.0, description="Economic transaction frequency multiplier")
    extraction_margin: float = Field(default=0.10, ge=0.01, le=0.50, description="% of total activity captured by ruler")
    capitalization_multiple: float = Field(default=20.0, ge=1, le=100, description="Multiple on recurring income")

    # Asset parameters
    liquid_treasury: float = Field(default=0.0, ge=0, description="Physical gold/silver in vault (oz)")
    imperial_real_estate: float = Field(default=0.0, ge=0, description="Direct ownership: mines, palaces, estates (oz)")
    extraordinary_gains: float = Field(default=0.0, ge=0, description="Non-recurring: ransoms, pillage, seized treasures (oz)")

    @field_validator('velocity')
    @classmethod
    def validate_velocity(cls, v):
        if not (2.0 <= v <= 8.0):
            raise ValueError('Velocity must be between 2.0 and 8.0')
        return v


class IncomeValuationResponse(BaseModel):
    """Income-based valuation results."""
    annual_gross_revenue: float
    annual_imperial_income: float
    income_wealth: float


class AssetValuationResponse(BaseModel):
    """Asset-based valuation results."""
    infrastructure_floor: float
    liquid_treasury: float
    imperial_real_estate: float
    extraordinary_gains: float
    asset_wealth: float


class CFOMetricsResponse(BaseModel):
    """CFO dashboard metrics."""
    income_to_asset_ratio: float
    extraction_efficiency: float
    per_capita_wealth: float
    annual_yield: float


class FormattedValues(BaseModel):
    """Human-readable formatted values."""
    annual_imperial_income: str
    income_wealth: str
    asset_wealth: str
    total_real_wealth: str


class ValuationResponse(BaseModel):
    """Complete valuation response."""
    ruler_name: str
    year: Optional[int]
    inputs: RulerInput
    income_valuation: IncomeValuationResponse
    asset_valuation: AssetValuationResponse
    total_real_wealth: float
    cfo_metrics: CFOMetricsResponse
    formatted: FormattedValues


class SensitivityEntry(BaseModel):
    """Single sensitivity analysis entry."""
    value: float
    total_wealth: float
    change_pct: float


class SensitivityVariable(BaseModel):
    """Sensitivity results for one variable."""
    minus_20: SensitivityEntry
    minus_10: SensitivityEntry
    plus_10: SensitivityEntry
    plus_20: SensitivityEntry


class SensitivityResponse(BaseModel):
    """Complete sensitivity analysis response."""
    base_case: dict
    sensitivity: dict


class CompareRequest(BaseModel):
    """Request for comparing two rulers."""
    ruler_1: RulerInput
    ruler_2: RulerInput


class ComparisonMetrics(BaseModel):
    """Metrics comparing two rulers."""
    wealth_ratio: float
    winner: str
    income_diff: float
    asset_diff: float


class CompareResponse(BaseModel):
    """Response for ruler comparison."""
    ruler_1: ValuationResponse
    ruler_2: ValuationResponse
    comparison: ComparisonMetrics

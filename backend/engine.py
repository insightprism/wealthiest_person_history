"""
Sovereign Asset Valuation Engine (SAVE)
Consolidated Imperial Valuation (CIV) Calculator

All values expressed in Gold Ounces (oz) to neutralize inflation and currency debasement.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class IncomeValuation:
    """Income-based valuation results."""
    annual_gross_revenue: float
    annual_imperial_income: float
    income_wealth: float


@dataclass
class AssetValuation:
    """Asset-based valuation results."""
    infrastructure_floor: float
    liquid_treasury: float
    imperial_real_estate: float
    extraordinary_gains: float
    asset_wealth: float


@dataclass
class CFOMetrics:
    """Executive dashboard metrics."""
    income_to_asset_ratio: float
    extraction_efficiency: float
    per_capita_wealth: float
    annual_yield: float


@dataclass
class ValuationResult:
    """Complete valuation result."""
    ruler_name: str
    year: Optional[int]
    income_valuation: IncomeValuation
    asset_valuation: AssetValuation
    total_real_wealth: float
    cfo_metrics: CFOMetrics


class SAVEEngine:
    """
    Sovereign Asset Valuation Engine

    Calculates Real Wealth using the Consolidated Imperial Valuation (CIV) methodology.
    """

    # Default values
    DEFAULT_BASE_OUTPUT = 1.0
    DEFAULT_VELOCITY = 4.0
    DEFAULT_EXTRACTION_MARGIN = 0.10
    DEFAULT_CAPITALIZATION_MULTIPLE = 20.0
    INFRASTRUCTURE_FACTOR = 0.05

    def __init__(
        self,
        population: int,
        base_output: float = DEFAULT_BASE_OUTPUT,
        velocity: float = DEFAULT_VELOCITY,
        extraction_margin: float = DEFAULT_EXTRACTION_MARGIN,
        capitalization_multiple: float = DEFAULT_CAPITALIZATION_MULTIPLE,
        liquid_treasury: float = 0.0,
        imperial_real_estate: float = 0.0,
        extraordinary_gains: float = 0.0,
        ruler_name: str = "Unknown Ruler",
        year: Optional[int] = None
    ):
        self.population = population
        self.base_output = base_output
        self.velocity = velocity
        self.extraction_margin = extraction_margin
        self.capitalization_multiple = capitalization_multiple
        self.liquid_treasury = liquid_treasury
        self.imperial_real_estate = imperial_real_estate
        self.extraordinary_gains = extraordinary_gains
        self.ruler_name = ruler_name
        self.year = year

        self._validate_inputs()

    def _validate_inputs(self) -> None:
        """Validate all input parameters."""
        if self.population <= 0:
            raise ValueError("Population must be greater than 0")
        if self.base_output <= 0:
            raise ValueError("Base output must be greater than 0")
        if not (2.0 <= self.velocity <= 8.0):
            raise ValueError("Velocity must be between 2.0 and 8.0")
        if not (0.01 <= self.extraction_margin <= 0.50):
            raise ValueError("Extraction margin must be between 0.01 and 0.50")
        if not (1 <= self.capitalization_multiple <= 100):
            raise ValueError("Capitalization multiple must be between 1 and 100")
        if self.liquid_treasury < 0:
            raise ValueError("Liquid treasury cannot be negative")
        if self.imperial_real_estate < 0:
            raise ValueError("Imperial real estate cannot be negative")
        if self.extraordinary_gains < 0:
            raise ValueError("Extraordinary gains cannot be negative")

    def calculate_income_valuation(self) -> IncomeValuation:
        """
        Calculate income-based valuation (The Operating Business).

        Formula: Wealth_Income = (N × B × V × M) × K
        """
        # Annual Gross Revenue = N × B × V
        agr = self.population * self.base_output * self.velocity

        # Annual Imperial Income = AGR × M
        aii = agr * self.extraction_margin

        # Income Wealth = AII × K
        income_wealth = aii * self.capitalization_multiple

        return IncomeValuation(
            annual_gross_revenue=agr,
            annual_imperial_income=aii,
            income_wealth=income_wealth
        )

    def calculate_asset_valuation(self) -> AssetValuation:
        """
        Calculate asset-based valuation (The Balance Sheet).

        Formula: Wealth_Assets = I + L + R + E
        """
        # Infrastructure Floor = (N × B) × 0.05
        infrastructure_floor = (self.population * self.base_output) * self.INFRASTRUCTURE_FACTOR

        # Total Asset Wealth
        asset_wealth = (
            infrastructure_floor +
            self.liquid_treasury +
            self.imperial_real_estate +
            self.extraordinary_gains
        )

        return AssetValuation(
            infrastructure_floor=infrastructure_floor,
            liquid_treasury=self.liquid_treasury,
            imperial_real_estate=self.imperial_real_estate,
            extraordinary_gains=self.extraordinary_gains,
            asset_wealth=asset_wealth
        )

    def calculate_cfo_metrics(
        self,
        income_valuation: IncomeValuation,
        asset_valuation: AssetValuation,
        total_wealth: float
    ) -> CFOMetrics:
        """Calculate CFO dashboard metrics."""
        # Income-to-Asset Ratio
        income_to_asset_ratio = (
            income_valuation.income_wealth / asset_valuation.asset_wealth
            if asset_valuation.asset_wealth > 0 else 0.0
        )

        # Extraction Efficiency (just the margin value)
        extraction_efficiency = self.extraction_margin

        # Per Capita Wealth
        per_capita_wealth = total_wealth / self.population

        # Annual Yield (AII as % of Total Wealth)
        annual_yield = (
            income_valuation.annual_imperial_income / total_wealth * 100
            if total_wealth > 0 else 0.0
        )

        return CFOMetrics(
            income_to_asset_ratio=round(income_to_asset_ratio, 2),
            extraction_efficiency=extraction_efficiency,
            per_capita_wealth=round(per_capita_wealth, 2),
            annual_yield=round(annual_yield, 2)
        )

    def calculate(self) -> ValuationResult:
        """
        Perform full valuation calculation.

        Returns complete ValuationResult with all metrics.
        """
        income_valuation = self.calculate_income_valuation()
        asset_valuation = self.calculate_asset_valuation()

        total_real_wealth = income_valuation.income_wealth + asset_valuation.asset_wealth

        cfo_metrics = self.calculate_cfo_metrics(
            income_valuation,
            asset_valuation,
            total_real_wealth
        )

        return ValuationResult(
            ruler_name=self.ruler_name,
            year=self.year,
            income_valuation=income_valuation,
            asset_valuation=asset_valuation,
            total_real_wealth=total_real_wealth,
            cfo_metrics=cfo_metrics
        )

    def sensitivity_analysis(self, variations: list[float] = None) -> dict:
        """
        Perform sensitivity analysis on Base Output (B) and Velocity (V).

        Args:
            variations: List of percentage variations (e.g., [-0.20, -0.10, 0.10, 0.20])

        Returns:
            Dictionary with sensitivity results for each variable.
        """
        if variations is None:
            variations = [-0.20, -0.10, 0.10, 0.20]

        base_result = self.calculate()
        base_wealth = base_result.total_real_wealth

        sensitivity = {
            "base_output": {},
            "velocity": {}
        }

        # Sensitivity for Base Output (B)
        for var in variations:
            adjusted_b = self.base_output * (1 + var)
            engine = SAVEEngine(
                population=self.population,
                base_output=adjusted_b,
                velocity=self.velocity,
                extraction_margin=self.extraction_margin,
                capitalization_multiple=self.capitalization_multiple,
                liquid_treasury=self.liquid_treasury,
                imperial_real_estate=self.imperial_real_estate,
                extraordinary_gains=self.extraordinary_gains,
                ruler_name=self.ruler_name,
                year=self.year
            )
            result = engine.calculate()
            change_pct = ((result.total_real_wealth - base_wealth) / base_wealth) * 100

            key = f"{'minus' if var < 0 else 'plus'}_{abs(int(var * 100))}"
            sensitivity["base_output"][key] = {
                "value": round(adjusted_b, 2),
                "total_wealth": result.total_real_wealth,
                "change_pct": round(change_pct, 2)
            }

        # Sensitivity for Velocity (V)
        for var in variations:
            adjusted_v = self.velocity * (1 + var)
            # Clamp to valid range
            adjusted_v = max(2.0, min(8.0, adjusted_v))

            engine = SAVEEngine(
                population=self.population,
                base_output=self.base_output,
                velocity=adjusted_v,
                extraction_margin=self.extraction_margin,
                capitalization_multiple=self.capitalization_multiple,
                liquid_treasury=self.liquid_treasury,
                imperial_real_estate=self.imperial_real_estate,
                extraordinary_gains=self.extraordinary_gains,
                ruler_name=self.ruler_name,
                year=self.year
            )
            result = engine.calculate()
            change_pct = ((result.total_real_wealth - base_wealth) / base_wealth) * 100

            key = f"{'minus' if var < 0 else 'plus'}_{abs(int(var * 100))}"
            sensitivity["velocity"][key] = {
                "value": round(adjusted_v, 2),
                "total_wealth": result.total_real_wealth,
                "change_pct": round(change_pct, 2)
            }

        return {
            "base_case": {
                "total_real_wealth": base_wealth
            },
            "sensitivity": sensitivity
        }


def format_gold_oz(value: float) -> str:
    """Format a gold oz value with appropriate suffix (K, M, B)."""
    if value >= 1_000_000_000:
        return f"{value / 1_000_000_000:.3f}B oz"
    elif value >= 1_000_000:
        return f"{value / 1_000_000:.1f}M oz"
    elif value >= 1_000:
        return f"{value / 1_000:.1f}K oz"
    else:
        return f"{value:.0f} oz"

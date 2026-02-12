"""
Unit tests for SAVE Engine - Verification Test Cases

Tests the Consolidated Imperial Valuation (CIV) methodology against expected values.
"""

import pytest
from engine import SAVEEngine, format_gold_oz


class TestBritishEmpire1913:
    """
    Case 1: British Empire (1913)

    N: 412,000,000 | B: 1.0 | V: 6.5 | M: 0.10 | K: 20 | L: 30,000,000 oz | E: 0
    Expected Total: ~5.406 Billion oz
    """

    @pytest.fixture
    def engine(self):
        return SAVEEngine(
            population=412_000_000,
            base_output=1.0,
            velocity=6.5,
            extraction_margin=0.10,
            capitalization_multiple=20.0,
            liquid_treasury=30_000_000,
            imperial_real_estate=0,
            extraordinary_gains=0,
            ruler_name="British Empire",
            year=1913
        )

    def test_annual_gross_revenue(self, engine):
        """AGR = 412M × 1.0 × 6.5 = 2,678M oz"""
        result = engine.calculate()
        expected_agr = 412_000_000 * 1.0 * 6.5  # 2,678,000,000
        assert result.income_valuation.annual_gross_revenue == expected_agr

    def test_annual_imperial_income(self, engine):
        """AII = 2,678M × 0.10 = 267.8M oz"""
        result = engine.calculate()
        expected_aii = 2_678_000_000 * 0.10  # 267,800,000
        assert result.income_valuation.annual_imperial_income == expected_aii

    def test_income_wealth(self, engine):
        """Income Wealth = 267.8M × 20 = 5,356M oz"""
        result = engine.calculate()
        expected_income = 267_800_000 * 20  # 5,356,000,000
        assert result.income_valuation.income_wealth == expected_income

    def test_infrastructure_floor(self, engine):
        """I = (412M × 1.0) × 0.05 = 20.6M oz"""
        result = engine.calculate()
        expected_infra = (412_000_000 * 1.0) * 0.05  # 20,600,000
        assert result.asset_valuation.infrastructure_floor == expected_infra

    def test_asset_wealth(self, engine):
        """Asset Wealth = 20.6M + 30M = 50.6M oz"""
        result = engine.calculate()
        expected_assets = 20_600_000 + 30_000_000  # 50,600,000
        assert result.asset_valuation.asset_wealth == expected_assets

    def test_total_real_wealth(self, engine):
        """Total = 5,356M + 50.6M = 5,406.6M oz (~5.407B oz)"""
        result = engine.calculate()
        expected_total = 5_356_000_000 + 50_600_000  # 5,406,600,000
        assert result.total_real_wealth == expected_total
        # Check against spec value of ~5.406B oz (within 0.1%)
        assert abs(result.total_real_wealth - 5_406_000_000) < 1_000_000

    def test_formatted_output(self, engine):
        """Test human-readable formatting"""
        result = engine.calculate()
        assert format_gold_oz(result.total_real_wealth) == "5.407B oz"
        assert format_gold_oz(result.income_valuation.annual_imperial_income) == "267.8M oz"


class TestRomanEmpireAugustus:
    """
    Case 2: Roman Empire (Augustus, 14 AD)

    N: 60,000,000 | B: 0.8 oz | V: 4.5 | M: 0.12 | K: 20
    L: 200,000 oz | R: 0 | E: 1,000,000 oz (Egypt Pillage)
    Expected Total: ~522M oz
    """

    @pytest.fixture
    def engine(self):
        return SAVEEngine(
            population=60_000_000,
            base_output=0.8,
            velocity=4.5,
            extraction_margin=0.12,
            capitalization_multiple=20.0,
            liquid_treasury=200_000,
            imperial_real_estate=0,
            extraordinary_gains=1_000_000,
            ruler_name="Roman Empire (Augustus)",
            year=14
        )

    def test_annual_gross_revenue(self, engine):
        """AGR = 60M × 0.8 × 4.5 = 216M oz"""
        result = engine.calculate()
        expected_agr = 60_000_000 * 0.8 * 4.5  # 216,000,000
        assert result.income_valuation.annual_gross_revenue == expected_agr

    def test_annual_imperial_income(self, engine):
        """AII = 216M × 0.12 = 25.92M oz"""
        result = engine.calculate()
        expected_aii = 216_000_000 * 0.12  # 25,920,000
        assert result.income_valuation.annual_imperial_income == expected_aii

    def test_income_wealth(self, engine):
        """Income Wealth = 25.92M × 20 = 518.4M oz"""
        result = engine.calculate()
        expected_income = 25_920_000 * 20  # 518,400,000
        assert result.income_valuation.income_wealth == expected_income

    def test_infrastructure_floor(self, engine):
        """I = (60M × 0.8) × 0.05 = 2.4M oz"""
        result = engine.calculate()
        expected_infra = (60_000_000 * 0.8) * 0.05  # 2,400,000
        assert result.asset_valuation.infrastructure_floor == expected_infra

    def test_asset_wealth(self, engine):
        """Asset Wealth = 2.4M + 0.2M + 1.0M = 3.6M oz"""
        result = engine.calculate()
        expected_assets = 2_400_000 + 200_000 + 1_000_000  # 3,600,000
        assert result.asset_valuation.asset_wealth == expected_assets

    def test_total_real_wealth(self, engine):
        """Total = 518.4M + 3.6M = 522M oz"""
        result = engine.calculate()
        expected_total = 518_400_000 + 3_600_000  # 522,000,000
        assert result.total_real_wealth == expected_total

    def test_formatted_output(self, engine):
        """Test human-readable formatting"""
        result = engine.calculate()
        assert format_gold_oz(result.total_real_wealth) == "522.0M oz"


class TestCFOMetrics:
    """Test CFO Dashboard metrics calculations."""

    def test_income_to_asset_ratio(self):
        """Test Income-to-Asset Ratio calculation."""
        engine = SAVEEngine(
            population=412_000_000,
            base_output=1.0,
            velocity=6.5,
            extraction_margin=0.10,
            capitalization_multiple=20.0,
            liquid_treasury=30_000_000,
            ruler_name="British Empire",
            year=1913
        )
        result = engine.calculate()
        # Income Wealth / Asset Wealth = 5,356M / 50.6M = ~105.85
        expected_ratio = 5_356_000_000 / 50_600_000
        assert abs(result.cfo_metrics.income_to_asset_ratio - expected_ratio) < 0.01

    def test_per_capita_wealth(self):
        """Test Per Capita Wealth calculation."""
        engine = SAVEEngine(
            population=412_000_000,
            base_output=1.0,
            velocity=6.5,
            extraction_margin=0.10,
            capitalization_multiple=20.0,
            liquid_treasury=30_000_000,
            ruler_name="British Empire",
            year=1913
        )
        result = engine.calculate()
        # Total / Population = 5,406.6M / 412M = ~13.12 oz
        expected_per_capita = 5_406_600_000 / 412_000_000
        assert abs(result.cfo_metrics.per_capita_wealth - expected_per_capita) < 0.01


class TestSensitivityAnalysis:
    """Test sensitivity analysis functionality."""

    def test_sensitivity_returns_expected_structure(self):
        """Test that sensitivity analysis returns expected keys."""
        engine = SAVEEngine(
            population=100_000_000,
            base_output=1.0,
            velocity=4.0,
            extraction_margin=0.10,
            capitalization_multiple=20.0
        )
        result = engine.sensitivity_analysis()

        assert "base_case" in result
        assert "sensitivity" in result
        assert "base_output" in result["sensitivity"]
        assert "velocity" in result["sensitivity"]

        for var in ["base_output", "velocity"]:
            assert "minus_20" in result["sensitivity"][var]
            assert "minus_10" in result["sensitivity"][var]
            assert "plus_10" in result["sensitivity"][var]
            assert "plus_20" in result["sensitivity"][var]

    def test_sensitivity_direction(self):
        """Test that sensitivity changes are in correct direction."""
        engine = SAVEEngine(
            population=100_000_000,
            base_output=1.0,
            velocity=4.0,
            extraction_margin=0.10,
            capitalization_multiple=20.0
        )
        result = engine.sensitivity_analysis()
        base_wealth = result["base_case"]["total_real_wealth"]

        # Higher values should produce higher wealth
        assert result["sensitivity"]["base_output"]["plus_20"]["total_wealth"] > base_wealth
        assert result["sensitivity"]["base_output"]["minus_20"]["total_wealth"] < base_wealth
        assert result["sensitivity"]["velocity"]["plus_10"]["total_wealth"] > base_wealth
        assert result["sensitivity"]["velocity"]["minus_10"]["total_wealth"] < base_wealth


class TestInputValidation:
    """Test input validation."""

    def test_negative_population_raises(self):
        """Population must be positive."""
        with pytest.raises(ValueError, match="Population must be greater than 0"):
            SAVEEngine(population=-100)

    def test_zero_population_raises(self):
        """Population must be positive."""
        with pytest.raises(ValueError, match="Population must be greater than 0"):
            SAVEEngine(population=0)

    def test_velocity_out_of_range_raises(self):
        """Velocity must be between 2.0 and 8.0."""
        with pytest.raises(ValueError, match="Velocity must be between 2.0 and 8.0"):
            SAVEEngine(population=100, velocity=1.5)

        with pytest.raises(ValueError, match="Velocity must be between 2.0 and 8.0"):
            SAVEEngine(population=100, velocity=9.0)

    def test_extraction_margin_out_of_range_raises(self):
        """Extraction margin must be between 0.01 and 0.50."""
        with pytest.raises(ValueError, match="Extraction margin must be between 0.01 and 0.50"):
            SAVEEngine(population=100, extraction_margin=0.005)

        with pytest.raises(ValueError, match="Extraction margin must be between 0.01 and 0.50"):
            SAVEEngine(population=100, extraction_margin=0.75)


class TestFormatGoldOz:
    """Test gold oz formatting function."""

    def test_format_billions(self):
        assert format_gold_oz(5_406_600_000) == "5.407B oz"
        assert format_gold_oz(1_000_000_000) == "1.000B oz"

    def test_format_millions(self):
        assert format_gold_oz(267_800_000) == "267.8M oz"
        assert format_gold_oz(50_600_000) == "50.6M oz"
        assert format_gold_oz(1_500_000) == "1.5M oz"

    def test_format_thousands(self):
        assert format_gold_oz(500_000) == "500.0K oz"
        assert format_gold_oz(1_000) == "1.0K oz"

    def test_format_units(self):
        assert format_gold_oz(500) == "500 oz"
        assert format_gold_oz(1) == "1 oz"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

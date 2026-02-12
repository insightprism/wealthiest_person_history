export default function ResultsTable({ results, goldPrice, sensitivity }) {
  if (!results) return null;

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const formatDollars = (num) => {
    if (num >= 1_000_000_000_000) {
      return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
    } else if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatGoldOz = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(3)}B oz`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M oz`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K oz`;
    }
    return `${value.toFixed(0)} oz`;
  };

  const nominalValue = results.total_real_wealth * (goldPrice || 2900);

  const generateReport = () => {
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0];

    let report = `# Sovereign Asset Valuation Report

## ${results.ruler_name}${results.year ? ` (${results.year})` : ''}

**Generated:** ${now.toLocaleString()}
**Methodology:** Consolidated Imperial Valuation (CIV)
**Currency:** Gold Ounces (oz)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Real Wealth** | **${results.formatted.total_real_wealth}** |
| **Nominal Dollar Value** | **${formatDollars(nominalValue)}** |
| Gold Price Used | $${formatNumber(goldPrice || 2900)}/oz |

---

## Input Parameters

### Income Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Population (N) | ${formatNumber(results.inputs.population)} | Total subjects/citizens |
| Base Output (B) | ${results.inputs.base_output} oz/person/year | Annual gold-equivalent output per person |
| Velocity (V) | ${results.inputs.velocity} | Economic transaction frequency multiplier |
| Extraction Margin (M) | ${(results.inputs.extraction_margin * 100).toFixed(1)}% | % of economic activity captured |
| Capitalization Multiple (K) | ${results.inputs.capitalization_multiple}x | Multiple on recurring income |

### Asset Parameters

| Parameter | Value |
|-----------|-------|
| Liquid Treasury (L) | ${formatNumber(results.inputs.liquid_treasury)} oz |
| Imperial Real Estate (R) | ${formatNumber(results.inputs.imperial_real_estate)} oz |
| Extraordinary Gains (E) | ${formatNumber(results.inputs.extraordinary_gains)} oz |

---

## Valuation Results

### Income Valuation (Operating Business)

| Metric | Formula | Value |
|--------|---------|-------|
| Annual Gross Revenue (AGR) | N × B × V | ${formatNumber(results.income_valuation.annual_gross_revenue)} oz |
| Annual Imperial Income (AII) | AGR × M | ${results.formatted.annual_imperial_income} |
| **Income Wealth** | AII × K | **${results.formatted.income_wealth}** |

### Asset Valuation (Balance Sheet)

| Component | Formula/Source | Value |
|-----------|----------------|-------|
| Infrastructure Floor (I) | (N × B) × 0.05 | ${formatNumber(results.asset_valuation.infrastructure_floor)} oz |
| Liquid Treasury (L) | Input | ${formatNumber(results.asset_valuation.liquid_treasury)} oz |
| Imperial Real Estate (R) | Input | ${formatNumber(results.asset_valuation.imperial_real_estate)} oz |
| Extraordinary Gains (E) | Input | ${formatNumber(results.asset_valuation.extraordinary_gains)} oz |
| **Asset Wealth** | I + L + R + E | **${results.formatted.asset_wealth}** |

### Total Valuation

| Component | Value |
|-----------|-------|
| Income Wealth | ${results.formatted.income_wealth} |
| Asset Wealth | ${results.formatted.asset_wealth} |
| **Total Real Wealth** | **${results.formatted.total_real_wealth}** |
| | ${formatNumber(results.total_real_wealth)} gold ounces |

### Nominal Dollar Value

| Gold Price | Total Real Wealth | Nominal Value |
|------------|-------------------|---------------|
| $${formatNumber(goldPrice || 2900)}/oz | ${formatNumber(results.total_real_wealth)} oz | **${formatDollars(nominalValue)}** |
| | | $${formatNumber(nominalValue)} USD |

---

## CFO Dashboard Metrics

| Metric | Value | Description |
|--------|-------|-------------|
| Income-to-Asset Ratio | ${results.cfo_metrics.income_to_asset_ratio}x | Income Wealth / Asset Wealth |
| Extraction Efficiency | ${(results.cfo_metrics.extraction_efficiency * 100).toFixed(1)}% | % of economic activity captured |
| Per Capita Wealth | ${results.cfo_metrics.per_capita_wealth} oz | Total Wealth / Population |
| Annual Yield | ${results.cfo_metrics.annual_yield}% | AII as % of Total Wealth |

### Wealth Composition

- **Income Wealth:** ${((results.income_valuation.income_wealth / results.total_real_wealth) * 100).toFixed(1)}%
- **Asset Wealth:** ${((results.asset_valuation.asset_wealth / results.total_real_wealth) * 100).toFixed(1)}%

`;

    // Add sensitivity analysis if available
    if (sensitivity && sensitivity.sensitivity) {
      report += `---

## Sensitivity Analysis

### Base Output (B) Sensitivity

| Variation | B Value | Total Wealth | Change |
|-----------|---------|--------------|--------|
| -20% | ${sensitivity.sensitivity.base_output.minus_20.value} | ${formatGoldOz(sensitivity.sensitivity.base_output.minus_20.total_wealth)} | ${sensitivity.sensitivity.base_output.minus_20.change_pct.toFixed(1)}% |
| -10% | ${sensitivity.sensitivity.base_output.minus_10.value} | ${formatGoldOz(sensitivity.sensitivity.base_output.minus_10.total_wealth)} | ${sensitivity.sensitivity.base_output.minus_10.change_pct.toFixed(1)}% |
| +10% | ${sensitivity.sensitivity.base_output.plus_10.value} | ${formatGoldOz(sensitivity.sensitivity.base_output.plus_10.total_wealth)} | +${sensitivity.sensitivity.base_output.plus_10.change_pct.toFixed(1)}% |
| +20% | ${sensitivity.sensitivity.base_output.plus_20.value} | ${formatGoldOz(sensitivity.sensitivity.base_output.plus_20.total_wealth)} | +${sensitivity.sensitivity.base_output.plus_20.change_pct.toFixed(1)}% |

### Velocity (V) Sensitivity

| Variation | V Value | Total Wealth | Change |
|-----------|---------|--------------|--------|
| -20% | ${sensitivity.sensitivity.velocity.minus_20.value} | ${formatGoldOz(sensitivity.sensitivity.velocity.minus_20.total_wealth)} | ${sensitivity.sensitivity.velocity.minus_20.change_pct.toFixed(1)}% |
| -10% | ${sensitivity.sensitivity.velocity.minus_10.value} | ${formatGoldOz(sensitivity.sensitivity.velocity.minus_10.total_wealth)} | ${sensitivity.sensitivity.velocity.minus_10.change_pct.toFixed(1)}% |
| +10% | ${sensitivity.sensitivity.velocity.plus_10.value} | ${formatGoldOz(sensitivity.sensitivity.velocity.plus_10.total_wealth)} | +${sensitivity.sensitivity.velocity.plus_10.change_pct.toFixed(1)}% |
| +20% | ${sensitivity.sensitivity.velocity.plus_20.value} | ${formatGoldOz(sensitivity.sensitivity.velocity.plus_20.total_wealth)} | +${sensitivity.sensitivity.velocity.plus_20.change_pct.toFixed(1)}% |

`;
    }

    report += `---

## JSON Data (for programmatic use)

\`\`\`json
${JSON.stringify({
  ruler_name: results.ruler_name,
  year: results.year,
  inputs: results.inputs,
  results: {
    income_valuation: results.income_valuation,
    asset_valuation: results.asset_valuation,
    total_real_wealth: results.total_real_wealth,
    nominal_value_usd: nominalValue,
    gold_price_usd: goldPrice || 2900
  },
  cfo_metrics: results.cfo_metrics
}, null, 2)}
\`\`\`

---

*Report generated by Sovereign Asset Valuation Engine (SAVE)*
*Methodology: Consolidated Imperial Valuation (CIV)*
`;

    // Create and download the file
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (results.ruler_name || 'unknown').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    a.download = `save_report_${safeName}_${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-amber-400">
          {results.ruler_name}
          {results.year && <span className="text-gray-400 ml-2">({results.year})</span>}
        </h2>
        <button
          onClick={generateReport}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Save Report
        </button>
      </div>

      {/* Income Valuation */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">
          Income Valuation (Operating Business)
        </h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="py-2 text-gray-400">Annual Gross Revenue (AGR)</td>
              <td className="py-2 text-right text-white">
                {formatNumber(results.income_valuation.annual_gross_revenue)} oz
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="py-2 text-gray-400">Annual Imperial Income (AII)</td>
              <td className="py-2 text-right text-white">
                {results.formatted.annual_imperial_income}
              </td>
            </tr>
            <tr className="bg-gray-700/30">
              <td className="py-2 text-gray-300 font-medium">Income Wealth (AII × K)</td>
              <td className="py-2 text-right text-amber-400 font-semibold">
                {results.formatted.income_wealth}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Asset Valuation */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">
          Asset Valuation (Balance Sheet)
        </h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="py-2 text-gray-400">Infrastructure Floor (I)</td>
              <td className="py-2 text-right text-white">
                {formatNumber(results.asset_valuation.infrastructure_floor)} oz
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="py-2 text-gray-400">Liquid Treasury (L)</td>
              <td className="py-2 text-right text-white">
                {formatNumber(results.asset_valuation.liquid_treasury)} oz
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="py-2 text-gray-400">Imperial Real Estate (R)</td>
              <td className="py-2 text-right text-white">
                {formatNumber(results.asset_valuation.imperial_real_estate)} oz
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="py-2 text-gray-400">Extraordinary Gains (E)</td>
              <td className="py-2 text-right text-white">
                {formatNumber(results.asset_valuation.extraordinary_gains)} oz
              </td>
            </tr>
            <tr className="bg-gray-700/30">
              <td className="py-2 text-gray-300 font-medium">Asset Wealth</td>
              <td className="py-2 text-right text-amber-400 font-semibold">
                {results.formatted.asset_wealth}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total Real Wealth */}
      <div className="bg-gradient-to-r from-amber-900/50 to-amber-800/30 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-white">Total Real Wealth</span>
          <span className="text-2xl font-bold text-amber-400">
            {results.formatted.total_real_wealth}
          </span>
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {formatNumber(results.total_real_wealth)} gold ounces
        </div>
      </div>

      {/* Nominal Dollar Value */}
      <div className="bg-gradient-to-r from-green-900/50 to-green-800/30 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-white">Nominal Dollar Value</span>
            <div className="text-xs text-gray-400">@ ${formatNumber(goldPrice || 2900)}/oz</div>
          </div>
          <span className="text-2xl font-bold text-green-400">
            {formatDollars(nominalValue)}
          </span>
        </div>
        <div className="text-sm text-gray-400 mt-1">
          ${formatNumber(nominalValue)} USD
        </div>
      </div>
    </div>
  );
}

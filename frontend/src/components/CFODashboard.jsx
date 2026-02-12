export default function CFODashboard({ results }) {
  if (!results) return null;

  const metrics = results.cfo_metrics;

  const MetricCard = ({ label, value, unit, description }) => (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">
        {value}
        {unit && <span className="text-lg text-gray-400 ml-1">{unit}</span>}
      </div>
      {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-amber-400 mb-4">CFO Dashboard</h2>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          label="Income-to-Asset Ratio"
          value={metrics.income_to_asset_ratio.toFixed(2)}
          unit="x"
          description="Income Wealth / Asset Wealth"
        />

        <MetricCard
          label="Extraction Efficiency"
          value={(metrics.extraction_efficiency * 100).toFixed(1)}
          unit="%"
          description="% of economic activity captured"
        />

        <MetricCard
          label="Per Capita Wealth"
          value={metrics.per_capita_wealth.toFixed(2)}
          unit="oz"
          description="Total Wealth / Population"
        />

        <MetricCard
          label="Annual Yield"
          value={metrics.annual_yield.toFixed(2)}
          unit="%"
          description="AII as % of Total Wealth"
        />
      </div>

      {/* Visual Indicator Bar */}
      <div className="mt-6">
        <div className="text-sm text-gray-400 mb-2">Wealth Composition</div>
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden flex">
          <div
            className="bg-amber-500 h-full"
            style={{
              width: `${
                (results.income_valuation.income_wealth / results.total_real_wealth) * 100
              }%`,
            }}
            title="Income Wealth"
          />
          <div
            className="bg-amber-700 h-full"
            style={{
              width: `${
                (results.asset_valuation.asset_wealth / results.total_real_wealth) * 100
              }%`,
            }}
            title="Asset Wealth"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Income Wealth ({((results.income_valuation.income_wealth / results.total_real_wealth) * 100).toFixed(1)}%)</span>
          <span>Asset Wealth ({((results.asset_valuation.asset_wealth / results.total_real_wealth) * 100).toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
}

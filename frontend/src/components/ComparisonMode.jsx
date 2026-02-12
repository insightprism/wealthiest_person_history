export default function ComparisonMode({ comparison, goldPrice, onClear }) {
  if (!comparison) return null;

  const { ruler_1, ruler_2, comparison: metrics } = comparison;

  const formatWealth = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(3)}B oz`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M oz`;
    }
    return `${(value / 1_000).toFixed(1)}K oz`;
  };

  const formatDollars = (num) => {
    if (num >= 1_000_000_000_000) {
      return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
    } else if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    }
    return `$${(num / 1_000).toFixed(2)}K`;
  };

  const ComparisonCard = ({ ruler, isWinner }) => {
    const nominalValue = ruler.total_real_wealth * (goldPrice || 2900);

    return (
      <div
        className={`bg-gray-700/50 rounded-lg p-4 ${
          isWinner ? 'ring-2 ring-amber-500' : ''
        }`}
      >
        {isWinner && (
          <div className="text-xs text-amber-400 font-semibold mb-2">WINNER</div>
        )}
        <h3 className="text-lg font-bold text-white mb-1">
          {ruler.ruler_name}
          {ruler.year && <span className="text-gray-400 ml-2">({ruler.year})</span>}
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Income Wealth</span>
            <span className="text-white">{ruler.formatted.income_wealth}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Asset Wealth</span>
            <span className="text-white">{ruler.formatted.asset_wealth}</span>
          </div>
          <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
            <span className="text-gray-300 font-medium">Total Wealth</span>
            <span className="text-amber-400 font-bold">{ruler.formatted.total_real_wealth}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300 font-medium">Nominal Value</span>
            <span className="text-green-400 font-bold">{formatDollars(nominalValue)}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-600 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Income/Asset</span>
            <div className="text-white">{ruler.cfo_metrics.income_to_asset_ratio}x</div>
          </div>
          <div>
            <span className="text-gray-500">Extraction</span>
            <div className="text-white">{(ruler.cfo_metrics.extraction_efficiency * 100).toFixed(1)}%</div>
          </div>
          <div>
            <span className="text-gray-500">Per Capita</span>
            <div className="text-white">{ruler.cfo_metrics.per_capita_wealth} oz</div>
          </div>
          <div>
            <span className="text-gray-500">Annual Yield</span>
            <div className="text-white">{ruler.cfo_metrics.annual_yield}%</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-400">Comparison Mode</h2>
        <button
          onClick={onClear}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm"
        >
          Clear Comparison
        </button>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        Gold Price: ${(goldPrice || 2900).toLocaleString()}/oz
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <ComparisonCard ruler={ruler_1} isWinner={metrics.winner === ruler_1.ruler_name} />
        <ComparisonCard ruler={ruler_2} isWinner={metrics.winner === ruler_2.ruler_name} />
      </div>

      {/* Comparison Summary */}
      <div className="bg-gradient-to-r from-amber-900/50 to-amber-800/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Comparison Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-sm">Wealth Ratio</div>
            <div className="text-2xl font-bold text-amber-400">{metrics.wealth_ratio}x</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Income Difference</div>
            <div className="text-lg font-semibold text-white">{formatWealth(metrics.income_diff)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Asset Difference</div>
            <div className="text-lg font-semibold text-white">{formatWealth(metrics.asset_diff)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

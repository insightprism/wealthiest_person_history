import { useState } from 'react';

export default function SensitivityTable({ sensitivity }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sensitivity) return null;

  const formatWealth = (value) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(3)}B oz`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M oz`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K oz`;
    }
    return `${value.toFixed(0)} oz`;
  };

  const renderVariationRow = (label, data) => {
    const isPositive = data.change_pct > 0;
    const changeClass = isPositive ? 'text-green-400' : 'text-red-400';
    const arrow = isPositive ? '↑' : '↓';

    return (
      <tr key={label} className="border-b border-gray-700">
        <td className="py-2 text-gray-400">{label}</td>
        <td className="py-2 text-right text-white">{data.value}</td>
        <td className="py-2 text-right text-white">{formatWealth(data.total_wealth)}</td>
        <td className={`py-2 text-right font-medium ${changeClass}`}>
          {arrow} {Math.abs(data.change_pct).toFixed(1)}%
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center text-left"
      >
        <h2 className="text-xl font-bold text-amber-400">Sensitivity Analysis</h2>
        <span className="text-gray-400 text-2xl">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-6">
          {/* Base Case */}
          <div className="bg-gray-700/30 rounded-lg p-3">
            <span className="text-gray-400">Base Case Total Wealth: </span>
            <span className="text-amber-400 font-semibold">
              {formatWealth(sensitivity.base_case.total_real_wealth)}
            </span>
          </div>

          {/* Base Output Sensitivity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3">
              Base Output (B) Sensitivity
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2 text-left text-gray-400">Variation</th>
                  <th className="py-2 text-right text-gray-400">B Value</th>
                  <th className="py-2 text-right text-gray-400">Total Wealth</th>
                  <th className="py-2 text-right text-gray-400">Change</th>
                </tr>
              </thead>
              <tbody>
                {renderVariationRow('-20%', sensitivity.sensitivity.base_output.minus_20)}
                {renderVariationRow('-10%', sensitivity.sensitivity.base_output.minus_10)}
                {renderVariationRow('+10%', sensitivity.sensitivity.base_output.plus_10)}
                {renderVariationRow('+20%', sensitivity.sensitivity.base_output.plus_20)}
              </tbody>
            </table>
          </div>

          {/* Velocity Sensitivity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-3">
              Velocity (V) Sensitivity
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-2 text-left text-gray-400">Variation</th>
                  <th className="py-2 text-right text-gray-400">V Value</th>
                  <th className="py-2 text-right text-gray-400">Total Wealth</th>
                  <th className="py-2 text-right text-gray-400">Change</th>
                </tr>
              </thead>
              <tbody>
                {renderVariationRow('-20%', sensitivity.sensitivity.velocity.minus_20)}
                {renderVariationRow('-10%', sensitivity.sensitivity.velocity.minus_10)}
                {renderVariationRow('+10%', sensitivity.sensitivity.velocity.plus_10)}
                {renderVariationRow('+20%', sensitivity.sensitivity.velocity.plus_20)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

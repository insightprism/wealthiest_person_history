import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsTable from './components/ResultsTable';
import SensitivityTable from './components/SensitivityTable';
import CFODashboard from './components/CFODashboard';
import ComparisonMode from './components/ComparisonMode';
import ResearchSummary from './components/ResearchSummary';

const API_BASE = 'http://localhost:22224';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [results, setResults] = useState(null);
  const [sensitivity, setSensitivity] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [comparisonQueue, setComparisonQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [goldPrice, setGoldPrice] = useState(2900);

  const handleCalculate = async (payload) => {
    setIsLoading(true);
    setError(null);

    // Extract gold price from payload and store it
    const { gold_price, ...apiPayload } = payload;
    setGoldPrice(gold_price || 2900);

    try {
      // Fetch both calculate and sensitivity in parallel
      const [calcResponse, sensResponse] = await Promise.all([
        fetch(`${API_BASE}/api/calculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload),
        }),
        fetch(`${API_BASE}/api/sensitivity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload),
        }),
      ]);

      if (!calcResponse.ok) {
        const errorData = await calcResponse.json();
        throw new Error(errorData.detail || 'Calculation failed');
      }

      const calcData = await calcResponse.json();
      const sensData = await sensResponse.json();

      setResults(calcData);
      setSensitivity(sensData);
      setComparison(null); // Clear comparison when doing single calculation
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToComparison = (payload) => {
    if (comparisonQueue.length === 0) {
      setComparisonQueue([payload]);
      setError(null);
    } else if (comparisonQueue.length === 1) {
      // We have two rulers, make the comparison API call
      performComparison(comparisonQueue[0], payload);
    }
  };

  const performComparison = async (ruler1, ruler2) => {
    setIsLoading(true);
    setError(null);

    // Extract gold prices
    const { gold_price: gp1, ...apiRuler1 } = ruler1;
    const { gold_price: gp2, ...apiRuler2 } = ruler2;
    setGoldPrice(gp2 || gp1 || 2900);

    try {
      const response = await fetch(`${API_BASE}/api/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruler_1: apiRuler1, ruler_2: apiRuler2 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Comparison failed');
      }

      const data = await response.json();
      setComparison(data);
      setResults(null);
      setSensitivity(null);
      setComparisonQueue([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearComparison = () => {
    setComparison(null);
    setComparisonQueue([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-amber-400">
            Sovereign Asset Valuation Engine
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Calculate Real Wealth in Gold Ounces using the Consolidated Imperial Valuation (CIV) methodology
          </p>
        </div>
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'calculator'
                  ? 'bg-gray-900 text-amber-400 border-t border-l border-r border-gray-700'
                  : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'research'
                  ? 'bg-gray-900 text-amber-400 border-t border-l border-r border-gray-700'
                  : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              Research Summary
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <>
            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Comparison Queue Indicator */}
            {comparisonQueue.length === 1 && (
              <div className="mb-6 bg-amber-900/50 border border-amber-500 text-amber-200 px-4 py-3 rounded-lg flex justify-between items-center">
                <span>
                  <strong>{comparisonQueue[0].ruler_name}</strong> added to comparison.
                  Add another ruler to compare.
                </span>
                <button
                  onClick={() => setComparisonQueue([])}
                  className="text-amber-400 hover:text-amber-300"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Input Form */}
              <div>
                <InputForm
                  onCalculate={handleCalculate}
                  onAddToComparison={handleAddToComparison}
                  isLoading={isLoading}
                />
              </div>

              {/* Right Column: Results */}
              <div className="space-y-6">
                {/* Comparison Mode */}
                {comparison && (
                  <ComparisonMode comparison={comparison} goldPrice={goldPrice} onClear={clearComparison} />
                )}

                {/* Single Calculation Results */}
                {results && (
                  <>
                    <ResultsTable results={results} goldPrice={goldPrice} sensitivity={sensitivity} />
                    <CFODashboard results={results} />
                    <SensitivityTable sensitivity={sensitivity} />
                  </>
                )}

                {/* Empty State */}
                {!results && !comparison && (
                  <div className="bg-gray-800 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">🪙</div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      Enter Parameters to Calculate
                    </h3>
                    <p className="text-gray-500">
                      Fill in the input form and click "Calculate Wealth" to see the valuation results.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Research Summary Tab */}
        {activeTab === 'research' && (
          <ResearchSummary />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          SAVE - Sovereign Asset Valuation Engine | All values in Gold Ounces (oz)
        </div>
      </footer>
    </div>
  );
}

export default App;

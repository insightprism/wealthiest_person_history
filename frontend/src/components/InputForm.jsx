import { useState } from 'react';

const defaultValues = {
  ruler_name: '',
  year: '',
  population: '',
  base_output: '1.0',
  velocity: '4.0',
  extraction_margin: '0.10',
  capitalization_multiple: '20',
  liquid_treasury: '0',
  imperial_real_estate: '0',
  extraordinary_gains: '0',
  gold_price: '2900',
};

const presets = {
  british_empire: {
    ruler_name: 'British Empire',
    year: '1913',
    population: '412,000,000',
    base_output: '1.0',
    velocity: '6.5',
    extraction_margin: '0.10',
    capitalization_multiple: '20',
    liquid_treasury: '30,000,000',
    imperial_real_estate: '0',
    extraordinary_gains: '0',
    gold_price: '2900',
  },
  roman_empire: {
    ruler_name: 'Roman Empire (Augustus)',
    year: '14',
    population: '60,000,000',
    base_output: '0.8',
    velocity: '4.5',
    extraction_margin: '0.12',
    capitalization_multiple: '20',
    liquid_treasury: '200,000',
    imperial_real_estate: '0',
    extraordinary_gains: '1,000,000',
    gold_price: '2900',
  },
};

// Parameter definitions for tooltips
const definitions = {
  ruler_name: "The name of the sovereign ruler or empire being valued.",
  year: "The historical year for which the valuation is being calculated.",
  population: "Total number of subjects or citizens under the ruler's control. This is the primary driver of economic output.",
  base_output: "The annual gold-equivalent value produced by one person (in oz). Default is 1.0 oz per person per year. Represents the productive capacity of an average subject.",
  velocity: "The rate of economic exchange or transaction frequency. Ranges from 2.0 (agrarian/subsistence economy) to 8.0 (highly developed industrial/commercial economy). Higher velocity means money changes hands more frequently.",
  extraction_margin: "The percentage of total economic activity captured by the ruler through taxes, tariffs, monopolies, and tribute. Typical range: 5-15% for light taxation, 15-30% for heavy extraction, up to 50% for total economic control.",
  capitalization_multiple: "The multiple applied to annual recurring income to determine total value (like a P/E ratio). Default is 20x, meaning 20 years of income equals the capitalized value. Higher multiples indicate more stable, long-lasting empires.",
  liquid_treasury: "Physical gold and silver reserves held in the royal treasury or vault (in oz). This is immediately accessible wealth.",
  imperial_real_estate: "Value of directly owned royal assets: mines, palaces, crown lands, and estates (in gold oz equivalent). Set to 0 if already captured in the extraction margin.",
  extraordinary_gains: "One-time, non-recurring wealth such as war ransoms, pillaged treasures, conquered hoards, or seized assets (in oz).",
  gold_price: "Current price of gold per troy ounce in USD. Used to convert Real Wealth (in oz) to Nominal Dollar Value.",
};

// Tooltip component
function Tooltip({ text }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        className="w-4 h-4 rounded-full bg-gray-600 hover:bg-gray-500 text-gray-300 text-xs font-bold inline-flex items-center justify-center cursor-help"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 w-64 p-3 bg-gray-900 border border-gray-600 rounded-lg shadow-xl text-sm text-gray-300 -left-28 bottom-6">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-600"></div>
          {text}
        </div>
      )}
    </span>
  );
}

export default function InputForm({ onCalculate, onAddToComparison, isLoading }) {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState(null);

  // Format number with commas
  const formatWithCommas = (value) => {
    if (!value) return '';
    const num = value.toString().replace(/,/g, '');
    if (isNaN(num)) return value;
    return Number(num).toLocaleString('en-US');
  };

  // Parse number removing commas
  const parseNumber = (value) => {
    if (!value) return '';
    return value.toString().replace(/,/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle numeric fields that need comma formatting
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    // Remove non-numeric except decimal and minus
    const cleaned = value.replace(/[^0-9.,\-]/g, '');
    setFormData((prev) => ({ ...prev, [name]: cleaned }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Format on blur for comma-formatted fields
  const handleNumericBlur = (e) => {
    const { name, value } = e.target;
    const num = parseNumber(value);
    if (num && !isNaN(num)) {
      setFormData((prev) => ({ ...prev, [name]: formatWithCommas(num) }));
    }
  };

  const loadPreset = (presetKey) => {
    setFormData(presets[presetKey]);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    const pop = parseNumber(formData.population);

    if (!pop || parseFloat(pop) <= 0) {
      newErrors.population = 'Population must be greater than 0';
    }

    if (!formData.base_output || parseFloat(formData.base_output) <= 0) {
      newErrors.base_output = 'Base output must be greater than 0';
    }

    const velocity = parseFloat(formData.velocity);
    if (!formData.velocity || velocity < 2.0 || velocity > 8.0) {
      newErrors.velocity = 'Velocity must be between 2.0 and 8.0';
    }

    const margin = parseFloat(formData.extraction_margin);
    if (!formData.extraction_margin || margin < 0.01 || margin > 0.50) {
      newErrors.extraction_margin = 'Extraction margin must be between 0.01 and 0.50';
    }

    const multiple = parseFloat(formData.capitalization_multiple);
    if (!formData.capitalization_multiple || multiple < 1 || multiple > 100) {
      newErrors.capitalization_multiple = 'Multiple must be between 1 and 100';
    }

    const goldPrice = parseFloat(parseNumber(formData.gold_price));
    if (!formData.gold_price || goldPrice <= 0) {
      newErrors.gold_price = 'Gold price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ruler_name: formData.ruler_name || 'Unknown Ruler',
      year: formData.year ? parseInt(formData.year) : null,
      population: parseInt(parseNumber(formData.population)),
      base_output: parseFloat(formData.base_output),
      velocity: parseFloat(formData.velocity),
      extraction_margin: parseFloat(formData.extraction_margin),
      capitalization_multiple: parseFloat(formData.capitalization_multiple),
      liquid_treasury: parseFloat(parseNumber(formData.liquid_treasury)) || 0,
      imperial_real_estate: parseFloat(parseNumber(formData.imperial_real_estate)) || 0,
      extraordinary_gains: parseFloat(parseNumber(formData.extraordinary_gains)) || 0,
      gold_price: parseFloat(parseNumber(formData.gold_price)) || 2900,
    };

    onCalculate(payload);
  };

  const handleAddToComparison = () => {
    if (!validate()) return;

    const payload = {
      ruler_name: formData.ruler_name || 'Unknown Ruler',
      year: formData.year ? parseInt(formData.year) : null,
      population: parseInt(parseNumber(formData.population)),
      base_output: parseFloat(formData.base_output),
      velocity: parseFloat(formData.velocity),
      extraction_margin: parseFloat(formData.extraction_margin),
      capitalization_multiple: parseFloat(formData.capitalization_multiple),
      liquid_treasury: parseFloat(parseNumber(formData.liquid_treasury)) || 0,
      imperial_real_estate: parseFloat(parseNumber(formData.imperial_real_estate)) || 0,
      extraordinary_gains: parseFloat(parseNumber(formData.extraordinary_gains)) || 0,
      gold_price: parseFloat(parseNumber(formData.gold_price)) || 2900,
    };

    onAddToComparison(payload);
  };

  const resetForm = () => {
    setFormData(defaultValues);
    setErrors({});
  };

  // Import from JSON
  const handleJsonImport = () => {
    setJsonError(null);
    try {
      const data = JSON.parse(jsonInput);

      // Validate required fields
      if (typeof data.population === 'undefined') {
        throw new Error('Missing required field: population');
      }

      // Map JSON fields to form fields with comma formatting for large numbers
      const newFormData = {
        ruler_name: data.ruler_name || '',
        year: data.year?.toString() || '',
        population: formatWithCommas(data.population),
        base_output: data.base_output?.toString() || '1.0',
        velocity: data.velocity?.toString() || '4.0',
        extraction_margin: data.extraction_margin?.toString() || '0.10',
        capitalization_multiple: data.capitalization_multiple?.toString() || '20',
        liquid_treasury: formatWithCommas(data.liquid_treasury || 0),
        imperial_real_estate: formatWithCommas(data.imperial_real_estate || 0),
        extraordinary_gains: formatWithCommas(data.extraordinary_gains || 0),
        gold_price: formData.gold_price, // Keep existing gold price
      };

      setFormData(newFormData);
      setErrors({});
      setJsonInput('');
      setShowJsonImport(false);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const inputClass = (name) =>
    `w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white ${
      errors[name] ? 'border-red-500' : 'border-gray-600'
    }`;

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-amber-400 mb-4">Input Parameters</h2>

      {/* Presets */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Load Preset</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => loadPreset('british_empire')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-amber-400 rounded text-sm"
          >
            British Empire (1913)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('roman_empire')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-amber-400 rounded text-sm"
          >
            Roman Empire (14 AD)
          </button>
        </div>
      </div>

      {/* JSON Import */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowJsonImport(!showJsonImport)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${showJsonImport ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Import from JSON (Research Output)
        </button>

        {showJsonImport && (
          <div className="mt-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-400 mb-2">
              Paste the JSON output from the SAVE Research Prompt to auto-populate the form fields.
            </p>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError(null);
              }}
              placeholder={`{
  "ruler_name": "Mansa Musa I (Mali Empire)",
  "year": 1324,
  "population": 20000000,
  "base_output": 0.8,
  "velocity": 4.0,
  "extraction_margin": 0.15,
  "capitalization_multiple": 20,
  "liquid_treasury": 16000000,
  "imperial_real_estate": 0,
  "extraordinary_gains": 0
}`}
              className="w-full h-40 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
            />
            {jsonError && (
              <p className="text-red-400 text-xs mt-2">Error: {jsonError}</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleJsonImport}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition"
              >
                Import & Populate Form
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowJsonImport(false);
                  setJsonInput('');
                  setJsonError(null);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 text-sm rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ruler Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Ruler/Empire Name
            <Tooltip text={definitions.ruler_name} />
          </label>
          <input
            type="text"
            name="ruler_name"
            value={formData.ruler_name}
            onChange={handleChange}
            placeholder="e.g., British Empire"
            className={inputClass('ruler_name')}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Year
            <Tooltip text={definitions.year} />
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g., 1913"
            className={inputClass('year')}
          />
        </div>
      </div>

      {/* Income Parameters */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">
          Income Parameters
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Population (N)
              <span className="text-red-400 ml-1">*</span>
              <Tooltip text={definitions.population} />
            </label>
            <input
              type="text"
              name="population"
              value={formData.population}
              onChange={handleNumericChange}
              onBlur={handleNumericBlur}
              placeholder="e.g., 412,000,000"
              className={inputClass('population')}
            />
            {errors.population && (
              <p className="text-red-400 text-xs mt-1">{errors.population}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Base Output (B) oz/person/year
              <Tooltip text={definitions.base_output} />
            </label>
            <input
              type="number"
              step="0.1"
              name="base_output"
              value={formData.base_output}
              onChange={handleChange}
              className={inputClass('base_output')}
            />
            {errors.base_output && (
              <p className="text-red-400 text-xs mt-1">{errors.base_output}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Velocity (V) [2.0-8.0]
              <Tooltip text={definitions.velocity} />
            </label>
            <input
              type="number"
              step="0.1"
              min="2.0"
              max="8.0"
              name="velocity"
              value={formData.velocity}
              onChange={handleChange}
              className={inputClass('velocity')}
            />
            {errors.velocity && (
              <p className="text-red-400 text-xs mt-1">{errors.velocity}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Extraction Margin (M) [0.01-0.50]
              <Tooltip text={definitions.extraction_margin} />
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="0.50"
              name="extraction_margin"
              value={formData.extraction_margin}
              onChange={handleChange}
              className={inputClass('extraction_margin')}
            />
            {errors.extraction_margin && (
              <p className="text-red-400 text-xs mt-1">{errors.extraction_margin}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">
              Capitalization Multiple (K) [1-100]
              <Tooltip text={definitions.capitalization_multiple} />
            </label>
            <input
              type="number"
              min="1"
              max="100"
              name="capitalization_multiple"
              value={formData.capitalization_multiple}
              onChange={handleChange}
              className={inputClass('capitalization_multiple')}
            />
            {errors.capitalization_multiple && (
              <p className="text-red-400 text-xs mt-1">{errors.capitalization_multiple}</p>
            )}
          </div>
        </div>
      </div>

      {/* Asset Parameters */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">
          Asset Parameters (Balance Sheet)
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Liquid Treasury (L) oz
              <Tooltip text={definitions.liquid_treasury} />
            </label>
            <input
              type="text"
              name="liquid_treasury"
              value={formData.liquid_treasury}
              onChange={handleNumericChange}
              onBlur={handleNumericBlur}
              placeholder="Gold/silver in vault"
              className={inputClass('liquid_treasury')}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Imperial Real Estate (R) oz
              <Tooltip text={definitions.imperial_real_estate} />
            </label>
            <input
              type="text"
              name="imperial_real_estate"
              value={formData.imperial_real_estate}
              onChange={handleNumericChange}
              onBlur={handleNumericBlur}
              placeholder="Mines, palaces, estates"
              className={inputClass('imperial_real_estate')}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Extraordinary Gains (E) oz
              <Tooltip text={definitions.extraordinary_gains} />
            </label>
            <input
              type="text"
              name="extraordinary_gains"
              value={formData.extraordinary_gains}
              onChange={handleNumericChange}
              onBlur={handleNumericBlur}
              placeholder="Ransoms, pillage, seized treasures"
              className={inputClass('extraordinary_gains')}
            />
          </div>
        </div>
      </div>

      {/* Gold Price */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-1">
          Valuation Settings
        </h3>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Gold Price ($/oz)
            <Tooltip text={definitions.gold_price} />
          </label>
          <input
            type="text"
            name="gold_price"
            value={formData.gold_price}
            onChange={handleNumericChange}
            onBlur={handleNumericBlur}
            placeholder="e.g., 2,900"
            className={inputClass('gold_price')}
          />
          {errors.gold_price && (
            <p className="text-red-400 text-xs mt-1">{errors.gold_price}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          {isLoading ? 'Calculating...' : 'Calculate Wealth'}
        </button>
        <button
          type="button"
          onClick={handleAddToComparison}
          disabled={isLoading}
          className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-amber-400 font-semibold rounded-lg transition"
        >
          + Compare
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

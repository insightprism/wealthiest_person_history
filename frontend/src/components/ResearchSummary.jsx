import { useState, useCallback } from 'react';

// Helper function to format numbers with commas
const formatNumber = (num) => {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString();
};

// Helper function to format large numbers with suffix (M/B/T)
const formatLargeNumber = (num, suffix = '') => {
  if (num === null || num === undefined) return '-';
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T${suffix}`;
  } else if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B${suffix}`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M${suffix}`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K${suffix}`;
  }
  return `${num.toFixed(2)}${suffix}`;
};

// Helper function to format population in millions
const formatPopulation = (num) => {
  if (num === null || num === undefined) return '-';
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  }
  return formatNumber(num);
};

// Helper function to format oz values in billions/millions
const formatOz = (num) => {
  if (num === null || num === undefined) return '-';
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B oz`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M oz`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K oz`;
  }
  return `${formatNumber(Math.round(num))} oz`;
};

// Helper function to format currency
const formatCurrency = (num, goldPrice = 2900) => {
  if (num === null || num === undefined) return '-';
  const value = num * goldPrice;
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${formatNumber(Math.round(value))}`;
};

// Parse JSON from markdown content
const extractJsonFromMarkdown = (markdown) => {
  // Look for JSON block in the markdown
  const jsonMatch = markdown.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return null;
    }
  }
  return null;
};

// Extract executive summary from markdown
const extractSummary = (markdown) => {
  const summaryMatch = markdown.match(/## I\. Executive Summary\s*([\s\S]*?)(?=\n---|\n## II)/);
  if (summaryMatch) {
    return summaryMatch[1].trim();
  }
  return null;
};

// Extract target info from markdown header
const extractTargetInfo = (markdown) => {
  const info = {};

  const subjectMatch = markdown.match(/\*\*Target Subject:\*\*\s*(.+)/);
  if (subjectMatch) info.subject = subjectMatch[1].trim();

  const empireMatch = markdown.match(/\*\*Empire:\*\*\s*(.+)/);
  if (empireMatch) info.empire = empireMatch[1].trim();

  const entityMatch = markdown.match(/\*\*Entity:\*\*\s*(.+)/);
  if (entityMatch) info.entity = entityMatch[1].trim();

  const peakYearMatch = markdown.match(/\*\*Peak Year:\*\*\s*(.+)/);
  if (peakYearMatch) info.peakYear = peakYearMatch[1].trim();

  const reignMatch = markdown.match(/\*\*Reign:\*\*\s*(.+)/);
  if (reignMatch) info.reign = reignMatch[1].trim();

  const lifeMatch = markdown.match(/\*\*Life:\*\*\s*(.+)/);
  if (lifeMatch) info.life = lifeMatch[1].trim();

  const dynastyMatch = markdown.match(/\*\*Dynasty:\*\*\s*(.+)/);
  if (dynastyMatch) info.dynasty = dynastyMatch[1].trim();

  return info;
};

// Calculate total wealth from JSON data
const calculateTotalWealth = (data) => {
  if (!data) return null;

  // Income Valuation
  const agr = data.population * data.base_output * data.velocity;
  const aii = agr * data.extraction_margin;
  const incomeWealth = aii * data.capitalization_multiple;

  // Asset Valuation
  const infrastructure = (data.population * data.base_output) * 0.05;
  const assetWealth = infrastructure +
    (data.liquid_treasury || 0) +
    (data.imperial_real_estate || 0) +
    (data.extraordinary_gains || 0);

  return {
    agr,
    aii,
    incomeWealth,
    infrastructure,
    assetWealth,
    totalWealth: incomeWealth + assetWealth
  };
};

function ResearchSummary() {
  const [markdownFiles, setMarkdownFiles] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [selectedRuler, setSelectedRuler] = useState(null);
  const [goldPrice, setGoldPrice] = useState(2900);
  const [isDragging, setIsDragging] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'totalWealth', direction: 'desc' });

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.md'));
    processFiles(files);
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.name.endsWith('.md'));
    processFiles(files);
  };

  // Process uploaded files
  const processFiles = async (files) => {
    const newData = [];

    for (const file of files) {
      const content = await file.text();
      const json = extractJsonFromMarkdown(content);
      const summary = extractSummary(content);
      const targetInfo = extractTargetInfo(content);
      const calculations = calculateTotalWealth(json);

      if (json) {
        newData.push({
          filename: file.name,
          content,
          json,
          summary,
          targetInfo,
          calculations
        });
      }
    }

    // Merge with existing data, avoiding duplicates by ruler_name
    setParsedData(prev => {
      const existingNames = new Set(prev.map(d => d.json.ruler_name));
      const uniqueNew = newData.filter(d => !existingNames.has(d.json.ruler_name));
      return [...prev, ...uniqueNew];
    });
    setMarkdownFiles(prev => [...prev, ...files]);
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Clear all data
  const clearData = () => {
    setParsedData([]);
    setMarkdownFiles([]);
    setSelectedRuler(null);
  };

  // Sort data
  const sortedData = [...parsedData].sort((a, b) => {
    let aVal, bVal;

    switch (sortConfig.key) {
      case 'ruler_name':
        aVal = a.json.ruler_name || '';
        bVal = b.json.ruler_name || '';
        break;
      case 'year':
        aVal = a.json.year || 0;
        bVal = b.json.year || 0;
        break;
      case 'population':
        aVal = a.json.population || 0;
        bVal = b.json.population || 0;
        break;
      case 'totalWealth':
        aVal = a.calculations?.totalWealth || 0;
        bVal = b.calculations?.totalWealth || 0;
        break;
      default:
        return 0;
    }

    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'desc' ? '↓' : '↑';
  };

  // Copy JSON to clipboard
  const copyJson = (json) => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
  };

  // Copy all JSON as array
  const copyAllJson = () => {
    const allJson = parsedData.map(d => d.json);
    navigator.clipboard.writeText(JSON.stringify(allJson, null, 2));
  };

  // Generate and download markdown report
  const downloadReport = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');

    // Helper for percentage
    const pct = (num, total) => total > 0 ? ((num / total) * 100).toFixed(1) : '0.0';

    // Generate markdown content
    let markdown = `# SAVE Research Summary Report\n\n`;
    markdown += `**Generated:** ${now.toLocaleString()}\n`;
    markdown += `**Gold Price:** $${formatNumber(goldPrice)}/oz\n`;
    markdown += `**Total Rulers:** ${sortedData.length}\n\n`;
    markdown += `---\n\n`;

    // Summary Table with formatted values
    markdown += `## Summary Table\n\n`;
    markdown += `| Rank | Ruler | Year | Population | Total Wealth | Nominal Value |\n`;
    markdown += `|------|-------|------|------------|--------------|---------------|\n`;

    sortedData.forEach((item, index) => {
      const pop = formatPopulation(item.json.population);
      const wealth = formatLargeNumber(item.calculations?.totalWealth || 0, ' oz');
      const nominal = formatCurrency(item.calculations?.totalWealth, goldPrice);
      markdown += `| ${index + 1} | ${item.json.ruler_name} | ${item.json.year} | ${pop} | ${wealth} | ${nominal} |\n`;
    });

    markdown += `\n---\n\n`;

    // Individual Ruler Details
    markdown += `## Individual Ruler Details\n\n`;

    sortedData.forEach((item, index) => {
      const calc = item.calculations;
      const json = item.json;

      markdown += `### ${index + 1}. ${json.ruler_name}\n\n`;

      if (item.targetInfo.empire) {
        markdown += `**Empire:** ${item.targetInfo.empire}\n`;
      }
      if (item.targetInfo.reign) {
        markdown += `**Reign:** ${item.targetInfo.reign}\n`;
      }
      if (item.targetInfo.life) {
        markdown += `**Life:** ${item.targetInfo.life}\n`;
      }
      markdown += `\n`;

      // Summary if available
      if (item.summary) {
        markdown += `**Executive Summary:**\n${item.summary}\n\n`;
      }

      // Input Parameters Table
      markdown += `#### Input Parameters\n\n`;
      markdown += `| Parameter | Value |\n`;
      markdown += `|-----------|-------|\n`;
      markdown += `| Population (N) | ${formatPopulation(json.population)} (${formatNumber(json.population)}) |\n`;
      markdown += `| Base Output (B) | ${json.base_output} oz/person/year |\n`;
      markdown += `| Velocity (V) | ${json.velocity} |\n`;
      markdown += `| Extraction Margin (M) | ${(json.extraction_margin * 100).toFixed(0)}% |\n`;
      markdown += `| Capitalization Multiple (K) | ${json.capitalization_multiple}x |\n`;
      markdown += `| Liquid Treasury (L) | ${formatOz(json.liquid_treasury)} |\n`;
      markdown += `| Imperial Real Estate (R) | ${formatOz(json.imperial_real_estate)} |\n`;
      markdown += `| Extraordinary Gains (E) | ${formatOz(json.extraordinary_gains)} |\n`;
      markdown += `\n`;

      // Income Wealth Section
      if (calc) {
        markdown += `#### Income Wealth\n\n`;
        markdown += `| Metric | Value |\n`;
        markdown += `|--------|-------|\n`;
        markdown += `| Adjusted Gross Revenue (AGR) | ${formatOz(calc.agr)} |\n`;
        markdown += `| Annual Imperial Income (AII) | ${formatOz(calc.aii)} |\n`;
        markdown += `| **Income Wealth (AII × K)** | **${formatOz(calc.incomeWealth)}** |\n`;
        markdown += `\n`;

        // Asset Wealth Section
        markdown += `#### Asset Wealth\n\n`;
        markdown += `| Component | Value |\n`;
        markdown += `|-----------|-------|\n`;
        markdown += `| Infrastructure Floor (I) | ${formatOz(calc.infrastructure)} |\n`;
        markdown += `| Liquid Treasury (L) | ${formatOz(json.liquid_treasury)} |\n`;
        markdown += `| Imperial Real Estate (R) | ${formatOz(json.imperial_real_estate)} |\n`;
        markdown += `| Extraordinary Gains (E) | ${formatOz(json.extraordinary_gains)} |\n`;
        markdown += `| **Asset Wealth (I+L+R+E)** | **${formatOz(calc.assetWealth)}** |\n`;
        markdown += `\n`;

        // Wealth Composition
        markdown += `#### Wealth Composition\n\n`;
        const totalWealth = calc.totalWealth;
        markdown += `| Component | Value | % of Total |\n`;
        markdown += `|-----------|-------|------------|\n`;
        markdown += `| Income Wealth | ${formatOz(calc.incomeWealth)} | ${pct(calc.incomeWealth, totalWealth)}% |\n`;
        markdown += `| Asset Wealth | ${formatOz(calc.assetWealth)} | ${pct(calc.assetWealth, totalWealth)}% |\n`;
        markdown += `| └─ Infrastructure | ${formatOz(calc.infrastructure)} | ${pct(calc.infrastructure, totalWealth)}% |\n`;
        markdown += `| └─ Liquid Treasury | ${formatOz(json.liquid_treasury)} | ${pct(json.liquid_treasury, totalWealth)}% |\n`;
        markdown += `| └─ Real Estate | ${formatOz(json.imperial_real_estate)} | ${pct(json.imperial_real_estate, totalWealth)}% |\n`;
        markdown += `| └─ Extraordinary Gains | ${formatOz(json.extraordinary_gains)} | ${pct(json.extraordinary_gains, totalWealth)}% |\n`;
        markdown += `| **TOTAL** | **${formatOz(totalWealth)}** | **100%** |\n`;
        markdown += `\n`;

        // CFO Metrics
        markdown += `#### CFO Metrics\n\n`;
        const wealthPerCapita = totalWealth / json.population;
        const incomePerCapita = calc.aii / json.population;
        const assetToIncome = calc.assetWealth / calc.incomeWealth;
        const liquidityRatio = json.liquid_treasury / totalWealth;
        const agrPerCapita = calc.agr / json.population;

        markdown += `| Metric | Value |\n`;
        markdown += `|--------|-------|\n`;
        markdown += `| Total Wealth per Capita | ${wealthPerCapita.toFixed(2)} oz/person |\n`;
        markdown += `| Annual Income per Capita | ${incomePerCapita.toFixed(4)} oz/person |\n`;
        markdown += `| AGR per Capita | ${agrPerCapita.toFixed(2)} oz/person |\n`;
        markdown += `| Asset-to-Income Ratio | ${assetToIncome.toFixed(2)}x |\n`;
        markdown += `| Liquidity Ratio | ${(liquidityRatio * 100).toFixed(1)}% |\n`;
        markdown += `| Extraction Efficiency | ${(json.extraction_margin * 100).toFixed(0)}% |\n`;
        markdown += `| Economic Velocity | ${json.velocity}x |\n`;
        markdown += `\n`;

        // Total Summary
        markdown += `#### Total Real Wealth\n\n`;
        markdown += `| | Gold Ounces | Nominal USD |\n`;
        markdown += `|---|-------------|-------------|\n`;
        markdown += `| **TOTAL** | **${formatOz(totalWealth)}** | **${formatCurrency(totalWealth, goldPrice)}** |\n`;
        markdown += `\n`;
      }

      // JSON Output
      markdown += `#### Machine-Readable JSON\n\n`;
      markdown += `\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\`\n\n`;
      markdown += `---\n\n`;
    });

    // All JSON Array at the end
    markdown += `## All Rulers JSON Array\n\n`;
    markdown += `\`\`\`json\n${JSON.stringify(sortedData.map(d => d.json), null, 2)}\n\`\`\`\n`;

    // Create and download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `save_research_summary_${dateStr}_${timeStr}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Gold Price Input */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <label className="text-gray-300">Gold Price ($/oz):</label>
          <input
            type="number"
            value={goldPrice}
            onChange={(e) => setGoldPrice(Number(e.target.value) || 2900)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 w-32 text-white"
          />
          <span className="text-gray-500 text-sm">Used for nominal USD calculations</span>
        </div>
      </div>

      {/* File Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-amber-400 bg-amber-900/20'
            : 'border-gray-600 bg-gray-800 hover:border-gray-500'
        }`}
      >
        <div className="text-4xl mb-4">📄</div>
        <p className="text-gray-300 mb-2">
          Drag and drop research output .md files here
        </p>
        <p className="text-gray-500 text-sm mb-4">
          or click to select files
        </p>
        <input
          type="file"
          multiple
          accept=".md"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
        >
          Select Files
        </label>
      </div>

      {/* Summary Table */}
      {parsedData.length > 0 && (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-amber-400">
              Research Summary ({parsedData.length} rulers)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={downloadReport}
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
              >
                📥 Save Report (.md)
              </button>
              <button
                onClick={copyAllJson}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Copy All JSON
              </button>
              <button
                onClick={clearData}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-gray-300 cursor-pointer hover:bg-gray-600"
                    onClick={() => handleSort('ruler_name')}
                  >
                    Ruler {getSortIndicator('ruler_name')}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-gray-300 cursor-pointer hover:bg-gray-600"
                    onClick={() => handleSort('year')}
                  >
                    Year {getSortIndicator('year')}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-gray-300 cursor-pointer hover:bg-gray-600"
                    onClick={() => handleSort('population')}
                  >
                    Population {getSortIndicator('population')}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-gray-300 cursor-pointer hover:bg-gray-600"
                    onClick={() => handleSort('totalWealth')}
                  >
                    Total Wealth (oz) {getSortIndicator('totalWealth')}
                  </th>
                  <th className="px-4 py-3 text-right text-gray-300">
                    Nominal Value
                  </th>
                  <th className="px-4 py-3 text-center text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr
                    key={item.json.ruler_name}
                    className={`border-t border-gray-700 hover:bg-gray-700/50 cursor-pointer ${
                      selectedRuler === item.json.ruler_name ? 'bg-amber-900/30' : ''
                    }`}
                    onClick={() => setSelectedRuler(
                      selectedRuler === item.json.ruler_name ? null : item.json.ruler_name
                    )}
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {item.json.ruler_name}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {item.json.year}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      {formatPopulation(item.json.population)}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-400 font-semibold">
                      {formatLargeNumber(item.calculations?.totalWealth || 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-green-400">
                      {formatCurrency(item.calculations?.totalWealth, goldPrice)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyJson(item.json);
                        }}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Copy JSON"
                      >
                        📋 JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Ruler Details */}
      {selectedRuler && (
        <div className="bg-gray-800 rounded-xl p-6">
          {(() => {
            const item = parsedData.find(d => d.json.ruler_name === selectedRuler);
            if (!item) return null;

            return (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-400">
                      {item.json.ruler_name}
                    </h3>
                    {item.targetInfo.empire && (
                      <p className="text-gray-400">{item.targetInfo.empire}</p>
                    )}
                    {item.targetInfo.reign && (
                      <p className="text-gray-500 text-sm">Reign: {item.targetInfo.reign}</p>
                    )}
                    {item.targetInfo.life && (
                      <p className="text-gray-500 text-sm">Life: {item.targetInfo.life}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedRuler(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Executive Summary */}
                {item.summary && (
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Executive Summary</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.summary}</p>
                  </div>
                )}

                {/* Input Parameters */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-300 mb-3">Input Parameters</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Population (N)</div>
                      <div className="text-lg text-white font-semibold">
                        {formatNumber(item.json.population)}
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Base Output (B)</div>
                      <div className="text-lg text-white font-semibold">
                        {item.json.base_output} oz
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Velocity (V)</div>
                      <div className="text-lg text-white font-semibold">
                        {item.json.velocity}
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Extraction Margin (M)</div>
                      <div className="text-lg text-white font-semibold">
                        {(item.json.extraction_margin * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Cap Multiple (K)</div>
                      <div className="text-lg text-white font-semibold">
                        {item.json.capitalization_multiple}x
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Liquid Treasury (L)</div>
                      <div className="text-lg text-white font-semibold">
                        {formatNumber(item.json.liquid_treasury)} oz
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Real Estate (R)</div>
                      <div className="text-lg text-white font-semibold">
                        {formatNumber(item.json.imperial_real_estate)} oz
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Extraordinary Gains (E)</div>
                      <div className="text-lg text-white font-semibold">
                        {formatNumber(item.json.extraordinary_gains)} oz
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculated Results */}
                {item.calculations && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-3">Calculated Results</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-blue-900/30 rounded-lg p-3">
                        <div className="text-xs text-blue-400">Adjusted Gross Revenue (AGR)</div>
                        <div className="text-lg text-white font-semibold">
                          {formatNumber(Math.round(item.calculations.agr))} oz
                        </div>
                      </div>
                      <div className="bg-blue-900/30 rounded-lg p-3">
                        <div className="text-xs text-blue-400">Annual Imperial Income (AII)</div>
                        <div className="text-lg text-white font-semibold">
                          {formatNumber(Math.round(item.calculations.aii))} oz
                        </div>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-3">
                        <div className="text-xs text-purple-400">Income Wealth</div>
                        <div className="text-lg text-white font-semibold">
                          {formatNumber(Math.round(item.calculations.incomeWealth))} oz
                        </div>
                      </div>
                      <div className="bg-green-900/30 rounded-lg p-3">
                        <div className="text-xs text-green-400">Infrastructure Floor</div>
                        <div className="text-lg text-white font-semibold">
                          {formatNumber(Math.round(item.calculations.infrastructure))} oz
                        </div>
                      </div>
                      <div className="bg-green-900/30 rounded-lg p-3">
                        <div className="text-xs text-green-400">Asset Wealth</div>
                        <div className="text-lg text-white font-semibold">
                          {formatNumber(Math.round(item.calculations.assetWealth))} oz
                        </div>
                      </div>
                      <div className="bg-amber-900/50 rounded-lg p-3 border border-amber-600">
                        <div className="text-xs text-amber-400">Total Real Wealth</div>
                        <div className="text-xl text-amber-400 font-bold">
                          {formatNumber(Math.round(item.calculations.totalWealth))} oz
                        </div>
                        <div className="text-sm text-green-400">
                          {formatCurrency(item.calculations.totalWealth, goldPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* JSON Output */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-semibold text-gray-300">Machine-Readable JSON</h4>
                    <button
                      onClick={() => copyJson(item.json)}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300">
                    {JSON.stringify(item.json, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Empty State */}
      {parsedData.length === 0 && (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Research Files Loaded
          </h3>
          <p className="text-gray-500">
            Drag and drop .md research output files to see a summary table and extract JSON data.
          </p>
        </div>
      )}
    </div>
  );
}

export default ResearchSummary;

'use client'
import { useState, useRef } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Copy, 
  Download, 
  Image as ImageIcon, 
  ExternalLink,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  BarChart3
} from 'lucide-react';
import { 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';


// Competition level badge component
const CompetitionBadge = ({ level }) => {
  const getStyles = () => {
    switch (level.toLowerCase()) {
      case 'high': 
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': 
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': 
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: 
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs border ${getStyles()}`}>
      {level}
    </span>
  );
};

const KeywordVariations = ({ keywords = sampleKeywords }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const toggleKeywordSelection = (keyword) => {
    if (selectedKeywords.includes(keyword.keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword.keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword.keyword]);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = selectedKeywords.length > 0 
      ? selectedKeywords.join('\n') 
      : keywords.map(k => k.keyword).join('\n');
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('Keywords copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  // Sort keywords by search volume (highest first)
  const sortedKeywords = [...keywords].sort((a, b) => {
    const getNumericVolume = (volStr) => {
      const num = parseFloat(volStr.replace(/[^0-9.]/g, ''));
      if (volStr.includes('K')) return num * 1000;
      if (volStr.includes('M')) return num * 1000000;
      return num;
    };
    
    return getNumericVolume(b.volume) - getNumericVolume(a.volume);
  });

  // Calculate total monthly volume
  const totalMonthlyVolume = keywords.reduce((sum, keyword) => {
    const num = parseFloat(keyword.volume.replace(/[^0-9.]/g, ''));
    let multiplier = 1;
    if (keyword.volume.includes('K')) multiplier = 1000;
    if (keyword.volume.includes('M')) multiplier = 1000000;
    return sum + (num * multiplier);
  }, 0).toLocaleString();

  return (
    <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl mb-6 overflow-hidden">
      <button 
        onClick={toggleDropdown}
        className="w-full flex items-center justify-end p-6 hover:bg-gray-700/30 transition-all duration-300 group"
      >
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{keywords.length} keywords</span>
          {isOpen ? 
            <ArrowUp className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" /> : 
            <ArrowDown className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          }
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6">
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
            {/* Stats Header */}
            <div className="bg-gray-800/50 border-b border-gray-700 p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{keywords.length}</div>
                  <div className="text-sm text-gray-400">Total Keywords</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalMonthlyVolume}</div>
                  <div className="text-sm text-gray-400">Monthly Volume</div>
                </div>
              </div>
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-12 text-sm font-medium text-gray-300 border-b border-gray-700 bg-gray-800/30">
              <div className="col-span-6 p-4">Keyword</div>
              <div className="col-span-3 p-4">Volume</div>
              <div className="col-span-3 p-4">Competition</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-700">
              {sortedKeywords.map((keyword, index) => (
                <div key={index} className="grid grid-cols-12 text-sm hover:bg-gray-700/30 transition-all duration-200">
                  <div className="col-span-6 p-4 flex items-center">
                    <input
                      type="checkbox"
                      id={`keyword-${index}`}
                      checked={selectedKeywords.includes(keyword.keyword)}
                      onChange={() => toggleKeywordSelection(keyword)}
                      className="mr-3 w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <label htmlFor={`keyword-${index}`} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                      {keyword.keyword}
                    </label>
                  </div>
                  <div className="col-span-3 p-4 text-gray-300 font-medium">{keyword.volume}</div>
                  <div className="col-span-3 p-4">
                    <CompetitionBadge level={keyword.competition} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={copyToClipboard} 
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-200"
            >
              <Copy className="h-4 w-4" /> 
              Copy {selectedKeywords.length > 0 ? 'Selected' : 'All'} Keywords
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// IdeaNotes Component
const IdeaNotes = ({ notes = sampleNotes }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  return (
    <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl mb-6 overflow-hidden">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-end p-6 hover:bg-gray-700/30 transition-all duration-300 group"
      >
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{notes.length} notes</span>
          {isOpen ? 
            <ArrowUp className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" /> : 
            <ArrowDown className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          }
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 space-y-4">
          {notes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No notes available</div>
          ) : (
            notes.map((note, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
                <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-3">
                  <h4 className="font-semibold text-white">{note.title}</h4>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 leading-relaxed">{note.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Market Analysis Component
const MarketAnalysis = ({ data = sampleMarketAnalysis }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleDropdown = () => setIsOpen(!isOpen);

  const getCurrentMonthIndex = () => {
    const now = new Date();
    return now.getMonth(); 
  };
  
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const getTrendData = (trend) => {
    const currentMonthIndex = getCurrentMonthIndex();
    const availableMonths = allMonths.slice(0, currentMonthIndex + 1);
    
    switch (trend?.toLowerCase()) {
      case "upward":
        return availableMonths.map((month, index) => ({
          month,
          value: 30 + (index * 10)
        }));
      case "downward":
        return availableMonths.map((month, index) => ({
          month,
          value: 90 - (index * 8)
        }));
      case "rapid growth":
        return availableMonths.map((month, index) => ({
          month,
          value: 50 + Math.sin(index * 1.5) * 25
        }));
      case "steady":
        return availableMonths.map((month, index) => ({
          month,
          value: 50 + (Math.random() * 6 - 3)
        }));
      default:
        return availableMonths.map((month) => ({
          month,
          value: 50
        }));
    }
  };
  
  const getChartColor = (trend) => {
    switch (trend?.toLowerCase()) {
      case "upward":
        return "#10b981"; // emerald/green
      case "downward":
        return "#ef4444"; // red
      case "rapid growth":
        return "#f59e0b"; // amber
      case "steady":
        return "#6366f1"; // indigo
      default:
        return "#8b5cf6"; // purple
    }
  };
  
  const getTrendDescription = (trend) => {
    switch (trend?.toLowerCase()) {
      case "upward":
        return "Steadily growing market interest";
      case "downward":
        return "Declining market interest over time";
      case "rapid growth":
        return "Fluctuating market interest with peaks and valleys";
      case "steady":
        return "Stable market interest with minimal variation";
      default:
        return "No clear trend available";
    }
  };
  
  const trendData = getTrendData(data.trend);
  const chartColor = getChartColor(data.trend);
  const trendDescription = getTrendDescription(data.trend);
  
  return (
    <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl mb-6 overflow-hidden">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-end p-6 hover:bg-gray-700/30 transition-all duration-300 group"
      >
        
        {isOpen ? 
          <ArrowUp className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" /> : 
          <ArrowDown className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
        }
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{data.search_volume ?? 'N/A'}</div>
                <div className="text-sm text-gray-400">Monthly Search Volume</div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{data.competition_level ?? 'N/A'}</div>
                <div className="text-sm text-gray-400">Competition Level</div>
              </div>
            </div>
          </div>
          
          {/* Market trend visualization */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-3">
              <h4 className="font-semibold text-white">Market Trend: {data.trend ?? 'Unknown'}</h4>
            </div>
            <div className="p-4">
              <div className="h-64 mb-4">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={chartColor} 
                        strokeWidth={3} 
                        dot={{ strokeWidth: 2, r: 5, fill: chartColor }}
                        activeDot={{ r: 7, fill: chartColor }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available for current period
                  </div>
                )}
              </div>
              <div className="text-center text-gray-300">
                {trendDescription}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MonetizationPotential = ({ data = sampleMonetization }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  return (
    <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl mb-6 overflow-hidden">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-end p-6 hover:bg-gray-700/30 transition-all duration-300 group"
      >
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{data.length} strategies</span>
          {isOpen ? 
            <ArrowUp className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" /> : 
            <ArrowDown className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          }
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 space-y-4">
          {data && data.map((item, index) => (
            <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-3">
                <h4 className="font-semibold text-white">{item.title}</h4>
              </div>
              <div className="p-4">
                <p className="text-gray-300 leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CompetitorAnalysis = ({ competitors = sampleCompetitors }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];
  
  const pieData = competitors.map(comp => ({
    name: comp.name,
    value: comp.traffic_share, 
    traffic: comp.traffic
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm">
          <p className="font-semibold text-white">{payload[0].name}</p>
          <p className="text-gray-300">{`Traffic Share: ${payload[0].value}%`}</p>
          <p className="text-gray-300">{`Monthly: ${payload[0].payload.traffic}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    
    if (!payload) return null;
    
    return (
      <div className="mt-4 grid grid-cols-1 gap-2">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-sm mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300 text-sm">{entry.value}</span>
            </div>
            <span className="text-gray-400 text-sm">{entry.payload.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl mb-6 overflow-hidden">
      <button 
        onClick={toggleDropdown}
        className="w-full flex items-center justify-end p-6 hover:bg-gray-700/30 transition-all duration-300 group"
      >
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{competitors.length} competitors</span>
          {isOpen ? 
            <ArrowUp className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" /> : 
            <ArrowDown className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          }
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Distribution Chart */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-3">
                <h4 className="font-semibold text-white">Traffic Distribution</h4>
              </div>
              <div className="p-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      content={renderCustomizedLegend}
                      verticalAlign="bottom"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Competitor List */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-gray-800/50 border-b border-gray-700 px-4 py-3">
                <h4 className="font-semibold text-white">Key Competitors</h4>
              </div>
              <div className="divide-y divide-gray-700">
                {competitors.map((comp, index) => (
                  <div key={comp.id || index} className="p-4 hover:bg-gray-700/30 transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <a 
                        href={comp.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-semibold text-white hover:text-purple-400 transition-colors flex items-center gap-1"
                      >
                        {comp.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="bg-gray-800 border border-gray-600 px-2 py-1 rounded text-xs text-gray-300">
                        {comp.traffic}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{comp.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Get Full Analysis Button */}
          <div className="mt-6 text-center">
            <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-200">
              Get Full Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Newsletter Component
const NewsletterSignup = () => {
  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-x-12 -translate-y-16"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-3">Our SEO Newsletter</h3>
        <p className="text-gray-300 mb-6 leading-relaxed">Get weekly updates on trending keywords and new product ideas.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="email" 
            placeholder="Your email" 
            className="flex-1 px-4 py-3 rounded-full bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all duration-200"
          />
          <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};


// Main Demo Component

 export { KeywordVariations, 
          IdeaNotes, 
          MarketAnalysis, 
          MonetizationPotential,
          CompetitorAnalysis,
          NewsletterSignup,
  }
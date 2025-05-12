'use client'
import ThemeButton from "@/components/ThemeButton";
import { Competitor, Keyword, MarketAnalysis as MarketAnalysisType, MonetizationPotential as MonetizationPotentialType, Note } from "@/ideas";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ArrowDown, ArrowUp01 as ArrowUp, CopyCheck as Copy, DownloadCloud as Download, Image as ImageIcon } from 'lucide-react';
import Link from "next/link";
import { useRef, useState } from 'react';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';



// Competition level badge component
const KeywordVariations = ({ keywords } : {keywords: Keyword[]}) => {
  const CompetitionBadge = ({ level }) => {
    const getColor = () => {
      switch (level.toLowerCase()) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${getColor()}`}>
        {level}
      </span>
    );
  };
  
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
    // Convert volume strings like "10K" to numbers for comparison
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
    <div className="border border-gray-400 mb-6 font-mono">
      <button 
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-3 border-b bg-white border-gray-400 hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-wider"
      >
        <span className="font-bold">Keyword Variations</span>
        {isOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <div className="p-2">
          {/* Keyword List */}
          <div className="border border-gray-400">
            <div className="p-2 border-b border-gray-400 text-xs uppercase font-bold">
              Select keywords:
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-12 text-xs uppercase tracking-wider font-bold border-b border-gray-400 bg-white overflow-x-auto">
              <div className="col-span-6 p-2">Keyword</div>
              <div className="col-span-3 p-2">Volume</div>
              <div className="col-span-3 p-2">Competition</div>
            </div>
            
            {/* Table Body */}
            <div className="overflow-x-auto divide-y divide-gray-300">
              {sortedKeywords.map((keyword, index) => (
                <div key={index} className="grid grid-cols-12 text-xs hover:bg-gray-50">
                  <div className="col-span-6 p-2 flex items-center">
                    <input
                      type="checkbox"
                      id={`keyword-${index}`}
                      checked={selectedKeywords.includes(keyword.keyword)}
                      onChange={() => toggleKeywordSelection(keyword)}
                      className="mr-2"
                    />
                    <label htmlFor={`keyword-${index}`} className="cursor-pointer">
                      {keyword.keyword}
                    </label>
                  </div>
                  <div className="col-span-3 p-2">{keyword.volume}</div>
                  <div className="col-span-3 p-2">
                    <CompetitionBadge level={keyword.competition} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary Stats */}
            <div className="border-t border-gray-400 bg-white p-2 text-xs">
              <div className="grid grid-cols-2">
                <div><strong>Total Keywords:</strong> {keywords.length}</div>
                <div><strong>Monthly Volume:</strong> {totalMonthlyVolume}</div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <button 
              onClick={copyToClipboard} 
              className="flex items-center justify-center border border-gray-400 bg-white hover:bg-gray-200 p-2 text-xs uppercase tracking-wider"
            >
              <Copy className="h-3 w-3 mr-1" /> Copy Keywords
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// IdeaNotes Component
const IdeaNotes = ({ notes } : { notes: Note[]} ) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
return (
    <div className="border border-gray-400 mb-6 ">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-3 bg-white border-b border-gray-400 hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-wider"
      >
        <span className="font-bold">Idea Notes</span>
        {isOpen ? 
          <ArrowUp className="h-4 w-4" /> : 
          <ArrowDown className="h-4 w-4" />
        }
      </button>
      
      {isOpen && (
        <div className="p-2 space-y-2">
          {notes.length === 0 ? (
            <div className="p-2 text-center text-gray-500 text-xs">No notes yet</div>
          ) : (
            notes.map((note, index) => (
              <div key={index} className="border border-gray-300 bg-white">
                <div className="bg-white border-b border-gray-300 px-2 py-1">
                  <h4 className="text-xs uppercase tracking-wider font-bold">{note.title}</h4>
                </div>
                <div className="p-2">
                  <p className="text-xs leading-relaxed">{note.content}</p>
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
const MarketAnalysis = ({ data }: {data: MarketAnalysisType}) => {

  const getCurrentMonthIndex = () => {
    const now = new Date();
    return now.getMonth(); 
  };
  
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const getTrendData = (trend) => {
    const currentMonthIndex = getCurrentMonthIndex();
    const availableMonths = allMonths.slice(0, currentMonthIndex + 1);
    
    switch (trend?.toLowerCase()) {
      case "Upward":
        return availableMonths.map((month, index) => ({
          month,
          value: 30 + (index * 10)
        }));
      case "Downward":
        return availableMonths.map((month, index) => ({
          month,
          value: 90 - (index * 8)
        }));
      case "Rapid growth":
        return availableMonths.map((month, index) => ({
          month,
          value: 50 + Math.sin(index * 1.5) * 25
        }));
      case "Steady":
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
      case "Upward":
        return "#10b981"; // emerald/green
      case "Downward":
        return "#ef4444"; // red
      case "Rapid growth":
        return "#f59e0b"; // amber
      case "Steady":
        return "#6366f1"; // indigo
      default:
        return "#6366f1"; // indigo
    }
  };
  
  // Get trend description based on trend
  const getTrendDescription = (trend) => {
    switch (trend?.toLowerCase()) {
      case "Upward":
        return "Steadily growing market interest";
      case "Downward":
        return "Declining market interest over time";
      case "Rapid growth":
        return "Fluctuating market interest with peaks and valleys";
      case "Steady":
        return "Stable market interest with minimal variation";
      default:
        return "No clear trend available";
    }
  };


  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const trendData = getTrendData(data.trend);
  const chartColor = getChartColor(data.trend);
  const trendDescription = getTrendDescription(data.trend);
  const currentMonth = allMonths[getCurrentMonthIndex()];
  
  return (
    <div className="border border-gray-400 mb-6 font-mono shadow-md">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-3 bg-white border-b border-gray-400 hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-wider"
      >
        <span className="font-bold">Market Analysis</span>
        {isOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <div className="p-2">
          <div className="grid grid-cols-2 gap-1 mb-2">
            <div className="border border-gray-400">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                Monthly Search Volume 
              </div>
              <div className="p-2 text-center">
                <p className="font-bold">{data.search_volume ?? 'N/A'}</p>
              </div>
            </div>
            
            <div className="border border-gray-400">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                Competition Level
              </div>
              <div className="p-2 text-center">
                <p className="font-bold">{data.competition_level ?? 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {/* Market trend visualization using Recharts */}
          <div className="border border-gray-400">
            <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
              Market Trend: {data.trend ?? 'Unknown'}
            </div>
            <div className="p-2">
              <div className="h-64">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={chartColor} 
                        strokeWidth={2} 
                        dot={{ strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available for current month ({currentMonth})
                  </div>
                )}
              </div>
              <div className="mt-2 text-center text-sm font-medium">
                {trendDescription}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};


// Newsletter Component
const NewsletterSignup = () => {
  return (
    <div className="bg-blue-50 rounded-[16px] p-6 space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-x-12 -translate-y-16 opacity-50"></div>
      <h3 className="font-semibold relative z-10">Our SEO Newsletter</h3>
      <p className="text-sm relative z-10">Get weekly updates on trending keywords and new product ideas.</p>
      <div className="flex flex-col sm:flex-row gap-2 relative z-10">
        <input 
          type="email" 
          placeholder="Your email" 
          className="px-4 py-2 rounded border flex-1 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
        />
        <ThemeButton className="bg-white hover:bg-blue-50 transition-colors duration-200">
          Subscribe
        </ThemeButton>
      </div>
    </div>
  );
};

const MonetizationPotential = ({ data = [] }: {data: MonetizationPotentialType[]}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleDropdown = () => setIsOpen(!isOpen);
    
    return (
      <div className="border border-gray-400 mb-6 font-mono">
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between p-3 bg-white border-b border-gray-400 hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-wider"
        >
          <span className="font-bold">Monetization Potential</span>
          {isOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </button>
        
        {isOpen && (
        <div className="p-2 space-y-2">
          {data && (
            data.map((item, index) => (
              <div key={index} className="border border-gray-300 bg-white">
                <div className="bg-white border-b border-gray-300 px-2 py-1">
                  <h4 className="text-xs uppercase tracking-wider font-bold">{item.title}</h4>
                </div>
                <div className="p-2">
                  <p className="text-xs leading-relaxed">{item.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      </div>
    );
  };


const CompetitorAnalysis = ({ competitors = []} : { competitors: Competitor[]}) => {
    interface PieChartData {
      name: string;
      value: number;
      traffic: number;
    }
    
    interface CustomTooltipProps {
      active?: boolean;
      payload?: Array<{
        name: string;
        value: number;
        payload: PieChartData;
      }>;
    }
    
    interface CustomLegendProps {
      payload?: Array<{
        value: string;
        color: string;
        payload: PieChartData;
      }>;
    }


    const [isOpen, setIsOpen] = useState(true);
    
    const toggleDropdown = () => setIsOpen(!isOpen);
    
    const COLORS = ['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB'];
    
    const pieData: {
      name: string;
      value: number;
      traffic: number;
    }[] = competitors.map(comp => ({
      name: comp.name,
      value: comp.traffic_share, 
      traffic: comp.traffic
    }));
  
    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className="border border-gray-400 bg-white p-2 font-mono text-xs">
            <p className="font-bold">{payload[0].name}</p>
            <p>{`Traffic Share: ${payload[0].value}%`}</p>
            <p>{`Monthly: ${payload[0].payload.traffic}`}</p>
          </div>
        );
      }
      return null;
    };
    
    // Custom legend that matches our design
    const renderCustomizedLegend = (props: CustomLegendProps) => {
      const { payload } = props;
      
      if (!payload) return null;
      
      return (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 border border-gray-400" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="ml-2">
                {entry.value} ({entry.payload.value}%)
              </span>
            </div>
          ))}
        </div>
      );
    };
  
    return (
      <div className="border border-gray-400 mb-6 font-mono">
        <button 
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between p-3 bg-white border-b border-gray-400 hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-wider"
        >
          <span className="font-bold">Competitor Analysis</span>
          {isOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </button>
        
        {isOpen && (
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Traffic Distribution Chart */}
              <div className="border border-gray-400">
                <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                  Traffic Distribution
                </div>
                <div className="p-2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={1}
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
              <div className="border border-gray-400">
                <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                  Key Competitors
                </div>
                <div className="divide-y divide-gray-300">
                  {competitors.map((comp, index) => (
                    <div key={comp.id || index} className="p-2 text-xs hover:bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <a 
                          href={comp.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-bold underline"
                        >
                          {comp.name}
                        </a>
                        <span className="border border-gray-400 px-1">
                          {comp.traffic}
                        </span>
                      </div>
                      <p className="text-xs">{comp.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            
            {/* Get Full Analysis Button */}
            <div className="mt-2 text-center">
              <Link href={'/ideas/order'}>
              <button className="border border-black bg-white hover:bg-gray-200 py-2 px-4 text-xs uppercase tracking-widest font-bold"
              >
                
                  Get Full Analysis
              </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };
  


export {
  CompetitorAnalysis, IdeaNotes, KeywordVariations, MarketAnalysis, MonetizationPotential, NewsletterSignup
};


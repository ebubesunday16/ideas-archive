'use client'
import React, { useState, useRef } from 'react';
import ThemeButton from "@/components/ThemeButton";
import {  RocketLaunch } from "@/customSVG";
import { ArrowDown, ArrowUp01 as ArrowUp,  ChevronDown,  ChevronUp,  CopyCheck as Copy, DownloadCloud as Download, Image as ImageIcon  } from 'lucide-react';
import { saveAs } from 'file-saver';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


// Competition level badge component

const CompetitionBadge = ({ level }) => {
  const getStyle = () => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-gray-200 border-gray-400';
      case 'medium': return 'bg-white border-gray-300';
      case 'low': return 'bg-white border-gray-300';
      default: return 'bg-white border-gray-300';
    }
  };
  
  return (
    <span className={`text-xs px-1 py-0.5 border ${getStyle()} uppercase`}>
      {level}
    </span>
  );
};
// Enhanced KeywordVariations Component
const KeywordVariations = ({ keywords = [] }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const keywordListRef = useRef(null);
  
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

  const downloadAsPDF = () => {
    if (!keywordListRef.current) return;
    
    html2canvas(keywordListRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 190;
      const pageHeight = 290;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('keyword-analysis.pdf');
    });
  };

  const saveAsImage = () => {
    const element = document.getElementById('keywordList');
    
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'keyword-variations.png';
      link.href = canvas.toDataURL();
      link.click();
    });
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

  return (
    <div className="border border-gray-400 mb-6 font-mono">
      <button 
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-3  border-b bg-white border-gray-400 hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-wider"
      >
        <span className="font-bold">Keyword Variations</span>
        {isOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <div className="p-2">
          {/* Action buttons in a clean grid */}
         
          
          {/* Keyword List */}
          <div id="keywordList" ref={keywordListRef} className="border border-gray-400">
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
            <div className="divide-y divide-gray-300">
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
                <div><strong>Monthly Volume:</strong> {
                  keywords.reduce((sum, keyword) => {
                    // Convert volume strings to numbers and sum them
                    const num = parseFloat(keyword.volume.replace(/[^0-9.]/g, ''));
                    let multiplier = 1;
                    if (keyword.volume.includes('K')) multiplier = 1000;
                    if (keyword.volume.includes('M')) multiplier = 1000000;
                    return sum + (num * multiplier);
                  }, 0).toLocaleString()
                }</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 mb-3">
            <button onClick={copyToClipboard} className="flex items-center justify-center border border-gray-400 bg-white hover:bg-gray-200 p-2 text-xs uppercase tracking-wider">
              <Copy className="h-3 w-3 mr-1" /> Copy
            </button>
            <button onClick={downloadAsPDF} className="flex items-center justify-center border border-gray-400 bg-white hover:bg-gray-200 p-2 text-xs uppercase tracking-wider">
              <Download className="h-3 w-3 mr-1" /> PDF
            </button>
            <button onClick={saveAsImage} className="flex items-center justify-center border border-gray-400 bg-white hover:bg-gray-200 p-2 text-xs uppercase tracking-wider">
              <ImageIcon className="h-3 w-3 mr-1" /> Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// IdeaNotes Component
const IdeaNotes = ({ notes = [] }) => {
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
const MarketAnalysis = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  return (
    <div className="border border-gray-400 mb-6 font-mono">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-3 bg-white border-b border-gray-400 hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-wider"
      >
        <span className="font-bold">Market Analysis</span>
        {isOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </button>
      
      {isOpen && (
        <div className="p-2">
          {/* Primary market stats in a clean grid */}
          <div className="grid grid-cols-2 gap-1 mb-2">
            <div className="border border-gray-400">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                Monthly Search Volume
              </div>
              <div className="p-2 text-center">
                <p className="font-bold">{data?.searchVolume ?? 'N/A'}</p>
              </div>
            </div>
            
            <div className="border border-gray-400">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                Competition Level
              </div>
              <div className="p-2 text-center">
                <p className="font-bold">{data?.competitionLevel ?? 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {/* Market trend visualization */}
          <div className="border border-gray-400">
            <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
              Market Trend
            </div>
            <div className="p-2">
              {/* ASCII art chart as a placeholder */}
              <div className="font-mono text-xs leading-tight p-2 text-center whitespace-pre">
              {`
   ^
   |      *
   |    *   *
   |  *       * 
   |*           *
---+---------------->
   | Q1 Q2 Q3 Q4
              `}
              </div>
            </div>
          </div>
          
          {/* Market insights */}
          <div className="border border-gray-400 mt-2">
            <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
              Market Insights
            </div>
            <div className="divide-y divide-gray-300">
              <div className="p-2 text-xs">• Growing at 12% annually</div>
              <div className="p-2 text-xs">• Low barriers to entry</div>
              <div className="p-2 text-xs">• High customer retention potential</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Implementation Guide Component
const ImplementationGuide = ({ steps = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  return (
    <div className="border border-gray-400 mb-6 font-mono">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-3 bg-white border-b border-gray-400 hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-wider"
      >
        <span className="font-bold">Implementation Guide</span>
        {isOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </button>
      
      {isOpen && steps && (
        <div className="p-2">
          {/* Implementation steps */}
          <div className="border border-gray-400">
            <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
              Step-by-Step Guide
            </div>
            <div className="divide-y divide-gray-300">
              {steps.map((step, index) => (
                <div key={index} className="p-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 border border-gray-400 h-5 w-5 flex items-center justify-center mr-2">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase mb-1">{step?.title}</h4>
                      <p className="text-xs">{step?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Timeline */}
          <div className="border border-gray-400 mt-2">
            <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
              Implementation Timeline
            </div>
            <div className="p-2">
              <div className="text-xs">
                <div className="grid grid-cols-2 mb-1">
                  <div className="pr-1">PHASE 1 (WEEK 1-2):</div>
                  <div>Requirements & Setup</div>
                </div>
                <div className="grid grid-cols-2 mb-1">
                  <div className="pr-1">PHASE 2 (WEEK 3-6):</div>
                  <div>Core Development</div>
                </div>
                <div className="grid grid-cols-2 mb-1">
                  <div className="pr-1">PHASE 3 (WEEK 7-8):</div>
                  <div>Testing & Deployment</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="pr-1">PHASE 4 (WEEK 9+):</div>
                  <div>Monitoring & Optimization</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resources needed */}
          <div className="border border-gray-400 mt-2">
            <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
              Required Resources
            </div>
            <div className="grid grid-cols-2 gap-1 p-2 text-xs">
              <div className="border border-gray-300 p-1">
                <div className="font-bold">DEVELOPER HOURS</div>
                <div>240-320</div>
              </div>
              <div className="border border-gray-300 p-1">
                <div className="font-bold">BUDGET</div>
                <div>$15K-25K</div>
              </div>
              <div className="border border-gray-300 p-1">
                <div className="font-bold">TOOLS</div>
                <div>GIT, CI/CD, CLOUD</div>
              </div>
              <div className="border border-gray-300 p-1">
                <div className="font-bold">TEAM</div>
                <div>2-3 ENGINEERS</div>
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

// Technical Specifications Component
const TechnicalSpecifications = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  return (
    <div className="border border-gray-400 mb-6 font-mono">
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-3 bg-white border-b border-gray-400 hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-wider"
      >
        <span className="font-bold">Technical Specifications</span>
        {isOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      </button>
      
      {isOpen && data && (
        <div className="p-2">
          {/* Technical specs in a grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-2">
            <div className="border border-gray-400">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                Development Cost
              </div>
              <div className="p-2 text-center">
                <p className="font-bold">{data.developmentCost}</p>
              </div>
            </div>
            
            <div className="border border-gray-400">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                Development Timeline
              </div>
              <div className="p-2 text-center">
                <p className="font-bold">{data.timeline}</p>
              </div>
            </div>
            
            <div className="border border-gray-400">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                Monthly Maintenance
              </div>
              <div className="p-2 text-center">
                <p className="font-bold">{data.maintenanceCost}</p>
              </div>
            </div>
            
            <div className="border border-gray-400">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                Recommended Tech Stack
              </div>
              <div className="p-2 text-center">
                <p className="font-bold">{data.techStack}</p>
              </div>
            </div>
          </div>
          
          {/* System Architecture */}
          <div className="border border-gray-400">
            <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
              System Architecture (Premium)
            </div>
            <div className="p-4">
              {/* ASCII art diagram as a placeholder */}
              <div className="font-mono text-xs leading-tight p-2 text-center whitespace-pre">
              {`
  [ CLIENT ] ←→ [ API GATEWAY ]
       ↑               ↓
       └───[ DATABASE ]←┘
              `}
              </div>
              <div className="text-center text-xs mt-2">
                Upgrade to view detailed architecture diagram
              </div>
            </div>
          </div>
          
          {/* Scalability info */}
          <div className="border border-gray-400 mt-2">
            <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
              Scalability Analysis
            </div>
            <div className="p-2 text-xs">
              <div className="grid grid-cols-3 gap-1">
                <div className="border border-gray-300 p-1 text-center">
                  <div className="font-bold">USERS</div>
                  <div>10K-1M</div>
                </div>
                <div className="border border-gray-300 p-1 text-center">
                  <div className="font-bold">STORAGE</div>
                  <div>5TB</div>
                </div>
                <div className="border border-gray-300 p-1 text-center">
                  <div className="font-bold">SERVERS</div>
                  <div>2-8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  
  // Monetization Potential Component
  const MonetizationPotential = ({ data }) => {
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
        
        {isOpen && data && (
          <div className="p-2">
            {/* Monetization metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2">
              {Object.entries(data).map(([key, value], index) => {
                if (key === 'totalPotential') return null; // We'll show this separately
                
                return (
                  <div key={index} className="border border-gray-400">
                    <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="p-2 text-center">
                      <p className="font-bold">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Total Potential */}
            <div className="border border-gray-400 mb-2">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                Total Monthly Potential
              </div>
              <div className="p-3 text-center">
                <p className="text-lg font-bold">{data.totalPotential}</p>
              </div>
            </div>
            
            {/* Revenue Projection */}
            <div className="border border-gray-400">
              <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
                5-Year Revenue Projection (Premium)
              </div>
              <div className="h-32 flex items-center justify-center border-b border-gray-300 text-xs">
                <p className="text-center">Upgrade to view detailed projections</p>
              </div>
              <div className="grid grid-cols-5 text-center text-xs">
                <div className="p-1 border-r border-gray-300">Y1</div>
                <div className="p-1 border-r border-gray-300">Y2</div>
                <div className="p-1 border-r border-gray-300">Y3</div>
                <div className="p-1 border-r border-gray-300">Y4</div>
                <div className="p-1">Y5</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
// Competitor Analysis Component
const CompetitorAnalysis = ({ competitors = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // Simple monochromatic color palette for a more minimal aesthetic
  const COLORS = ['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB'];
  
  // Format the data for the pie chart
  const pieData = competitors.map(comp => ({
    name: comp.name,
    value: comp.trafficShare,
    traffic: comp.traffic
  }));

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
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
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    
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
                  <div key={index} className="p-2 text-xs hover:bg-gray-50">
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
          
          {/* Gap Analysis */}
          <div className="mt-2 border border-gray-400">
            <div className="bg-white border-b border-gray-400 p-2 text-xs uppercase font-bold">
              Market Gap Analysis
            </div>
            <div className="p-2 text-xs">
              <div className="grid grid-cols-1 gap-1">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-3 h-3 border border-gray-400 bg-black mr-2 mt-0.5"></div>
                  <p>Competitors lack your [advantage]</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-3 h-3 border border-gray-400 bg-gray-600 mr-2 mt-0.5"></div>
                  <p>Market growth outpaces current offerings</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-3 h-3 border border-gray-400 bg-gray-300 mr-2 mt-0.5"></div>
                  <p>Emerging segment not served properly</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Get Full Analysis Button */}
          <div className="mt-2 text-center">
            <button className="border border-black bg-white hover:bg-gray-200 py-2 px-4 text-xs uppercase tracking-widest font-bold">
              Get Full Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export {
  KeywordVariations,
  IdeaNotes,
  MarketAnalysis,
  ImplementationGuide,
  NewsletterSignup,
  TechnicalSpecifications,
  MonetizationPotential,
  CompetitorAnalysis,  
};
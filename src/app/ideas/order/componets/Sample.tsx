import ThemeButton from "@/components/ThemeButton";
import { RocketLaunch } from "@/customSVG";

const ProductSamplePreview = () => {
    return (
      <div className="border rounded-[16px] overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -translate-x-12 -translate-y-16 opacity-30"></div>
        
        <div className="bg-gray-50 py-4 px-6 border-b relative z-10">
          <h3 className="font-bold flex items-center">
            <span className="h-5 w-5 rounded-full bg-green-500 mr-2"></span>
            Sample Idea Report Preview
          </h3>
        </div>
        
        <div className="p-6 relative z-10">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h4 className="font-semibold text-lg mb-2 md:mb-0">Niche: AI Content Calendar Generator</h4>
              <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full font-medium text-sm">
                Opportunity Score: 8.7/10
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h5 className="text-sm font-semibold mb-3 flex items-center">
                  <span className="inline-block h-3 w-3 bg-blue-400 rounded-full mr-2"></span>
                  Search Statistics
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Monthly searches:</span>
                    <div className="bg-white px-2 py-1 rounded text-xs font-medium">5,700+</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Competition level:</span>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Low</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Trending direction:</span>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium flex items-center">
                      <span className="mr-1">↑</span> Rising (23% YoY)
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h5 className="text-sm font-semibold mb-3 flex items-center">
                  <span className="inline-block h-3 w-3 bg-purple-400 rounded-full mr-2"></span>
                  Key Features
                </h5>
                <ul className="space-y-2">
                  {["Auto-scheduling based on content type", 
                    "Integration with analytics tools", 
                    "Content gap identification", 
                    "Audience insight recommendations"].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      </span>
                      <span className="text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h5 className="text-sm font-semibold mb-3 flex items-center">
                <span className="inline-block h-3 w-3 bg-blue-400 rounded-full mr-2"></span>
                Market Gap Analysis
              </h5>
              <div className="bg-white p-3 rounded">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Demand</span>
                  <span className="font-medium">75% higher than competition</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-center text-blue-700">
                Current solutions only address 25% of user needs
              </div>
            </div>
            
            <div className="text-xs text-gray-500 italic text-center mt-6 bg-gray-50 p-3 rounded">
              This is a simplified preview. Full reports include 5x more detailed information,<br />
              keyword strategy, competitor analysis, and implementation roadmap.
            </div>
          </div>
          
          <div className="border-t pt-4 flex justify-center">
            <ThemeButton className="bg-white text-sm relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center">
                Get Full Reports <RocketLaunch className="ml-2 inline-block h-4 w-4 group-hover:translate-x-1 transition-transform duration-200"/>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </ThemeButton>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductSamplePreview
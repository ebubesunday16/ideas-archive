import { getIdeas } from "@/utils/ideasFetch";
import ProductCard from "./ProductCard";

export default async function ProductGrid() {
  const products = await getIdeas();
  
  return (
    <section className="border-x border-b py-8 md:py-12">
      <div className=" mx-auto px-4">
        {/* Header with Dashboard-style Title */}
        <div className="mb-8 border border-gray-400 bg-white">
          <div className="bg-gray-800 px-4 py-3 border-b border-gray-400">
            <h2 className="text-xl font-bold text-white font-mono tracking-wider">IDEA ARCHIVE</h2>
          </div>
          <div className="p-4 text-center">
            <p className="font-mono text-sm leading-relaxed max-w-3xl mx-auto">
              We spend our time digging through trends, analyzing markets, and brainstorming so you don't have to stress about coming up with the next big idea. This Archive is updated every week.
            </p>
          </div>
        </div>
        
        {/* Filter/Sort Controls - Optional Dashboard-style Element */}
        <div className="mb-6 flex flex-wrap gap-2 border border-gray-400 bg-gray-200 p-3">
          <span className="font-mono text-xs font-bold">FILTER BY:</span>
          <button className="bg-white text-gray-800 px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100">
            ALL IDEAS
          </button>
          <button className="bg-white text-gray-800 px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100">
            LOW COMPETITION
          </button>
          <button className="bg-white text-gray-800 px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100">
            TRENDING
          </button>
          <button className="bg-white text-gray-800 px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100">
            NEWEST
          </button>
        </div>
        
        {/* Products Grid */}
        {products?.length === 0 ? (
          <div className="p-6 text-center border border-gray-400 bg-white">
            <p className="font-mono text-gray-600">No ideas found. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products?.map((product, index) => (
              <ProductCard
                key={index}
                title={product.title}
                description={product.excerpt}
                category={product.main_keyword}
                accent={"#F6BD41"}
                id={product.id}
                competition={product.marketAnalysis?.competition_level}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
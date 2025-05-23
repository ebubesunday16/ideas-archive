import { RocketLaunch } from "@/assets/svgs";
import {
  CompetitorAnalysis,
  IdeaNotes,
  KeywordVariations,
  MarketAnalysis,
  MonetizationPotential
} from "@/components/IdeaComponents";
import ReusableHero from "@/components/ReusableHero";
import SaveButton from "@/components/SaveButton";
import { supabase } from "@/lib/supabaseClient";
import { getIdeaByIdServerSide } from "@/services/IdeasDataServer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Search, TrendingUp, Target, Users, DollarSign, BookOpen, Zap } from 'lucide-react';
import Link from "next/link";

const Page = async ({ params } : {params: {id: number}}) => {
  const resolvedParams = await params
  const { id: slug } = resolvedParams

  const {idea: ideaData, error} = await getIdeaByIdServerSide(slug)

  
  if (!ideaData) return notFound();
  
  return (
    <div className="">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Market Opportunity Analysis</span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-none">
                  {ideaData.title}
                </h1>
                
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  {ideaData.excerpt}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Monthly Searches</span>
                    </div>
                    <div className="text-2xl font-bold">{ideaData.search_volume?.toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">Main Keyword</span>
                    </div>
                    <div className="text-lg font-semibold truncate">{ideaData.main_keyword}</div>
                  </div>
                </div>

                {/* CTA Button */}
                
                  <Link href={'/'}>
                    <button className="group bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 mb-4">
                      <span>Get a Complete Analysis of this Idea</span>
                      <RocketLaunch className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </Link>

                <div className="flex items-center justify-between">
                  <SaveButton 
                    className="text-black bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30  px-4 py-2 rounded-full font-medium hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300" 
                    ideaId={ideaData.id!}
                  />
                </div>
              </div>

              {/* Image Section */}
              <div className="relative">
                
                  <Image
                    src={ideaData.image_url}
                    alt={ideaData.main_keyword}
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Headline Section */}
            <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-2 py-8 mb-12">
              <div className="flex items-center gap-3 mb-4 px-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-purple-400 font-medium uppercase tracking-wide">Main Keyword</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 px-4">{ideaData.headline}</h2>
            </div>

            {/* Components Grid */}
            <div className="space-y-12">
              {/* Keywords Section */}
              <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-2 py-8">
                <div className="flex items-center gap-3 mb-6 px-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold">Keyword Variations</h3>
                </div>
                <KeywordVariations keywords={ideaData.keywords} />
              </div>

              {/* Idea Notes */}
              <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-2 py-8">
                <div className="flex items-center gap-3 mb-6 px-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold">Research Notes</h3>
                </div>
                <IdeaNotes notes={ideaData.notes} />
              </div>

              {/* Two Column Layout for Analysis */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Competitor Analysis */}
                <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-2 py-8">
                  <div className="flex items-center gap-3 mb-6 px-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Competitor Analysis</h3>
                  </div>
                  <CompetitorAnalysis competitors={ideaData.competitors} />
                </div>

                {/* Market Analysis */}
                <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-2 py-8">
                  <div className="flex items-center gap-3 mb-6 px-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Market Analysis</h3>
                  </div>
                  <MarketAnalysis data={ideaData.market_analysis} />
                </div>
              </div>

              {/* Monetization Potential */}
              <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-2 py-8">
                <div className="flex items-center gap-3 mb-6 px-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold">Monetization Potential</h3>
                </div>
                <MonetizationPotential data={ideaData.monetization_potentials} />
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl px-2 py-8">
                <h3 className="text-2xl font-bold mb-4">Ready to explore this opportunity?</h3>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                  Get detailed market research, competitor analysis, and a step-by-step execution plan for this idea.
                </p>
                <button className="group bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 mx-auto">
                  <span>Get Complete Analysis</span>
                  <RocketLaunch className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
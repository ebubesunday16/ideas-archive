import {
  CompetitorAnalysis,
  IdeaNotes,
  ImplementationGuide,
  KeywordVariations,
  MarketAnalysis,
  MonetizationPotential,
  TechnicalSpecifications
} from "@/components/IdeaComponents";
import ReusableHero from "@/components/ReusableHero";
import SaveButton from "@/components/SaveButton";
import { RocketLaunch } from "@/assets/svgs";
import { supabase } from "@/lib/supabaseClient";
import { getIdeas } from "@/utils/ideasFetch";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { data } = await supabase.from('ideas').select('id')
  return data?.map((idea) => ({
    slug: idea.id.toString(),
  })) || []
}

const Page = async ({ params } : {params: {id: number}}) => {
  const resolvedParams = await params
  const { id: slug } = resolvedParams
  // const ideaData = await fetchIdeaData(slug)

  const resolvedData = await getIdeas() 
  const ideaData = resolvedData?.find((item) => item.id === Number(slug))
  
  if (!ideaData) return notFound();
  
  return (
    <main className="mb-24 ">
      <ReusableHero
        headline={ideaData.title}
        excerpt={ideaData.excerpt}
        reactButton={
          <div className="flex space-x-1.5 items-center">
            <p className="whitespace-nowrap">Free PDF Analysis Of this idea</p>
            <RocketLaunch className="" />
          </div>
        }
      >
        <Image
          src={ideaData.image_url}
          alt={ideaData.main_keyword}
          width={346}
          height={196}
          className=""
        />
      </ReusableHero>
      
      <div className="border-x border-black border-b mx-auto px-3 sm:px-8 pt-16">
        <SaveButton className="ml-auto" ideaId={ideaData.id!}/>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{ideaData.headline}</h2>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Main Keyword:</span>
            <span className="bg-white px-3 py-1 text-sm text-center border border-gray-400">{ideaData.main_keyword}</span>
            <span className="text-gray-500 text-sm">({ideaData.search_volume} monthly searches)</span>
          </div>
        </div>
        
        <div className="space-y-8 mb-16">
          <KeywordVariations keywords={ideaData.keywords} />
          
          <IdeaNotes notes={ideaData.notes} />
          
          <CompetitorAnalysis competitors={ideaData.competitors} />
          
          <MarketAnalysis data={ideaData.marketAnalysis} />
          
          
          <MonetizationPotential data={ideaData.monetizationPotential} />
          
          <TechnicalSpecifications data={ideaData.technicalSpecs} />
          
          <ImplementationGuide steps={ideaData.implementationSteps} />
          
          
        </div>
      </div>
    </main>
  );
};

export default Page;
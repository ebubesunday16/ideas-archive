import ThemeButton from "@/components/ThemeButton";
import { Avocado, RocketLaunch } from "@/customSVG";
import { Atom, Binoculars, Key } from 'lucide-react';
import Link from "next/link";

export default function CTA({ className }) {
  return (
    <section className={`border-x border-b ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-[#C4CCFD] py-16 px-8 flex items-center justify-center">
          <div className="">
            <h2 className="text-3xl font-bold mb-4">Ready to build something amazing?</h2>
            <p className="mb-8">
              Stop struggling with idea validation and market research. 
              Join developers who are building successful products with our carefully researched opportunities.
            </p>
            <Link href={'/ideas/order'}>
                <ThemeButton className="bg-white cursor-pointer">

                Get Started Today <RocketLaunch className="inline-block ml-2" />
                </ThemeButton>
            </Link>
          </div>
        </div>
        
        <div className="bg-[#CEFFF0] p-8 flex flex-col justify-center">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="font-bold text-xl mb-6">What You'll Get</h3>
            
            <div className="space-y-6">
              <div className="flex  gap-4">
                <div className="relative w-10 h-10 min-w-10 min-h-10  ">
                    <Avocado className="w-full h-full"/>
                    <Binoculars className="absolute top-1/2 -translate-y-1/2 right-0"/>
                </div>   
                <div>
                  <h4 className="font-bold">2 Low Hanging Niche</h4>
                  <p className="text-gray-600">Detailed analysis of trending opportunities and market gaps</p>
                </div>
              </div>
              
              <div className="flex gap-4">
              <div className="relative w-10 h-10 min-w-10 min-h-10 ">
                    <Avocado className="w-full h-full"/>
                    <Atom className="absolute top-1/2 -translate-y-1/2 right-0"/>
                </div>
                <div>
                  <h4 className="font-bold">Relevant keywords and stats for every niche</h4>
                  <p className="text-gray-600">Simplified roadmap for what to build and how to approach it, the SEO way</p>
                </div>
              </div>
              
              <div className="flex gap-4">
              <div className="relative w-10 h-10 min-w-10 min-h-10 ">
                    <Avocado className="w-full h-full"/>
                    <Key className="absolute top-1/2 -translate-y-1/2 right-0"/>
                </div>
                <div>
                  <h4 className="font-bold">Revenue Potential</h4>
                  <p className="text-gray-600">Projected earnings and monetization strategies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
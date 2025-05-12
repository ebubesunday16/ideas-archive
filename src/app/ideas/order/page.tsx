'use client'
import { CheckCircle, XCircle } from "@/assets/svgs";
import Image from "next/image";
import { useState } from "react";
import AnimatedCounter from "./components/AnimatedCounter";
import OrderButton from "./components/Button";
import ProcessStep from "./components/ProcessStep";
import ProductSamplePreview from "./components/Sample";

// Testimonial Card Component
const TestimonialCard = ({ quote, author, company }) => {
  return (
    <div className="bg-gray-50 rounded-[16px] border p-6 space-y-4 hover:shadow-md transition-shadow duration-300">
      <p className="text-sm italic">"{quote}"</p>
      <div className="flex items-center space-x-2">
        <div>
          <p className="font-semibold text-sm">{author}</p>
          <p className="text-xs text-gray-600">{company}</p>
        </div>
      </div>
    </div>
  );
};

// Process Step Component


// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b py-4">
      <button 
        className="flex w-full justify-between items-center text-left font-medium group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="group-hover:text-blue-600 transition-colors duration-200">{question}</span>
        <span className="bg-gray-100 h-6 w-6 rounded-full flex items-center justify-center text-sm group-hover:bg-blue-100 transition-colors duration-200">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <p className="mt-2 text-sm text-gray-600">{answer}</p>
      )}
    </div>
  );
};

// Pricing Component
const PricingCard = () => {
  return (
    <div className="border border-black rounded-[16px] overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="bg-gray-50 py-6 px-3 sm:px-6 text-center border-b">
        <h3 className="font-bold">Product Idea Package</h3>
        <div className="mt-4 mb-2">
          <span className="text-3xl font-bold">$199</span>
          <span className="text-gray-500 ml-2">one-time</span>
        </div>
        <p className="text-gray-600 text-xs">No recurring fees, no hidden charges</p>
      </div>
      
      <div className="py-6 px-8">
        <ul className="space-y-4 text-sm">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-green-500" />
            <span>Uncover 3 underserved unique niches with search demand</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-green-500" />
            <span>"Search Growth Roadmap" in PDF for each niche</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-green-500" />
            <span>Relevant keywords and stats for each niche</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 text-green-500" />
            <span>Dashboard providing every necessary information</span>
          </li>
        </ul>
        
        <div className="mt-8">
          <OrderButton className="w-full">
            GET STARTED NOW
          </OrderButton>
          <p className="text-xs text-center text-gray-500 mt-4">14-day money-back guarantee. Hurry now as this price maybe updated with time.</p>
        </div>
      </div>
    </div>
  );
};


// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 border border-black rounded-[16px] space-y-3 hover:shadow-md transition-shadow duration-300 hover:translate-y-[-5px] ">
      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

// Success Metrics Component
const SuccessMetric = ({ value, label }) => {
  return (
    <div className="text-center p-4 hover:scale-105 transition-transform duration-300">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

// CTA Banner Component
const CTABanner = () => {
  return (
    <div className="bg-gray-100 rounded-[16px] p-8 text-center space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full translate-x-[-50%] translate-y-[-50%] opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-50 rounded-full translate-x-[30%] translate-y-[30%] opacity-40"></div>
      
      <h2 className="text-2xl font-bold relative z-10">Ready to find your next product idea?</h2>
      <p className="relative z-10">Get 3 validated ideas with proven search demand delivered to your inbox</p>
      <OrderButton >
        GET STARTED NOW 
      </OrderButton>
    </div>
  );
};

// NEW: Enhanced Product Sample Preview Component with Grid Layout




// Updated Page Component
const Page = () => {
  return (
    <main className="space-y-32 my-24">
      {/* Enhanced Value Proposition Hero Section */}
      <section className="flex flex-col items-center space-y-8">
        <div className="max-w-3xl text-center">
          <span className="inline-block px-4 py-1 bg-blue-50 rounded-full text-sm font-medium mb-6">
            Stop Building Things Nobody Wants
          </span>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Skip The Guesswork, Get Profitable Product Ideas With Proven Demand
          </h1>
          
          <p className=" mb-10">
            We analyze search patterns and market gaps to deliver 3 unique, underserved product ideas 
            that people are actively searching for but not finding quality solutions.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
            <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
              
              <p className="font-semibold">For Solo Developers</p>
              <p className="text-sm text-gray-600">Build what people actually want</p>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
             
              <p className="font-semibold">For SaaS Companies</p>
              <p className="text-sm text-gray-600">Expand to untapped markets</p>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
              
              <p className="font-semibold">For Content Creators</p>
              <p className="text-sm text-gray-600">Monetize with high-demand tools</p>
            </div>
          </div>
        </div>
        
        {/* <Group4 /> */}
        
        <OrderButton>GET YOUR OWN PRODUCT IDEAS </OrderButton>
      </section>

      <section className="flex flex-col items-center space-y-8 text-center">
        <span className="inline-block px-4 py-1 bg-blue-50 rounded-full text-sm font-medium">
          Our Process
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold">
          Here's how we do it
        </h2>
        <p>We have a track record of scavenging the serp for high-potential, underserved opportunities</p>
        
        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-8">
          <ProcessStep 
            number="1" 
            title="Research & Discovery" 
            description="We analyze search patterns to find underserved market opportunities with high demand"
          />
          <ProcessStep 
            number="2" 
            title="Validation" 
            description="We verify each idea against multiple criteria to ensure it has true potential"
          />
          <ProcessStep 
            number="3" 
            title="Delivery" 
            description="You receive 3 validated ideas with complete market analysis and implementation guidance"
          />
        </div>
        
        <div className=" mt-12 group">
          
          <div className="relative">
            <Image 
              src={'/Group7.png'}
              height={824}
              width={424}
              alt="screenshots"
              className="rounded-lg"
            />
          </div>
        </div>
        
        <p className="text-gray-600">For businesses, startups, SAAS, blogs and indie hackers</p>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl border-t border-black border-b py-8 mt-12">
          <AnimatedCounter value="100+" label="Ideas Generated" icon="🔍" />
          <AnimatedCounter value="78%" label="Success Rate" icon="🏆" />
          <AnimatedCounter value="14 Days" label="Avg. Time to Launch" icon="🚀" />
        </div>
      </section>

      {/* Enhanced Product Sample Preview Section */}
      <section className="flex flex-col items-center space-y-8 max-w-2xl mx-auto">
        <span className="inline-block px-4 py-1 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
          Preview
        </span>
        <h2 className="text-3xl font-bold text-center">
          See What You'll Receive
        </h2>
        <p className="text-center mb-6">
          Each idea comes with comprehensive research and actionable insights
        </p>
        <ProductSamplePreview />
      </section>
      
      {/* Testimonials Section */}
      <section className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
          Testimonials
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          What our customers say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <TestimonialCard 
            quote="Anything Emmanuel Sunday is involved in, I’m in. I learned so much from the one time I worked with you—it was my biggest leap ever."
            author="Eso"
            company="Blogger, Teki360"
          />
          <TestimonialCard 
            quote="You can tell he knows what he does. I'm confident something good is coming out of this!"
            author="Sarah Chen"
            company="Solo Developer"
          />
          <TestimonialCard 
            quote="I once tried your stuff that you share on your newsletter and gained significant traction within weeks. I'm currently doing over 20k monthly in traffic."
            author="David Chukwuma"
            company="CEO, DAJAC"
          />
        </div>
      </section>

      <section className="border-y border-black ">
        <div className="w-full ">
          <div className="px-3 sm:px-8 md:px-16 py-24 space-y-8 max-w-[936px] mx-auto">
             <h2 className="text-3xl sm:text-4xl font-bold text-center"> All you have to do is build </h2>
             <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <div className="rounded-[16px] border-[#D40707] bg-[#D9D9D9] border py-4 px-6 min-w-[280px] flex-1 space-y-3 hover:shadow-md transition-shadow duration-300">
                   <div className="flex items-center justify-between">
                      <h3 className="font-semibold self-center">Before</h3>
                      <XCircle className="" />
                   </div>
                   <ul className="list-disc text-sm pl-6 space-y-4">
                      <li>Don't know what to build.</li>
                      <li>Stuck in the idea abyss.</li>
                      <li>Ambiguous product ideas.</li>
                      <li>Unproven market demand.</li>
                   </ul>
                </div>
                <div className="rounded-[16px] border-[#26A967] bg-[#C9F0DD]/30 border py-4 px-6 min-w-[280px] flex-1 space-y-3 hover:shadow-md transition-shadow duration-300">
                   <div className="flex items-center justify-between">
                      <h3 className="font-semibold self-center">Now</h3>
                      <CheckCircle className="" />
                   </div>
                   <ul className="list-disc text-sm pl-6 space-y-4">
                      <li>Get a roadmap on what exactly needs you.</li>
                      <li>Clarity is peace with proper mapping.</li>
                      <li>Build tools with search demand.</li>
                      <li>Stop thinking about conventional marketing.</li>
                   </ul>
                </div>
             </div>
          </div>
        </div>
      </section>
      
      {/* Pricing and FAQ Section - Side by Side on Desktop */}
      <section className="">
        <span className="inline-block px-4 py-1 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-4 mx-auto  text-center">
          Investment
        </span>
        <h2 className="text-3xl font-bold mb-8 text-center">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12  items-center">
          {/* Pricing Column */}
          <div>
            <PricingCard />
          </div>
          
          {/* FAQ Column */}
          <div>
            <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
            <div className="space-y-2">
              <FAQItem 
                question="How are the product ideas selected?" 
                answer="We use a combination of search volume analysis, competition assessment, market trend evaluation, and years of experience doing SEO, to identify truly underserved opportunities with proven demand."
              />
              <FAQItem 
                question="What do I receive exactly?" 
                answer="You'll receive 3 validated product ideas with detailed analysis including search volumes, keyword opportunities, potential revenue models, and implementation guidance."
              />
              <FAQItem 
                question="How long does the process take?" 
                answer="You'll receive your ideas within 3-5 business days after your order is confirmed."
              />
              <FAQItem 
                question="How does this work?" 
                answer="After making your payment, you’ll receive a confirmation email verifying your purchase. Shortly after, you'll get another email asking for any necessary information to help us understand your needs and find ideas that best suits you."
              />
              
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="flex flex-col items-center space-y-8 ">
        <span className="inline-block px-4 py-1 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
          Features
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          What's included
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          <FeatureCard 
            icon="🔍" 
            title="Market Analysis" 
            description="Comprehensive search demand data and competitor landscape overview"
          />
          <FeatureCard 
            icon="📊" 
            title="Revenue Potential" 
            description="Projected earnings models and monetization options"
          />
          <FeatureCard 
            icon="🛠️" 
            title="Implementation Guide" 
            description="Technical requirements and development roadmap"
          />
          <FeatureCard 
            icon="🎯" 
            title="Keyword Strategy" 
            description="Ready-to-use keyword plan to dominate search results"
          />
          
          <FeatureCard 
            icon="📱" 
            title="Platform Advice" 
            description="Recommendations for ideal tech stack and platforms"
          />
        </div>
      </section>
      
      
      
      {/* Final CTA */}
      <section >
        <CTABanner />
      </section>
    </main>
  );
};

export default Page;
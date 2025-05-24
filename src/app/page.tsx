import React from 'react';
import { ArrowRight, CheckCircle, Target, TrendingUp, Zap, ArrowUpRight, Star } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import IdeaCarousel from '@/components/homepageui/IdeaCarousel';
import Link from 'next/link';
import SubscriptionButton from '@/components/SubscriptionButton';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import ProfileGrid from '@/components/ProfileMap';
import { profilemap } from '@/assets/images';

export default function SEOLandingPage() {
  return (
    <div className="">

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto  pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">The missing piece in 99% of SEO strategies</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-none">
            Let’s Beg the God of SEO on Your Behalf.
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            While others fight over saturated keywords, we find the search gaps no one is targeting yet. 
          </p>
          <div className='flex justify-center mb-12'>

            <ProfileGrid />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="group bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 cursor-pointer">
              <Link href={'#pricing'}>
                Get your map
              </Link>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            {/* <button className="border border-gray-700 text-gray-300 px-6 py-3 rounded-full font-medium hover:border-gray-600 hover:text-white transition-all duration-200 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm"></div>
              Continue with Google
            </button> */}
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="bg-gradient-to-b from-gray-900/50 to-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-1">
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="h-96 bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex flex-col md:flex-row items-center justify-center gap-4">
                <Image 
                      src={'/Group7.png'}
                      height={824}
                      width={424}
                      alt="screenshots"
                      className="rounded-lg"
                    />
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">

                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-400">Off-the-roof success rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 border-t border-gray-800">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">99%</div>
              <div className="text-sm text-gray-400">Sites miss topical mapping</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">3x</div>
              <div className="text-sm text-gray-400">Faster ranking improvements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">72h</div>
              <div className="text-sm text-gray-400">Custom map delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">0</div>
              <div className="text-sm text-gray-400">Backlinks required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto ">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                We find drought.<br />
                <span className="text-gray-400">You supply water.</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                SEO is too tedious to do wrong. While competitors battle over the same keywords, 
                we discover untapped opportunities.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group p-8 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-300">
                <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Wrong targets</h3>
                <p className="text-gray-400 leading-relaxed">Everyone fights for the same high-competition keywords. Waits months with zero results</p>
              </div>
              
              <div className="group p-8 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-300">
                <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">No strategy</h3>
                <p className="text-gray-400 leading-relaxed">Random content creation without understanding what users actually search for.</p>
              </div>
              
              <div className="group p-8 border border-gray-700 bg-gradient-to-b from-gray-800/30 to-gray-900/30 rounded-2xl">
                <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our solution</h3>
                <p className="text-gray-400 leading-relaxed">Strategic topical mapping that encompasses low-competition keywords, SEO roadmap that works, search opportunities, and the best way to approach search tailored to your niche. This make all the difference!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-32 border-t border-gray-800">
        <div className="container mx-auto ">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Bring on the magic 🪄
              </h2>
              <p className="text-xl text-gray-400">
                Focus on building. We'll focus on the SERPs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white text-black rounded-full max-w-8 min-w-8 max-h-8 min-h-8 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Share your site</h3>
                    <p className="text-gray-400">Tell us about your website and business goals. Takes 2 minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 max-w-8 min-w-8 max-h-8 min-h-8 h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">We analyze deeply</h3>
                    <p className="text-gray-400">Our team discovers market gaps and untapped keyword opportunities tailored to your niche. </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 max-w-8 min-w-8 max-h-8 min-h-8 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Get your custom map</h3>
                    <p className="text-gray-400">Receive a strategic topical map with zero-competition keywords and content roadmap.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl p-8 border border-gray-700">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Keyword Analysis</span>
                      <span className="text-sm text-green-400">Complete</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-full"></div>
                    </div>
                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Low competition keywords found:</span>
                        <span className="text-white font-semibold">247</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Content gaps identified:</span>
                        <span className="text-white font-semibold">89</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Competitor blind spots:</span>
                        <span className="text-white font-semibold">156</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secret Section */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto ">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
              The secret to SEO<br />
              <span className="text-gray-400">is not backlinks</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            While everyone’s busy obsessing over link building, the truth is — backlinks just get you there faster. That’s great. But if your destination is from here to Timbuktu, it’s still going to take forever. A good content mapping skills shorten that distance to a stone throw.
            </p>
            
            <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-8">What we do different</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Zero-competition gaps</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Strategic content roadmap</span>
                </div>
                
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Competitor gap insights</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Get you ranking in weeks</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>Map your topical authority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 py-32 border-t border-gray-800">
        <div className="container mx-auto ">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">
                Trusted by smart founders
              </h2>
              <p className="text-gray-400">Join people who stopped guessing and started ranking</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "Finally found keywords my competitors weren't targeting. Traffic doubled in 3 months. This actually works."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Image 
                    src={profilemap[6]}
                    width={40}
                    height={40}
                    alt="David Chukwuma's profile picture"
                    className='w-full h-full'
                    />
                  </div>
                  <div>
                    <div className="font-medium">David Chukwuma</div>
                    <div className="text-sm text-gray-400">E-commerce founder</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">
                  "Didn't know SEO can be this easy. Game changer."
                </p>
                <div className="flex items-center gap-3 mt-auto ">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                  <Image 
                    src={profilemap[0]}
                    width={40}
                    height={40}
                    alt="Glory profile picture"
                    className='w-full h-full'
                    />
                  </div>

                  <div>
                    <div className="font-medium">Glory</div>
                    <div className="text-sm text-gray-400">Anonymous</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "Don't know how he does it, but he's so good at keyword research. I'm fast approaching 20k traffic because I worked with Emmanuel."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Dan</div>
                    <div className="text-sm text-gray-400">Substack Subscriber / Pledge-r</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id='pricing' className="relative z-10 py-32 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-gray-400">
                One payment. Your competitive advantage forever.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border-2 border-gray-600 rounded-3xl p-8 relative">
                {/* Popular badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-full">
                    Most popular
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold mb-4">Custom Topical Map</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold">$499</span>
                    <span className="text-gray-400 ml-2">one-time</span>
                  </div>
                  <p className="text-gray-400">Everything you need to dominate your niche</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">Complete topical map for your niche</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">200+ low-competition keywords</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">Strategic content roadmap</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">Competitor gap analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">User intent breakdown</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">72-hour delivery guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-left">30-day money-back guarantee</span>
                  </div>
                </div>
                
                <a
                href={'https://outgenerate.gumroad.com/l/extensive'}
                className='w-full bg-white text-black py-4 rounded-full hover:bg-gray-100 transition-all duration-200 mb-4 cursor-pointer  inline-block font-semibold'
                >
                
                  Get your map now
                </a>

                <p className="text-sm text-gray-500 text-center">
                  No subscription. No hidden fees. Own it forever.
                </p>
              </div>
            </div>

            {/* <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4">Trusted by 500+ businesses</p>
              <div className="flex justify-center items-center gap-8 opacity-50">
                <div className="w-20 h-8 bg-gray-700 rounded"></div>
                <div className="w-16 h-8 bg-gray-700 rounded"></div>
                <div className="w-24 h-8 bg-gray-700 rounded"></div>
                <div className="w-18 h-8 bg-gray-700 rounded"></div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Ideas Archive Section */}
      <section className="relative z-10 py-32 border-t border-gray-800">
        <div className="container mx-auto ">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-purple-300">Updated weekly</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Don't Have a Product yet? Build from these...
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                We live by digging through trends, analyzing markets, and brainstorming so you don't have to stress about coming up with the next big idea. This Archive is updated every day.
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className="text-sm text-gray-500">outgenerate.com/ideas</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span className="text-sm text-gray-500">5-10 new ideas weekly</span>
              </div>
            </div>

            {/* Featured Ideas Carousel */}
            <IdeaCarousel />

            {/* CTA for Ideas Archive */}
            <div className="text-center">
              <Link href={`/ideas`}>
                <button className="group bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 text-white px-8 py-4 rounded-full font-medium hover:from-purple-500/30 hover:to-blue-500/30 hover:border-purple-400/50 transition-all duration-300 flex items-center gap-3 mx-auto">
                  <span>Explore 200+ more ideas</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                </button>
              </Link>
              
              <p className="text-sm text-gray-500 mt-4">
                Fresh ideas added daily • Free to browse
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto ">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to stop<br />
                wasting time on SEO?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Get your custom topical map and start ranking for keywords 
                your competitors don't even know exist.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href={'https://outgenerate.gumroad.com/l/extensive'}
                className='group bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2'
                >
                  Get your map now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
                <Link 
                href={'/api/auth/signin'}
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-full font-medium hover:border-gray-500 hover:text-white transition-all duration-200 flex items-center gap-2"
                
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm"></div>
                  Continue with Google
                </Link>
              </div>
              
              
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
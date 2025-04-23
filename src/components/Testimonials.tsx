'use client'
import { useState } from 'react';

export default function Testimonials({ className }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      image: "/api/placeholder/64/64",
      quote: "DREAMERBRO helped me find a niche that perfectly matched my skills. I launched my product in just 3 weeks and already have paying customers!",
      company: "IndieHacker"
    },
    {
      name: "Marcus Johnson",
      role: "Full-Stack Developer",
      image: "/api/placeholder/64/64",
      quote: "The research data is invaluable. Instead of spending months figuring out what to build, I got straight to coding and solving real problems.",
      company: "TechFounder"
    },
    {
      name: "Aisha Patel",
      role: "UX Designer & Developer",
      image: "/api/placeholder/64/64",
      quote: "As someone who struggles with idea validation, DREAMERBRO's market research changed everything for me. My current project already has a waitlist!",
      company: "DesignCode Studio"
    }
  ];

  return (
    <section className={`   ${className}`}>
      <div className="max-w-6xl  mx-auto ">
        <h2 className="text-3xl font-bold text-center pt-24 pb-12 hidden md:block border-x ">Builders Who Found Their Perfect Idea</h2>
        
        <div className="flex flex-col md:flex-row ">
          <div className="w-full md:w-1/3 flex flex-col px-8 py-24 border-x border-b md:border">
            <h2 className="text-3xl font-bold text-center mb-16 md:hidden">Builders Who Found Their Perfect Idea</h2>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-4 cursor-pointer rounded-lg transition-all duration-300 ${
                  activeIndex === index 
                    ? "bg-white shadow-md border-l-4 border-[#F6BD41]" 
                    : "hover:bg-white hover:shadow-sm"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        <div className='w-full md:w-2/3  flex flex-col justify-center px-8 py-24 border-x border-b md:border-y md:border-r md:border-x-0'>

          <div className="p-8 rounded-lg shadow-md bg-white  flex flex-col justify-center px-8 py-4 ">
            <div className="mb-6">
              <svg className="w-12 h-12 text-[#C4CCFD]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-xl mb-6 font-medium italic">
              {testimonials[activeIndex].quote}
            </p>
            <div className="flex items-center mt-auto">
              <div className="flex-grow">
                <p className="font-bold">{testimonials[activeIndex].name}</p>
                <p className="text-gray-600">{testimonials[activeIndex].company}</p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#F6BD41]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
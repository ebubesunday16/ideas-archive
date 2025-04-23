import CTA from "@/components/CTA";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import Hero from "@/sections/Hero";
import Ideas from "@/sections/Ideas";
import MarqueeComponent from "@/sections/MarqueeComponent";

export default function Page() {
  return (
    <main className="pb-16">
      <Hero className=""/>
      {/* <MarqueeComponent /> */}
      <ProductGrid />
      {/* <Testimonials /> */}
      {/* <CTA /> */}
      

    </main>
    
  );
}

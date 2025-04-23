import ThemeButton from "@/components/ThemeButton"
import { PatreonBackground } from "@/assets/svgs"
import { ReactNode } from "react"
 
const ReusableHero = ({className, headline, excerpt, reactButton, children}: {className?: string, headline: string, excerpt: string, reactButton: ReactNode, children: ReactNode}) => { 
  return ( 
    <section className={`border-x border-b border-black flex flex-col md:flex-row justify-center ${className}`}> 
       
        <div className="bg-[#CEFFF0] w-full md:w-1/2  px-3 sm:px-8 py-24 space-y-4 flex flex-col justify-center "> 
            <div className="space-y-5"> 
                <h1 className="font-bold text-2xl">{headline}</h1> 
                <p className="text-sm ">{excerpt}</p>
            </div> 
            <ThemeButton className="bg-white self-start text-xs"> 
              {reactButton} 
            </ThemeButton> 
        </div> 
        
        <div className="bg-[#C4CCFD] w-full md:w-1/2  px-3 sm:px-8 py-12 sm:order-1"> 
            <div className="w-full flex flex-cocl justify-center items-center h-full relative max-w-[220px] mx-auto"> 
                <PatreonBackground className="w-full m-auto "/> 
                <div className="absolute top-1/2 -translate-y-1/2"> 
                    {children} 
                </div>
            </div>
        </div>
       
    </section> 
  ) 
} 
 
export default ReusableHero
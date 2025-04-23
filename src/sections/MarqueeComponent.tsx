import { StarFour } from "@/customSVG"
import { MarqueeData } from "@/data/Constants"
import Marquee from "react-fast-marquee"

const MarqueeComponent = ({className}: {className?: string}) => {
  return (
    <div className="relative h-12 ">
      {/* Add a spacer div to maintain height */}
     
      
      <div className="absolute py-4 bg-black text-white w-screen left-1/2 -translate-x-1/2">
        <Marquee autoFill className="" speed={20}>
          {MarqueeData.map(item => (
            <div className="flex mx-4 space-x-4 items-center">
              <div>{item}</div>
              <StarFour />
              
            </div>
            ))}
        </Marquee>
      </div>
    </div>
  )
}

export default MarqueeComponent
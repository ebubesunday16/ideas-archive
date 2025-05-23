import { images } from "@/assets/images"
import { RocketLaunch } from "@/assets/svgs"
import ChatBoxComponent from "@/components/homepageui/ChatBox"
import ChatBox2Component from "@/components/homepageui/ChatBox2"
import ThemeButton from "@/components/ThemeButton"
import Image from "next/image"
import Link from "next/link"

const Hero = ({className}: {className?: string}) => {
  return (
    <section className={`border-black border-x border-b flex flex-col md:flex-row justify-between  ${className}`}>
      
        <div className="bg-[#CEFFF0] flex-1 px-3 sm:px-8 pt-24 pb-24 space-y-4">
            <h1 className="font-bold text-2xl ">We do the Researching, you do the building
            </h1>
            <p className="text-sm"> Find low-competition keywords no one else is targeting and stay ahead in your SEO game. Get your own idea, just for you.
            </p>
            <Link href={'/ideas/order'}>
              <ThemeButton className="bg-white cursor-pointer mt-4 text-xs hover:bg-gray-100">
              Simplify building <RocketLaunch className=" ml-2 inline-block text-sm "/>
            </ThemeButton>
            </Link>
            

        </div>
        <div className="bg-[#C4CCFD] flex-1  grid place-content-center px-3 sm:px-8 pt-24 pb-24">
          <div className="w-full h-full  my-auto">
            <div className="relative">
              {/* <LadyWithLaptop className=" inline-block w-full"/> */}
              <Image src={images.lady} width={232} height={160} alt="lady" className="inline-block w-full"/>
              <div className="absolute -top-14 -right-14 left-auto">
                <ChatBoxComponent />
              </div>
              <div className="absolute bottom-16 left-4">
                <ChatBox2Component />
              </div>
            </div>

          </div>

          
           
        </div>
      
    </section>
  )
}

export default Hero

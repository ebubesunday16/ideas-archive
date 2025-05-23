import SignInbtn from "@/components/SignInBtn"
import Link from "next/link"


const Footer = ({className}: {className?: string}) => {
  return (
    // <footer className={`mt-8 mb-16 ${className} `}>
      
      
    //   <div className="flex flex-col gap-6 justify-between items-start sm:flex-row ">
    //     <div className=" flex-1 flex flex-col space-y-4">
    //       <Link href={'/ideas'} className="flex items-center gap-4">
    //         <span className="block font-semibold text-sm sm:text-base">OUTGENERATE</span>
    //         <span className="block font-semibold text-sm sm:text-base bg-[#F6BD41] text-black px-1 rounded-[3px]">
    //             Ideas
    //         </span>
    //       </Link>
    //       <p className="text-[12px] ">
    //         <span className="border-b-2 border-b-[#1C3144]/60"> OUTGENERATE</span> is a project by Emmanuel Sunday.
    //       </p>
    //       <p className="text-[12px] ">Have any feedback, idea, contract? Find him on <a href={'https://x.com/emannsunday'} target="_blank" rel="noopener noreferrer" className="border-gray-500 border-b">X</a></p>
    //       <p className="text-[10px]">&copy; Copyright {new Date().getFullYear()}.</p>
    //     </div>
        
    //     <div className=" flex-1">
    //       <h2 className="text-base font-bold mb-2">Quick Links</h2>
    //       <ul className="text-xs font-light flex flex-col space-y-2">
    //         <li className="hover:underline">
    //           <Link href='/ideas'>
    //             Archive
    //           </Link>
    //         </li>
    //         <li className="hover:underline">
    //           <Link href='/ideas/order'>
    //             Premium
    //           </Link>
    //         </li>
    //         <SignInbtn className="hover:underline"/>
    //       </ul>
    //     </div>
    //   </div>
    // </footer>

      <footer className="relative z-10 border-t border-gray-800 py-16">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
            <div className="max-w-sm">
              <Link href={'/'} >
                <div className="text-xl font-semibold mb-4 tracking-tight">outgenerate</div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                The smartest way to dominate search results through strategic topical mapping.
              </p>
            </div>
            
            <div className="pr-30">
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm text-gray-400">
               
                <li className="hover:text-white transition-colors cursor-pointer">
                  <Link href={'/'}>
                  Home
                  </Link>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  <Link href={'/feed'}>
                  Blog
                  </Link>
                </li>
                 <li className="hover:text-white transition-colors cursor-pointer">
                  <Link href={'/ideas'}>
                     Ideas Archive
                  </Link>
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  <Link href={'/api/auth/signin'}>
                   Sign In
                  </Link>
                  </li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">&copy; 2025 Outgenerate. All rights reserved.</p>
          </div>
        </div>
      </footer>

  )
}

export default Footer

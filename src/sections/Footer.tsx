import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SignInbtn from "@/components/SignInbtn"
import { getServerSession } from "next-auth"
import { signIn, signOut } from "next-auth/react"
import Link from "next/link"


const Footer = async ({className}: {className?: string}) => {

  const session = await getServerSession(authOptions)

  return (
    <footer className={`mt-8 mb-16 ${className} `}>
      
      
      <div className="flex flex-col gap-6 justify-between items-start sm:flex-row ">
        <div className=" flex-1 flex flex-col space-y-4">
          <Link href={'/ideas'} className="flex items-center gap-4">
            <span className="block font-semibold text-sm sm:text-base">OUTGENERATE...</span>
            <span className="block font-semibold text-sm sm:text-base bg-[#F6BD41] text-black px-1 rounded-[3px]">
                Ideas
            </span>
          </Link>
          <p className="text-[12px] ">
            <span className="border-b-2 border-b-[#1C3144]/60"> Outgenerate</span> is a project by Emmanuel Sunday.
          </p>
          <p className="text-[12px] ">Have any feedback, idea, contract? Find him on <a href={'https://x.com/emannsunday'} target="_blank" rel="noopener noreferrer" className="border-gray-500 border-b">X</a></p>
          <p className="text-[10px]">&copy; Copyright {new Date().getFullYear()}.</p>
        </div>
        
        <div className=" flex-1">
          <h2 className="text-base font-bold mb-2">Quick Links</h2>
          <ul className="text-xs font-light flex flex-col space-y-2">
            <li className="hover:underline">
              <a href='https://airizzgenerator.com/'>
                OUTGENERATE
              </a>
            </li>
            <li className="hover:underline">
              <Link href='/ideas'>
                ARCHIVE
              </Link>
            </li>
            <li className="hover:underline">
              <Link href='/ideas/dashboard'>
                DASHBOARD
              </Link>
            </li>
            <SignInbtn className="hover:underline "/>
           
            
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer

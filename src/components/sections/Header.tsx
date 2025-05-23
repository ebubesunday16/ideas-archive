'use client'
import SignInbtn from "@/components/SignInBtn";
import ThemeButton from "@/components/ThemeButton";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Header = ({className}: {className?: string}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession()


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // <header className={`border-b border-black border-x flex justify-between items-center py-3 px-3 sm:px-8 ${className}`}>
    //   <div className="">
    //     <Link href={'/ideas'}>
    //       <span className="text-sm sm:text-base font-bold">
    //         OUTGENERATE
    //       </span>
    //     </Link>
    //   </div>
      
    //   <div className="relative border border-gray-400 " ref={dropdownRef}>
    //     <ThemeButton 
    //       className="bg-[#F6BD41] text-xs  cursor-pointer flex items-center " 
    //       onClick={(e) => {
    //         e.preventDefault();
    //         toggleDropdown();
    //       }}
    //     >
    //       GET THE PERFECT IDEA
    //       <span className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>

    //         <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    //           <polyline points="6 9 12 15 18 9"></polyline>
    //         </svg>
    //       </span>
    //     </ThemeButton>
        
       
      
    //   {isOpen && (
    //     <div className="p-2 space-y-2 w-full border border-gray-400 mb-6 absolute right-0 text-xs z-10">
    //       <Link href="/ideas/order">
    //         <div className="block p-2  hover:bg-gray-50 transition-colors duration-200 text-xs font-medium uppercase border border-gray-300 bg-white">
    //           Get The Perfect Idea
    //         </div>
    //       </Link>
          
    //       <SignInbtn className="block p-2 hover:bg-gray-50 transition-colors duration-200 text-xs  font-medium uppercase border border-gray-300 bg-white" uppercase="uppercase"/>
          
       
    //     </div>
    //   )}
    //   </div>
    // </header>


    <header className="relative z-10 container mx-auto px-6 py-6">
        <nav className="flex justify-between items-center">
        <Link href={'/'}>
          <div className="text-xl font-semibold tracking-tight">
            outgenerate
          </div>
        </Link>
        <Link href={'/#pricing'}>
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-200">
            Get started
          </button>
        </Link>
        </nav>
      </header>
  );
};

export default Header;
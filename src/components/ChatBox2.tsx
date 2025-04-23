import { AppleLogo, ThreeDots } from "@/customSVG"

const ChatBox2Component = () => {
  return (
    <div className='absolute p-2 flex flex-col justify-between bg-[#F6BD41] border border-black h-[96px]'>
            <div className='flex justify-between'>
                <AppleLogo />
                <ThreeDots />
            </div>
            <div className=' space-y-2'>
                <h3 className='text-[10px] font-semibold'>Presentation timer</h3>
                <p className='text-[6px] font-semibold'>Search demand: 1000+</p>
            </div>
    </div>
  )
}

export default ChatBox2Component

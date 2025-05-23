import { AppleLogo, ChatBox, ThreeDots } from '@/assets/svgs'

const ChatBoxComponent = () => {
  return (
    <div className='relative w-[110px]'>
        <ChatBox className=" w-full  "/>


        <div className='absolute top-0 left-0 w-full p-2 flex flex-col justify-between h-full pb-8'>
            <div className='flex justify-between'>
                <AppleLogo />
                <ThreeDots />
            </div>
            <div className=' space-y-2.5'>
                <h3 className='text-[10px] font-semibold'>Image Variation</h3>
                <p className='text-[6px] font-semibold'>Search demand: 1000+</p>
            </div>
        </div>


      
    </div>
  )
}

export default ChatBoxComponent

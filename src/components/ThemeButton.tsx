import { ReactNode, MouseEvent } from "react"

const ThemeButton = ({children, className, onClick, type}: {children: ReactNode, className: string, onClick?: (e: MouseEvent) => void, type?: string}) => {
  return (
    <button className={`border border-black py-3 px-5  font-bold uppercase shadow-[2px_2px_0_0_#333333] cursor-pointer ${className}`} onClick={onClick}  type={type}>
        {children}
    </button>
  )
}

export default ThemeButton

import IdeaContainer from "@/components/IdeaContainer"

const Ideas = ({className}: {className?: string}) => {
  return (
    <section className={`space-y-4 ${className}`}>

      <h2 className=" text-right font-semibold underline ">recent addition...</h2>
      <div>
        <IdeaContainer />

      </div>
    </section>
    
  )
}

export default Ideas


const ProcessStep = ({ number, title, description }: {number: string, title: string, description: string}) => {
    return (
      <div className="flex space-x-4 hover:translate-y-[-5px] transition-transform duration-300">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
          {number}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    );
  };



export default ProcessStep
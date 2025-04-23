// NEW: Animated Number Component
const AnimatedCounter = ({ value, label, icon }: {value: string, label: string, icon: string}) => {
    return (
      <div className="text-center p-4 relative group cursor-pointer">
        <div className="absolute inset-0 bg-blue-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-gray-100 text-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    );
  };

  export default AnimatedCounter
import Image from "next/image";
import { profilemap } from "../assets/images";

const ProfileMap = () => {
  return (
    <div className="flex gap-10 items-center">
      <div className="flex items-center">
        {profilemap.map((item, index) => {
          return (
            <Image
              className="first:ml-0 -ml-7 relative z-10"
              key={index}
              width={40}
              height={40}
              src={item}
              alt={`Profile ${index}`}
            />
          );
        })}
      </div>

      
    </div>
  );
};

export default ProfileMap;
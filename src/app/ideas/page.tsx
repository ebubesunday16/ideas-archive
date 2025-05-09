import { getServerSession } from "next-auth";
import SignedComponent from "../../components/SignedComponent";
import UnSignedComponent from "../../components/UnSignedComponent";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Page() {
  
  const session = await getServerSession(authOptions)

  return (
    <main className="pb-16">

      {session ? (<SignedComponent />) : (<UnSignedComponent />) }
      
    </main>
    
  );
}

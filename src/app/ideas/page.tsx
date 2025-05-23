import { getServerSession } from "next-auth";
import SignedComponent from "../../components/homepageui/SignedComponent";
import UnSignedComponent from "../../components/homepageui/UnSignedComponent";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getSortedFeeds } from "@/lib/feed";

export default async function Page() {
  
  const session = await getServerSession(authOptions)
  const feeds = getSortedFeeds()
  console.log(feeds)

  return (
    <main className="pb-16">

      {session ? (<SignedComponent />) : (<UnSignedComponent />) }
      
    </main>
    
  );
}

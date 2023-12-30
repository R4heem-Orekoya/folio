import Link from "next/link"
import { Text } from "lucide-react"
import { LoginLink, getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import UserAccountNav from "./UserAccountNav"

const Navbar = async() => {
     const { getUser } = getKindeServerSession()
     const user = await getUser()
  return (
     <header className="sticky top-0 bg-white w-full z-50 shadow-sm">
          <div className="w-[min(1400px,90%)] h-20 mx-auto flex justify-between items-center">
               <Link href='/' className="text-2xl font-bold flex items-center gap-2"><Text size={20}/>Folio.</Link>
               
               
               {
               !user ? 
                    <div className="flex gap-4 sm:gap-8 text-lg font-normal text-zinc-600 hover:text-zinc-800">
                         <Link href='/pricing'>Pricing</Link>
                         <LoginLink>Sign In</LoginLink>
                    </div> :
                    <div className="flex items-center gap-6">
                         <Link href='/dashboard' className="text-zinc-600 hover:text-zinc-800 text-lg font-medium">Dashboard</Link>
                         <UserAccountNav email={user.email ?? ''} imageUrl={user.picture ?? ''} name={!user.given_name || !user.family_name ? 'Your Account' : `${user.given_name} ${user.family_name}`}/>
                    </div>
               }
          </div>
     </header>
  )
}

export default Navbar

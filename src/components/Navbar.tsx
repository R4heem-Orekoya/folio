import Link from "next/link"
import { Text } from "lucide-react"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/server"

const Navbar = () => {
  return (
     <header className="sticky top-0 bg-white w-full z-50 shadow-sm">
          <div className="w-[min(1400px,90%)] h-20 mx-auto flex justify-between items-center">
               <Link href='/' className="text-2xl font-bold flex items-center gap-2"><Text size={20}/>Folio.</Link>

               <div className="flex gap-4 sm:gap-8 text-lg font-normal text-zinc-600 hover:text-zinc-800">
                    <Link href='/pricing'>Pricing</Link>
                    <LoginLink>Sign In</LoginLink>
               </div>
          </div>
     </header>
  )
}

export default Navbar

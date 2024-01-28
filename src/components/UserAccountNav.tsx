import { getUserSubscriptionPlan } from "@/lib/paystack"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Gem, LayoutDashboard, LogOut, Zap } from "lucide-react"
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server'

interface UserAccountNavProps {
   email: string,
   imageUrl: string,
   name: string
}

const UserAccountNav = async ({email, imageUrl, name}: UserAccountNavProps) => {
   const subscription = await getUserSubscriptionPlan()
   
   
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild className="overflow-visible">
            <button className="flex items-center gap-2 hover:bg-zinc-100 p-2 rounded-md">
               <Avatar className="relative w-10 h-10">
                  {
                     imageUrl ? (
                        <div className="relative aspect-square w-full">
                           <Image fill src={imageUrl} alt={`${name} profile pic`} referrerPolicy="no-referrer" />
                        </div>
                     ) :
                     <AvatarFallback>
                        <span className="sr-only">{name}</span>
                        <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`} alt="avatar" className="border border-zinc-300 bg-white rounded-full"/>
                     </AvatarFallback>
                  }
               </Avatar>
               <ChevronDown size={18} className="text-zinc-600"/>
            </button>
         </DropdownMenuTrigger>
         
         <DropdownMenuContent className="bg-white" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
               <div className="flex flex-col space-y-0.5 leading-none">
                  {name && <p className="font-medium text-sm text-zinc-800">{name}</p>}
                  {email && (
                     <p className="w-[200px] truncate text-xs text-zinc-600">{email}</p>
                  )}
               </div>
            </div>
            
            <DropdownMenuSeparator />  
            
            <DropdownMenuItem asChild>
               <Link href='/dashboard'><LayoutDashboard size={15} strokeWidth={1.6} className="mr-2"/>Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               {subscription?.isSubscribed ? (
                  <Link href='/dashboard/billing'><Gem size={15} strokeWidth={1.6} className="mr-2"/>See Subscription</Link>
               ) : (
                  <Link href='/pricing'>Go Pro <Zap size={15} strokeWidth={1.6} className="text-blue-500 ml-2"/></Link>
               )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator /> 
            
            <DropdownMenuItem asChild>
               <LogoutLink><LogOut size={15} strokeWidth={1.8} className="mr-2 text-red-500"/>Log out</LogoutLink>
            </DropdownMenuItem>
         </DropdownMenuContent> 
      </DropdownMenu>
   )
}

export default UserAccountNav

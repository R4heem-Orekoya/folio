'use client'

import { useToast } from "./ui/use-toast"
import { trpc } from "@/app/_trpc/client"
import { getUserSubscriptionPlan } from "@/lib/paystack"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "./ui/button"
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types"
import Link from "next/link"

interface PropsTypes {
   subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>,
   user: KindeUser | null
}

const BillingForm = ({subscriptionPlan, user}: PropsTypes) => {
   const {toast} = useToast()
   
   const {mutate: createPaystackSession, isLoading} = trpc.createPaystackSession.useMutation({
      onSuccess: ({url}) => {
         if (url) window.location.href = url
         if(!url) {
            toast({
               title: 'There was a problem...',
               description: 'Try again later.',
               variant: 'destructive'
            })
         }
      }
   })
   
   
   
   return (
      <div className="min-h-[20rem] py-20">
         <form 
            onSubmit={(e) => {
               e.preventDefault()
               createPaystackSession()
            }}>
            <div className="w-[min(500px,100%)] p-4 bg-white rounded-lg border-[1px] border-zinc-200 shadow-md">
               <h2 className="text-xl sm:text-2xl font-semibold text-zinc-800">Subscription Plan</h2>
               <p className="my-2 text-lg text-zinc-500">
                  You&apos;re currently on the 
                  <span className="text-zinc-800 font-semibold">
                     {subscriptionPlan.isSubscribed ? ' Pro ' : ' Free '}
                  </span> 
                  plan.
               </p>
               <div className="mt-8">
                  {
                     user && subscriptionPlan.isSubscribed ? (
                        <p>
                           You will be on the pro plan till:  
                           <span className="font-semibold ml-1">
                              {format(subscriptionPlan.subscriptionEndDate!, 'dd, MM, yyyy')}
                           </span>
                        </p>
                     ) : !user ? (
                        <Link href='/sign-in'>
                           <Button type="button" size='lg'>Login</Button>
                        </Link>
                     ) : (
                        <Button type="submit" size='lg'>Go Pro</Button>
                     )
                  }
               </div>
            </div>
         </form>
      </div>
   )
}

export default BillingForm

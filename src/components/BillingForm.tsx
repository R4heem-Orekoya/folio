'use client'

import { useToast } from "./ui/use-toast"
import { trpc } from "@/app/_trpc/client"
import { getUserSubscriptionPlan } from "@/lib/paystack"
import { AlertCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "./ui/button"
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

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
            <div className="w-[min(650px,100%)] p-4 bg-white rounded-lg border-[1px] border-zinc-200 shadow-md">
               <h2 className="text-xl font-semibold text-zinc-800">Subscription Plan</h2>
               <p className="my-2 text-lg  text-zinc-500">
                  You&apos;re currently on the 
                  <span className="text-zinc-800 font-semibold">
                     {subscriptionPlan.isSubscribed ? ' Pro ' : ' Free '}
                  </span> 
                  plan.
               </p>
               <div className="mt-8 p-0 flex items-center gap-4 flex-wrap">
                  {user && subscriptionPlan.isSubscribed ? (
                     <>
                        {!subscriptionPlan.isCancelled && (
                           <Button type='submit' size='lg' disabled={isLoading}>
                              {isLoading && (<Loader2 className="animate-spin mr-4" size={15}/>)}
                              Cancel Subscription
                           </Button>
                        )}
                        <p className="text-sm">
                           {subscriptionPlan.isCancelled ? 'Your subscription will cancel on' : 'Your subscription will renew automatically on'}
                           <span className="font-semibold ml-1">
                              {format(subscriptionPlan.subscriptionEndDate!, 'dd, MM, yyyy')}
                           </span>
                        </p>
                     </>
                  ): (
                     <Button type='submit' size='lg' className="text-lg disabled:cursor-not-allowed" disabled={isLoading}>
                        {isLoading && (<Loader2 className="animate-spin mr-4" size={15}/>)}
                        Go Pro
                     </Button>
                  )}
                  
                  {!user && (
                     <Link href='/sign-in'>
                        <Button type="button" size='lg'>Login</Button>
                     </Link>
                  )}
               </div>
            </div>
         </form>
         
         <div className="mt-20 max-w-lg ml-auto">
            <Alert>
               <AlertTitle className="flex items-center gap-2"><AlertCircle className="w-4 aspect-square "/> Attention</AlertTitle>
               <AlertDescription className="ml-6">
                  Your card will be <strong>charged</strong> automatically next month. 
                  If you don't want this to happen click on the 'cancel subscription button'.
               </AlertDescription>
            </Alert>
         </div>
      </div>
   )
}

export default BillingForm

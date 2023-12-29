'use client'

import { getUserSubscriptionPlan } from "@/lib/stripe"
import { useToast } from "./ui/use-toast"
import { trpc } from "@/app/_trpc/client"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

interface BillingFormProps {
subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const BillingForm = ({subscriptionPlan}: BillingFormProps) => {
   const {toast} = useToast()
   
   const {mutate: createStripeSession, isLoading} = trpc.createStripeSession.useMutation({
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
         <div className="w-[min(500px,100%)] p-4 bg-white rounded-lg border-[1px] border-zinc-200 shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-800">Subscription Plan</h2>
            <p className="my-2 text-lg text-zinc-500">You're currently on the <span className="text-zinc-800 font-semibold">{subscriptionPlan.name}</span> plan.</p>
            
            <div className="flex justify-between items-center gap-4 mt-10">
               <button className="px-8 py-3 bg-zinc-800 text-white text-lg font-medium rounded-lg duration-300 hover:bg-zinc-700">
                  {
                     isLoading ? (
                        <Loader2 size={15} className="text-zinc-800 animate-spin"/>
                     ) : null
                  }
                  
                  {
                     subscriptionPlan.isSubscribed ? 'Manage Subscription' : 'Go Pro'
                  }
               </button>
               
               {
                  subscriptionPlan.isSubscribed ? (
                     <p className="">
                        {
                           subscriptionPlan.isCanceled ? 
                           'Your plan will be canceled on ' :
                           'Your plan will be renewed on'
                        }
                        {format(subscriptionPlan.stripeCurrentPeriodEnd!, 'dd.mm.yyyy')}
                     </p>
                  ) : null
               }
            </div>
         </div>
      </div>
   )
}

export default BillingForm

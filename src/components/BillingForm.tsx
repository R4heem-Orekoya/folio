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
   
   console.log(subscriptionPlan.isCanceled);
   
   
   return (
      <div className="min-h-[20rem] py-20">
         <form 
            onSubmit={(e) => {
               e.preventDefault()
               createStripeSession()
            }}>
            <div className="w-[min(650px,100%)] p-4 bg-white rounded-lg border-[1px] border-zinc-200 shadow-md">
               <h2 className="text-xl sm:text-2xl font-semibold text-zinc-800">Subscription Plan</h2>
               <p className="my-2 text-lg text-zinc-500">You&apos;re currently on the <span className="text-zinc-800 font-semibold">{subscriptionPlan.name}</span> plan.</p>
               
               <div className="flex justify-between items-center flex-wrap gap-4 mt-10">
                  <button className="flex items-center gap-2 px-8 py-3 bg-zinc-800 text-white sm:text-lg font-medium rounded-lg duration-300 hover:bg-zinc-700">
                     {
                        isLoading ? (
                           <Loader2 size={15} className="text-white animate-spin"/>
                        ) : null
                     }
                     
                     {
                        subscriptionPlan.isSubscribed ? 'Manage Subscription' : 'Go Pro'
                     }
                  </button>
                  
                  {
                     subscriptionPlan.isSubscribed ? (
                        <p>
                           {
                              subscriptionPlan.isCanceled ? 
                              'Your plan will be canceled on ' :
                              'Your plan will be renewed on '
                           }
                           <span className="font-semibold">
                              {format(subscriptionPlan.stripeCurrentPeriodEnd!, 'dd.mm.yyyy')}
                           </span>
                        </p>
                     ) : null
                  }
               </div>
            </div>
         </form>
      </div>
   )
}

export default BillingForm

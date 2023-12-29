'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client"
import { Loader2 } from "lucide-react"

const Page = () => {
   const router = useRouter()
   
   const searchParams = useSearchParams()
   const origin = searchParams.get('origin')
   
   trpc.authCallback.useQuery(undefined, {
      onSuccess({success}) {
         if(success) {
            //user is synced to db
            router.push(origin ? `${origin}`: '/dashboard')
         }
      },
      onError: (err) => {
         if(err.data?.code === 'UNAUTHORIZED'){
            router.push('/sign-in')
         }
      },
      retry: true,
      retryDelay: 500
   })
   
   return (
      <div className="mt-20 flex justify-center items-center p-4">
         <div className="flex flex-col items-center gap-3">
            <Loader2 size={50} className="text-zinc-500 animate-spin"/>
            <h3 className="text-xl text-center font-medium">Preparing your account...</h3>
         </div>
      </div>
   )
}

export default Page
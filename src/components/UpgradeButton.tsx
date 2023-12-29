'use client'

import { trpc } from "@/app/_trpc/client"


const UpgradeButton = () => {
  
  const {mutate: createStripeSession} = trpc.createStripeSession.useMutation({
    onSuccess: ({url}) => {
      window.location.href = url ?? "/dashboard/billing"
    }
  })
  
  return (
    <button onClick={() => createStripeSession()} className="w-full py-3 bg-white text-zinc-900 text-lg font-semibold rounded-md hover:opacity-90">
      Go Pro
    </button>
  )
}

export default UpgradeButton

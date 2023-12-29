import UpgradeButton from "@/components/UpgradeButton"
import { PLANS } from "@/config/stripe"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { text } from "node:stream/consumers"

const pricingItems = [
  {
    plan: 'Free',
    tagline: 'For small sized PDFs.',
    quota: 10,
    features: [
      {
        text: '5 pages per PDF',
      },
      {
        text: '4MB file size limit',
      },
      {
        text: 'Mobile-friendly interface',
      },
    ],
  },
  {
    plan: 'Pro',
    tagline: 'For large sized PDFs with higher needs.',
    // quota: PLANS.find((p) => p.slug === 'pro')!.quota,
    features: [
      {
        text: '25 pages per PDF',
      },
      {
        text: '16MB file size limit',
      },
      {
        text: 'Mobile-friendly interface',
      },
      {
        text: 'Higher-quality responses',
      },
      {
        text: 'Priority support',
      },
    ],
  },
]


const page = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  
  return (
    <div className="text-center py-20 min-h-[calc(100vh-80px)]">
      <h3 className="text-2xl md:text-4xl font-semibold text-zinc-800">Pricing</h3>
      <p className="text-sm sm:text-lg font-medium mt-4 text-zinc-600">Whether you're just trying out our sevice or need more. We've got you covered.</p>
      
      <div className="w-[min(800px,100%)] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mt-8 sm:mt-16">
        {pricingItems.map((pricingItem) => {
          const price = PLANS.find((p) => p.slug === pricingItem.plan.toLocaleLowerCase())?.price.amount || 0
          return (
            <div key={pricingItem.plan} className={`flex flex-col justify-between col-span-1 rounded-lg border-2 p-6 text-left border-zinc-800 ${pricingItem.plan === 'Pro' ? 'bg-zinc-900 text-white' : 'text-zinc-800'}`}>
              <div>
                <h4 className="text-xl font-semibold">{pricingItem.plan}</h4>
                <p className={`text-sm my-4 ${pricingItem.plan === 'Pro' ? 'text-slate-300' : 'text-zinc-600'}`}>{pricingItem.tagline}</p>
                <p className='text-5xl my-6 font-semibold'>
                  ${price}
                  <span className={`text-sm ml-2 font-thin text-zinc-400 ${pricingItem.plan === 'Pro' ? 'text-slate-300' : 'text-zinc-600'}`}>/ month</span>
                </p> 
              </div>
                        
              <ul className="mt-10">
                {pricingItem.features.map(({ text }) => (
                  <li key={text} className='flex gap-2 items-center mb-2 text-lg'><CheckCircle2 size={15} strokeWidth={1.5} strokeOpacity={0.8} className="text-green-500"/>{text}</li>
                ))}
              </ul>
              
              <div className="mt-5">
                {
                  pricingItem.plan === 'Free' ? (
                    <Link href={user ? '/dashboard' : '/sign-in'} >
                      <button className="bg-zinc-900 text-white mt-4 w-full py-3 text-lg font-semibold rounded-md hover:opacity-90">
                      {user ? 'Go Pro' : 'Sign up'}
                      </button>
                    </Link>
                  ) : user ? (
                    <UpgradeButton />
                  ) : (
                    <Link href='/sign-in'> 
                      <button className="bg-zinc-900 text-white mt-4 w-full py-3 text-lg font-semibold rounded-md hover:opacity-90">
                        {user ? 'Go Pro' : 'Sign up'}
                      </button>
                    </Link>
                  )
                }
              </div>
            </div> 
          )
        })}
      </div>
    </div>
  )
}

export default page 

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import Dashboard from "@/components/Dashboard"
import { getUserSubscriptionPlan } from "@/lib/paystack"

const Page = async () => {
   const { getUser } = getKindeServerSession()
   const user = await getUser()
   console.log(user?.given_name);
   
   if(!user || !user.id) redirect('/auth-callback?origin=dashboard')
   
   const dbUser = await db.user.findFirst({
      where: {
         id: user.id
      }
   })
   
   if(!dbUser) redirect('/auth-callback?origin=dashboard')
   
   const subscriptionPlan = await getUserSubscriptionPlan()
   
   return <Dashboard subscriptionPlan={subscriptionPlan}/>
}


export default Page
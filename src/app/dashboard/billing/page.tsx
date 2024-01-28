import BillingForm from "@/components/BillingForm"
import { getUserSubscriptionPlan } from "@/lib/paystack"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

const Page = async () => {
   const subscriptionPlan = await getUserSubscriptionPlan()
   const { getUser } = getKindeServerSession()
   const user = await getUser()
   
   
   return (
      <BillingForm user={user} subscriptionPlan={subscriptionPlan}/>
   )
}

export default Page
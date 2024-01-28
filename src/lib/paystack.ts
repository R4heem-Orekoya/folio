import { PLANS } from '@/config/paystack'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {Paystack} from 'paystack-sdk';

export const paystack = new Paystack(process.env.PAYSTACK_API_KEY ?? '')

export const getUserSubscriptionPlan = async () => {
   const { getUser } = getKindeServerSession()
   const user = await getUser()
   

   
   if(!user?.id) {
      return {
         ...PLANS[0],
         isSubscribed: false,
         subscriptionId: null,
         subscriptionEndDate: null,
      }
   }
   
   const dbUser = await db.user.findFirst({
      where: {
        id: user?.id,
      },
   })
   
   if (!dbUser) {
      return {
        ...PLANS[0],
        isSubscribed: false,
        subscriptionId: null,
        subscriptionEndDate: null,
      }
   }
   
   const isSubscribed = Boolean(
      dbUser.paystackCustomerId &&
      dbUser.paystackSubscriptionStartDate && 
      dbUser.paystackSubscriptionStartDate.getTime() > Date.now()
   )
   
   const plan = isSubscribed ? PLANS[1] : null
   
   return {
      ...plan,
      subscriptionId: dbUser.paystackCustomerId,
      subscriptionEndDate: dbUser.paystackSubscriptionStartDate,
      isSubscribed,
   }
}
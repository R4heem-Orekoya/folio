import { db } from '@/db'
import { headers } from 'next/headers'
import { createHmac } from 'crypto'

export async function POST(request) {
   const secret = process.env.PAYSTACK_API_KEY;
   const hash = createHmac('sha512', secret).update(JSON.stringify(request.body)).digest('hex')
   const signature = headers().get('x-paystack-signature') ?? ''
   
   
   if(hash === signature){
      const webhook = request.body
      
      if(webhook.event === 'charge.success'){
         const startDate = new Date(webhook.data.paid_at || '')
         startDate.setDate(startDate.getDate() + 31)
         const endDate = startDate.toISOString()
         
         await db.user.update({
            where: {
               id: webhook.data?.customer.email
            },
            data:{
               paystackCardToken: webhook.data?.authorization.authorization_code,
               paystackCustomerId: webhook.data?.customer.customer_code,
               paystackSubscriptionStartDate: endDate
            }
         })
      }
      
      return new Response(null, { status: 200 })
   }
}
import { db } from '@/db'
import { headers } from 'next/headers'
import { createHmac } from 'crypto'
import type Paystack from 'paystack'

export async function POST(request: Request) {
   const secret = process.env.PAYSTACK_API_KEY ?? '';
   const hash = createHmac('sha512', secret).update(JSON.stringify(request.body)).digest('hex')
   const signature = headers().get('x-paystack-signature') ?? ''
   let webhook = await request.json()
   
   
   if(hash === signature){
      if(!webhook) return new Response('no webhook received', {status: 404})
      
      
      // switch (webhook.event) {
      //    case 'subscription.create': 
            
      //    case 'charge.success': // Sent when a subscription payment is made successfully
      //    case 'invoice.create': // Sent when an invoice is created to capture an upcoming subscription charge. Should happen 2-3 days before the charge happens
      //    case 'invoice.payment_failed': // Sent when a subscription payment fails
      //    case 'subscription.not_renew': // Sent when a subscription is canceled to indicate that it won't be charged on the next payment date
      //    case 'subscription.disable': // Sent when a canceled subscription reaches the end of the subscription period
      //    case 'subscription.expiring_cards': // Sent at the beginning of each month with info on what cards are expiring that month
      // }
      
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
   }
   
   return new Response(null, { status: 200 })
}
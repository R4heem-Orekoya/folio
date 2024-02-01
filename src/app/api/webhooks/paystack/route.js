import { db } from '@/db'
import { createHmac } from 'crypto'

export async function POST(request) {
   console.log(request);
   const secret = process.env.PAYSTACK_API_KEY;
   
   // Validate request body content type
   if (request.headers.get('content-type') !== 'application/json') {
      return new Response('Invalid content type', { status: 400 });
   }
   
   // Fetch and parse request body
   const webhook = await request.json();

   const hash = createHmac('sha512', secret).update(JSON.stringify(webhook)).digest('hex');
   
   if(hash !== request.headers.get('x-paystack-signature')) {
      return new Response('Unauthorized', { status: 401 });
   }

   if (webhook?.event === 'subscription.create') {
      try {
         await db.user.update({
            where: {
               id: webhook.data?.customer.email
            },
            data: {
               paystackCardToken: webhook.data.authorization.authorization_code,
               paystackCustomerId: webhook.data.customer.customer_code,
               paystackSubscriptionCode: webhook.data.subscription_code,
               paystackSubscriptionStartDate: webhook.data.next_payment_date
            }
         });
         
         // Respond with success
         return new Response(null, { status: 200 });
      } catch (error) {
         console.error("Error updating database:", error);
         // Respond with error
         return new Response("Internal Server Error", { status: 500 });
      }
   } else if (webhook.event === 'invoice.update') {
      try {
         await db.user.update({
            where: {
               id: webhook.data?.customer.email
            },
            data: {
               paystackSubscriptionStartDate: webhook.data.subscription.next_payment_date
            }
         });
         
         // Respond with success
         return new Response(null, { status: 200 });
      } catch (error) {
         console.error("Error updating database:", error);
         // Respond with error
         return new Response("Internal Server Error", { status: 500 });
      }
   } else {
      // Respond with success for non-'subscription.create' events
      return new Response(null, { status: 200 });
   }
}


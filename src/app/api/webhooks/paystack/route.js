import { db } from '@/db'
// import { createHmac } from 'crypto'
const crypto = require('crypto');

export async function POST(request) {
   const secret = process.env.PAYSTACK_API_KEY;
   const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(request.body)).digest('hex');

   if (hash == request.headers.get('x-paystack-signature')){
      const webhook = request.body;
      console.log(webhook);

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
   } else {
      // Respond with unauthorized if signature doesn't match
      return new Response("Unauthorized", { status: 401 });
   }
}


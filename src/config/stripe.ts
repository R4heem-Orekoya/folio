export const PLANS = [
   {
      name: 'Free',
      slug: 'free',
      quota: 10,
      pagesPerPdf: 10,
      price: {
         amount: 0,
         priceIds: {
            test: '',
            production: ''
         }
      }
   },
   {
      name: 'Pro',
      slug: 'pro',
      quota: 50,
      pagesPerPdf: 30,
      price: {
         amount: 5,
         priceIds: {
            test: 'price_1OS8MhFmkNj2NFr71FdDHP8P',
            production: ''
         }
      }
   },
]
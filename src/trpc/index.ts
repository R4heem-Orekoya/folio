import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptionPlan, paystack } from '@/lib/paystack';
import { utapi } from '@/app/api/uploadthing/route';

export const appRouter = router({
   authCallback: publicProcedure.query(async () => {
      const {getUser} = getKindeServerSession()
      const user = await getUser()
      
      if(!user?.id || !user?.email) throw new TRPCError({code: 'UNAUTHORIZED'})
      
      //checking if the user is in the database
      const dbUser = await db.user.findFirst({
         where: {
            id: user.id
         }
      })
      
      if(!dbUser) {
         //add user to db
         await db.user.create({
            data: {
               id: user.id,
               email: user.email
            }
         })
      }
      
      return {success: true}
   }),
   
   getFileUploadStatus: privateProcedure.input(z.object({fileId: z.string()})).query(async ({input, ctx}) => {
      const file = await db.file.findFirst({
         where: {
            id: input.fileId,
            userId: ctx.userId
         }
      })
      
      if(!file) return {status: 'PENDING' as const }
      
      return {status: file.uploadStatus}
   }),
   
   getFile: privateProcedure.input(z.object({key: z.string()})).mutation(async ({ctx, input}) => {
      const {userId} = ctx
      
      const file = await db.file.findFirst({
         where: {
            key: input.key,
            userId
         },
      })
      
      if(!file) throw new TRPCError({code: 'NOT_FOUND'})
      
      return file
   }),
   
   getUserFiles: privateProcedure.query(async ({ctx}) => {
      const {userId} = ctx 
      
      return await db.file.findMany({
         where: {
            userId
         }
      })
   }),
   
   createPaystackSession: privateProcedure.mutation(async ({ctx}) => {
      const { userId } = ctx
      
      const billingURL = absoluteUrl('/dashboard/billing')
      
      if(!userId) throw new TRPCError({code: 'UNAUTHORIZED'})
      
      const dbUser = await db.user.findFirst({
         where: {
            id: userId
         }
      })
      
      if(!dbUser) throw new TRPCError({code: 'UNAUTHORIZED'})
      
      const subscriptionPlan = await getUserSubscriptionPlan()
      
      if (subscriptionPlan.isSubscribed && dbUser.paystackSubscriptionCode) {
         const paystackSession:any = await paystack.subscription.generateSubscriptionLink(dbUser.paystackSubscriptionCode)
         
         
         return { url: paystackSession.data?.link }
      }
      
      const paystackSession = await paystack.transaction.initialize({
         email: dbUser.email,
         amount: "200000",
         plan: 'PLN_419xg675mxryafw',
         channels: ['card'],
         callback_url: billingURL
      })
         
      if(paystackSession.status === false){
         throw new Error('Something Went Wrong')
      }
      
      return {url: paystackSession.data?.authorization_url}
   }),
   
   getFileMessages: privateProcedure.input(
      z.object({
         limit: z.number().min(1).max(100).nullish(),
         cursor: z.string().nullish(),
         fileId: z.string()
      })
   ).query(async ({ctx, input}) => {
      const { userId } = ctx
      const { fileId, cursor } = input
      const limit = input.limit ?? INFINITE_QUERY_LIMIT
      
      const file = await db.file.findFirst({
         where: {
            id: fileId,
            userId
         }
      })
      
      if(!file) throw new TRPCError({
         code: 'NOT_FOUND'
      })
      
      const messages = await db.message.findMany({
         take: limit + 1,
         where: {
            fileId
         },
         orderBy: {
            createdAt: 'desc'
         },
         cursor: cursor ? {id: cursor} : undefined,
         select: {
            id: true,
            isUserMessage: true,
            createdAt: true,
            text: true
         }
      })
      
      let nextCursor: typeof cursor | undefined = undefined
      if(messages.length > limit) {
         const nextItem = messages.pop()
         nextCursor = nextItem?.id
      }
      
      return {
         messages,
         nextCursor   
      }
   }),
   
   deleteFile: privateProcedure.input(z.object({id: z.string()})).mutation(async ({ctx, input}) => {
      const { userId } = ctx
      
      const file = await db.file.findFirst({
         where: {
            id: input.id,
            userId
         }
      })
      
      if(!file) throw new TRPCError({code: 'NOT_FOUND'})
      
      await db.file.delete({
         where: {
            id: input.id
         }
      })
      
      await utapi.deleteFiles(file.key);
      
      return file
   })
});

export type AppRouter = typeof appRouter;
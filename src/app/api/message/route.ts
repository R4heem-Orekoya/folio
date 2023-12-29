import { db } from "@/db";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { sendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest } from "next/server";

import { OpenAIStream, StreamingTextResponse } from 'ai';

export const POST = async (req: NextRequest) => {
   const body = await req.json()
   
   const { getUser } = getKindeServerSession()
   const user = await getUser()
   
   const userId = user?.id
   
   if (!userId) return new Response('Unauthorized', { status: 401 })
   
   const { fileId, message } = sendMessageValidator.parse(body)
   
   const file = await db.file.findFirst({
      where: {
         id: fileId,
         userId: userId
      }
   })
   
   if(!file) return new Response('Not found', { status: 404 })
   
   await db.message.create({
      data: {
         text: message,
         isUserMessage: true,
         userId,
         fileId,
      }
   })
   
   const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
   })
   
   const pineconeIndex = pinecone.Index('folio')
   
   const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id
   })
   
   const results = await vectorStore.similaritySearch(message, 4)
   
   const prevMessages = await db.message.findMany({
      where: {
         fileId
      },
      orderBy: {
         createdAt: 'asc'
      },
      take: 6
   })
   
   const formattedMessages = prevMessages.map((msg) => {
      return {
         role: msg.isUserMessage ? 'user' as const : 'assistant' as const,
         content: msg.text
      }
   })
   
   const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      stream: true,
      messages: [
         {
            role: 'system',
            content:
               'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
         },
         {
            role: 'user',
            content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
            
            \n----------------\n
            
            PREVIOUS CONVERSATION:
            ${formattedMessages.map((message) => {
               if (message.role === 'user')
                  return `User: ${message.content}\n`
               return `Assistant: ${message.content}\n`
            })}
      
            \n----------------\n
            
            CONTEXT:
            ${results.map((r) => r.pageContent).join('\n\n')}
            
            USER INPUT: ${message}`,
         },
      ],
   })
   
   const stream = OpenAIStream(response, {
      async onCompletion(completion) {
         await db.message.create({
            data: {
               text: completion,
               isUserMessage: false,
               fileId,
               userId
            }
         })
      },
   })
   
   return new StreamingTextResponse(stream)
}
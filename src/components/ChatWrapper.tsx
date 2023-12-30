'use client'

import Messages from "./chat/Messages"
import ChatInput from "./chat/ChatInput"
import { trpc } from "@/app/_trpc/client"
import { ArrowUpRight, Loader2, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { ChatContextProvider } from "./chat/ChatContext"

interface ChatWrapperProps {
  fileId: string
}

const ChatWrapper = ({fileId}: ChatWrapperProps) => {
  const { data , isLoading } = trpc.getFileUploadStatus.useQuery({
    fileId,
  }, { 
    refetchInterval: (data) => data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500
  })
  
  if(isLoading) {
    return (
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex justify-center items-center flex-col my-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={30} strokeWidth={2} className="text-zinc-800 animate-spin"/>
            <h3 className="font-medium text-center text-lg text-zinc-800 ">Loading...</h3>
          </div>
        </div>
                  
        <ChatInput isDisabled/>
      </div>
    )
  }
  
  if(data?.status === 'PROCESSING') {
    return (
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex justify-center items-center flex-col my-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={30} strokeWidth={2} className="text-zinc-800 animate-spin"/>
            <h3 className="font-medium text-center text-lg text-zinc-800 ">Processing PDF...</h3>
          </div>
        </div>
                  
        <ChatInput isDisabled/>
      </div>
    )
  }
  
  if(data?.status === 'FAILED') {
    return (
      <div className="relative min-h-full bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex justify-center items-center flex-col my-28">
          <div className="flex flex-col items-center gap-2">
            <ShieldAlert size={30} strokeWidth={2} className="text-red-500"/>
            <h3 className="font-medium text-center text-lg text-zinc-800 ">Too many pages in PDF</h3>
            <span className="mt-4">
              <Link href='/pricing' className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md">
                Pricing
                <ArrowUpRight size={15}/>
              </Link>
            </span>
          </div>
        </div>
                  
        <ChatInput isDisabled/>
      </div>
    )
  }
  
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="bg-zinc-50 relative min-h-full p-4 flex flex-col justify-between gap-2 divide-y divide-zinc-200 border-zinc-200 lg:border-[1px] rounded-lg">
        <div className="flex-1 justify-between flex flex-col mb-20">
          <Messages fileId={fileId}/>
        </div>
        
        <ChatInput />
      </div>
    </ChatContextProvider>
  )
}

export default ChatWrapper

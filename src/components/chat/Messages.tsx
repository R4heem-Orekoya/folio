import { trpc } from "@/app/_trpc/client"
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query"
import { Loader2, MessagesSquare } from "lucide-react"
import Message from "./Message"
import Skeleton from "react-loading-skeleton"
import { useContext, useEffect, useRef } from "react"
import { ChatContext } from "./ChatContext"
import { useIntersection } from '@mantine/hooks'

interface MessageProps {
  fileId: string
}

const Messages = ({fileId}: MessageProps) => {
  const { isLoading: isBotThinking } = useContext(ChatContext) 
  
  const { data, isLoading, fetchNextPage } = trpc.getFileMessages.useInfiniteQuery({
    fileId,
    limit: INFINITE_QUERY_LIMIT
  }, {
    getNextPageParam: (lastpage) => lastpage?.nextCursor,
    keepPreviousData: true
  }) 
  
  const messages = data?.pages.flatMap((page) => page.messages)
  
  const loadingMessage = {
    id: 'loading-message',
    createdAt: new Date().toISOString(),
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 size={20} className="text-zinc-800 animate-spin"/>
      </span>
    ),
    isUserMessage: false,
  }
  
  const combinedMessages = [
    ...(isBotThinking ? [loadingMessage] : []),
    ...(messages ?? [])
  ]
  
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1
  })
  
  useEffect(() => {
    if(entry?.isIntersecting){
      fetchNextPage()
    }
  }, [entry, fetchNextPage])
  
  return (
    <div className="flex max-h-[calc(100vh-15rem)] border rounded-sm border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-w-2 scrollbar-track-zinc-lighter scrollbar-thumb-zinc scrollbar-thumb-rounded">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson = combinedMessages[i - 1]?.isUserMessage === combinedMessages[i].isUserMessage
          
          if(i === combinedMessages.length - 1){
            return <Message ref={ref} key={message.id} message={message} isNextMessageSamePerson={isNextMessageSamePerson}/>
          }else{
            return (<Message key={message.id} message={message} isNextMessageSamePerson={isNextMessageSamePerson}/>)
          }
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16"/>
          <Skeleton className="h-16"/>
          <Skeleton className="h-16"/>
          <Skeleton className="h-16"/>
          <Skeleton className="h-16"/>
          <Skeleton className="h-16"/>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessagesSquare size={40} strokeWidth={2} className="text-zinc-700"/>
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p>Ask your first question to get started.</p>
        </div>
      )}
    </div>
  )
}

export default Messages

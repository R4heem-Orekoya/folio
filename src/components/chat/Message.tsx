import { ExtendedMessage } from "@/types/message"
import { format } from "date-fns"
import { Bot, BrainCircuit, User } from "lucide-react"
import { forwardRef } from "react"
import ReactMarkdown from 'react-markdown'

interface MessageProps {
   message: ExtendedMessage,
   isNextMessageSamePerson: boolean
}

const Message = forwardRef<HTMLDivElement, MessageProps>(({ message, isNextMessageSamePerson }, ref) => {
   return (
      <div ref={ref} className={`flex gap-2 items-end ${message.isUserMessage ? 'justify-end' : ''}`}>
         <div className={`max-sm:hidden relative h-8 aspect-square grid place-items-center rounded-sm ${message.isUserMessage ? 'order-2 bg-zinc-800 ' : 'bg-zinc-100'} ${isNextMessageSamePerson ? 'invisible' : ''}`}>
            {
               message.isUserMessage ? <User size={18} className="text-white" /> : <Bot size={18} className="text-zinc-800" />
            }
         </div>
         <div className={`flex flex-col space-y-2 ${message.isUserMessage ? 'order-1 items-end' : 'order-2 items-start'} text-sm max-w-xs`}>
            <div className={`px-4 py-2 rounded-lg ${!isNextMessageSamePerson && message.isUserMessage ? 'rounded-br-none' : ''} ${message.isUserMessage ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-800'} ${!isNextMessageSamePerson && !message.isUserMessage ? 'rounded-bl-none' : ''}`}>
               {typeof message.text === 'string' ? (
                  <ReactMarkdown className={`prose text-sm ${message.isUserMessage ? 'text-white' : ''}`}>
                     {message.text}
                  </ReactMarkdown>
               ) : message.text}

               {message.id !== 'loading-message' ? (
                  <div className={`text-xs select-none mt-2 w-full text-right`}>
                     {format(new Date(message.createdAt), 'HH:mm')}
                  </div>
               ) : null}
            </div>
         </div>
      </div>
   )
})

Message.displayName = 'Message'

export default Message
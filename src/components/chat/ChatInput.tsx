import { SendHorizonal } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { ChatContext } from "./ChatContext"
import react, { useContext, useRef } from "react"

interface ChatInputProps {
  isDisabled?: boolean
}


const ChatInput = ({isDisabled} : ChatInputProps) => {
  const { addMessage, handleInputChange, isLoading, message} = useContext(ChatContext)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="flex gap-4">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea rows={1}
                disabled={isDisabled}
                ref={textAreaRef}
                onChange={handleInputChange}
                value={message}
                maxRows={4} autoFocus 
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && !e.shiftKey){
                    e.preventDefault()
                    addMessage()
                    textAreaRef.current?.focus()
                  }
                }}
                placeholder="Ask your question..." 
                className="pr-12 scrollbar-thumb-zinc scrollbar-thumb-rounded scrollbar-track-zinc-lighter scrollbar-w-2 scrolling-touch"
              />
              
              <button 
                disabled={isDisabled || isLoading} 
                type="submit"
                onClick={() => {
                  addMessage()
                  textAreaRef.current?.focus()
                }}
                className="absolute top-[50%] translate-y-[-50%] right-[0.3rem] grid place-items-center h-[2.2rem] aspect-square bg-zinc-800 hover:bg-zinc-950 transition duration-300 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed">
                <SendHorizonal size={18} strokeWidth={2} className="text-white"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput

'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"

import Dropzone from 'react-dropzone'
import { FileText, FileUp, Loader2 } from "lucide-react"
import { Progress } from "./ui/progress"
import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "./ui/use-toast"
import { trpc } from "@/app/_trpc/client"
import { useRouter } from "next/navigation"

const UploadDropZone = ({ isSubscribed } : { isSubscribed : boolean}) => {
   const router = useRouter()
   
   const [isUploading, setIsUploading] = useState(false)
   const [upLoadingProgress, setUpLoadingProgress] = useState(0)
   
   const { startUpload } = useUploadThing(
      isSubscribed ? 'proPlanUploader' : 'freePlanUploader'
   )
   const {mutate: startPolling} = trpc.getFile.useMutation({
      onSuccess: (file) => {
         router.push(`/dashboard/${file.id}`)
      },
      retry: true,
      retryDelay: 500
   })
   const {toast} = useToast()
   
   const startSimulatingProgress = () => {
      setUpLoadingProgress(0)
      
      const interval = setInterval(() => {
         setUpLoadingProgress((prev): number => {
            if(prev >= 95){
               clearInterval(interval)
               return prev
            }
            return prev + 15
         })
      }, 500)
      
      return interval
   }
   
   return (
      <Dropzone multiple={false} onDrop={async (acceptedFiles) => {
         setIsUploading(true)
         
         const progressInterval = startSimulatingProgress()
         
         const res = await startUpload(acceptedFiles)
         
         if(!res) {
            return toast({
               title: 'Uh oh! Something went wrong.',
               description: 'There was a problem with your request. Try again later 😓',
               variant: 'destructive'
            })
         }
         
         const [fileResponse] = res
         const key = fileResponse?.key
         
         if(!key) {
            return toast({
               title: 'Uh oh! Something went wrong.',
               description: 'There was a problem with your request. Try again later 😓',
               variant: 'destructive'
            })
         }
         
         clearInterval(progressInterval)
         setUpLoadingProgress(100)
         
         startPolling({ key })
      }}>
         {({ getRootProps, getInputProps, acceptedFiles}) => (
            <div {...getRootProps()} className="border-[1.5px] border-dashed border-zinc-400 rounded-lg h-64 mt-4">
               <div className="flex items-center justify-center h-full w-full">
                  <label htmlFor="dropzone" className="flex flex-col items-center justify-center gap-4 w-full h-full rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 p-4">
                     <div className="flex flex-col items-center justify-center">
                        <FileUp size={30} strokeWidth={1.2} className="stroke-zinc-600"/>
                        <p className="my-2 text-zinc-700 text-center">Click to upload or <span className="text-zinc-500">drop file here</span></p>
                        <p className="text-zinc-400">PDF (up to {isSubscribed ? '16MB' : '4MB'})</p>
                     </div>
                     
                     {acceptedFiles && acceptedFiles[0] && (
                        <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline-1 outline-zinc-200 divide-x divide-zinc-200">
                           <div className="px-3 py-2 text-emerald-300">
                              <FileText size={18} strokeWidth={1.4}/>
                           </div>
                           <div className="px-3 truncate text-sm">
                              {acceptedFiles[0].name}
                           </div>
                        </div>
                     )}
                     
                     {isUploading && (
                        <div className="w-full max-w-xs">
                           <Progress indicatorColor={
                              upLoadingProgress === 100 ? 'bg-emerald-400' : ''
                           } value={upLoadingProgress} className="h-[4px] w-full rounded-full bg-white border border-zinc-200/60"/>
                           {upLoadingProgress === 100 && (
                              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-zinc-600">
                                 <Loader2 size={15} className='animate-spin'/>
                                 Redirecting...
                              </div>
                           )}
                        </div>
                     )}
                     
                     {/* <input {...getInputProps()} type="file" id="dropzone" className="hidden"/> */}
                  </label>
               </div>
            </div>
         )}
      </Dropzone>
   )
}

const UploadButton = ({isSubscribed} : {isSubscribed: boolean}) => {
   const [isOpen, setIsOpen] = useState(false)
   
   return (
      <Dialog open={isOpen} onOpenChange={(e) => {
         if(!e){
            setIsOpen(e)
         }
      }}>
         <DialogTrigger onClick={() => setIsOpen(true)} asChild>
            <button className="px-8 py-4 sm:text-lg rounded-lg bg-zinc-800 hover:bg-zinc-700 duration-300 text-white">Upload PDF</button>
         </DialogTrigger>
         
         <DialogContent>
            <UploadDropZone isSubscribed={isSubscribed}/>
         </DialogContent>
      </Dialog>
   )
}

export default UploadButton
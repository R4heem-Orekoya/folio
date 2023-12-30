'use client'

import { trpc } from "@/app/_trpc/client"
import UploadButton from "./UploadButton"
import Empty from "./Empty"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import Link from "next/link"
import { FileText, Loader2, Plus, Trash2 } from "lucide-react"
import { format } from 'date-fns'
import { useState } from "react"
import { getUserSubscriptionPlan } from "@/lib/stripe"

interface PageProps {
   subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const Dashboard = ({subscriptionPlan}: PageProps) => {
   const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<String | null>(null)
   
   const utils = trpc.useUtils()
   const {data: files, isLoading} = trpc.getUserFiles.useQuery()
   const { mutate: deleteFile }  = trpc.deleteFile.useMutation({
      onSuccess: () => {
         utils.getUserFiles.invalidate()
      },
      onMutate({id}) {
         setCurrentlyDeletingFile(id)
      },
      onSettled() {
         setCurrentlyDeletingFile(null)
      }
   })
   
   
   return (
      <div className="py-10">
         <div className="flex flex-wrap justify-between items-center gap-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-zinc-800">Your Files</h2>
            <UploadButton isSubscribed={subscriptionPlan.isSubscribed}/>
         </div>
         
         <div className="mt-10">
            {files && files.length !== 0 ? (
               <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((file) => (
                     <li key={file.id} className="col-span-1 rounded-lg border-[1px] hover:border-zinc-400 bg-zinc-50 p-5">
                        <Link href={`/dashboard/${file.id}`}>
                           <div className="flex gap-4 items-center">
                              <div className="w-12 aspect-square rounded-full bg-zinc-200 grid place-items-center">
                                 <FileText size={23} strokeWidth={1.8} className="text-zinc-600"/>
                              </div>
                              <h3 className="flex-1 truncate text-lg">{file.name}</h3>
                           </div>
                        </Link>
                        
                        <div className="pt-6 border-t-[1px] mt-6 flex gap-4">
                           <div className="flex-1 flex gap-1 items-center text-sm text-zinc-600 font-medium py-2">
                              <Plus size={15}/>
                              {format(new Date(file.createdAt), 'dd MMM yyyy')}
                           </div>
                           <div onClick={() => deleteFile({id: file.id})} className="flex items-center justify-end gap-2 text-red-500">
                              <button>
                                 {currentlyDeletingFile === file.id ? (
                                    <Loader2 size={20} className="animate-spin"/>
                                 ) : <Trash2 size={20} className="cursor-pointer"/> }
                              </button>
                           </div>
                        </div>
                     </li>
                  ))}
               </ul>
            ) : isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Skeleton className="h-48"/>
                  <Skeleton className="h-48"/>
                  <Skeleton className="h-48"/>
               </div>
            ) : (
               <Empty />
            )}
         </div>
      </div>
   )
}

export default Dashboard
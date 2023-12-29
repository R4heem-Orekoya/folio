import ChatWrapper from "@/components/ChatWrapper"
import PdfRenderer from "@/components/PdfRenderer"
import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { notFound, redirect } from "next/navigation"

interface PageProps {
   params: {
      fileid: string
   }
}

const Page = async ({ params } : PageProps) => {
   const { fileid } = params
   const { getUser } = getKindeServerSession()
   const user = await getUser()
   
   if(!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`)
   
   const file = await db.file.findFirst({
      where: {
         id: fileid,
         userId: user.id
      }
   })
   
   if(!file) notFound()
   
   return (
      <div className="lg:flex gap-8 min-h-[calc(100vh-80px)]">
         <div className="flex-1">
            <div className="pt-6">
               <PdfRenderer url={file.url}/>
            </div>
         </div>
         
         <div className="shrink-0 lg:py-6 max-lg:mt-8 flex-[0.75] lg:w-96">
            <ChatWrapper fileId={file.id}/>
         </div>
      </div>
   )
}


export default Page
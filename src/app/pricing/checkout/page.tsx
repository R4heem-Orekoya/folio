import PaymentForm from "@/components/PaymentForm"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"


const page = async () => {
   const { getUser } = await getKindeServerSession()
   const user = await getUser()
   
   return (
      <div className="min-h-[calc(100vh-100px)]">
         <PaymentForm user={user}/>
      </div>
   )
}

export default page

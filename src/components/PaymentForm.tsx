'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types"
import { Button } from "./ui/button"
import { CreditCard, Text } from "lucide-react"
import Link from "next/link"
import Lottie from "lottie-react"
import Animation from '../../public/payanimation.json'

import { useFormik } from 'formik';
import * as Yup from 'yup'

interface UserProps {
   user: KindeUser | null
}
interface Values {
   email: string;
   cardNumber: string;
   expiryDate: string;
   cvv: string;
}

const PaymentForm = ({ user } : UserProps) => {
   const formatCardNumber = (input: string) => {
      const trimmedInput = input.replace(/\s/g, ''); // Remove existing spaces
      const formattedInput = trimmedInput.replace(/(\d{4})/g, '$1 '); // Add space after every fourth digit
      return formattedInput.trim(); // Trim any trailing space
   };
   const submitForm = (values: Values) => {
      console.log(values);
   }
   
   const formik = useFormik({
      initialValues: {
         email: `${user?.email}`,
         cardNumber: '',
         expiryDate: '',
         cvv: ''
      },
      
      validationSchema: Yup.object({
         cardNumber: Yup.string().min(16, "card Number can't be less than 16 digits.").required('Card Number cannot be empty.'),
         expiryDate: Yup.string().required('Expiry Date cannot be empty.'),
         cvv: Yup.string().max(3, "CVV can't be more than 3 digits").required('CVV cannot be empty.')
      }),
      
      onSubmit: values => submitForm(values)
   })
   
   return (
      <div className="w-[min(900px,100%)] p-6 bg-zinc-100 border border-zinc-200/50 mx-auto my-12 grid grid-cols-5 max-md:grid-cols-1 gap-8 rounded-lg">
         <form onSubmit={formik.handleSubmit} className="col-span-3 max-md:col-span-1 rounded-md">
            <h3 className="text-xl pb-8 font-semibold text-zinc-800">Payment Details</h3>
            <div className="flex flex-col gap-3">
               <Label htmlFor="email" className={`${formik.errors.email ? 'text-red-400 text-xs': ''}`}>
                  {formik.errors.email ? formik.errors.email : 'Email address'}
               </Label>
               <Input type="email" id="email" name='email' placeholder="Email" value={formik.values.email} disabled/>
            </div>
            <div className="flex flex-col gap-3 mt-6">
               <Label htmlFor="cardnumber" className={`${formik.errors.cardNumber ? 'text-red-400 text-xs': ''}`}>
                  {formik.errors.cardNumber ? formik.errors.cardNumber : 'Card Number'}
               </Label>
               <Input 
                  type="text" id="cardnumber" name="cardnumber"
                  placeholder="xxxx xxxx xxxx xxxx" 
                  value={formatCardNumber(formik.values.cardNumber)}
                  onChange={(e) => {
                     const input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                     const limitedInput:string = input.slice(0, 16); // Limit to 16 characters
                     formik.handleChange('cardNumber')(formatCardNumber(limitedInput));
                  }}
               />
            </div>   
            
            <div className="flex justify-between gap-6 mt-6">
               <div className="flex flex-col gap-3 flex-1">
                  <Label htmlFor="expirydate" className={`${formik.errors.expiryDate ? 'text-red-400 text-xs': ''}`}>
                     {formik.errors.expiryDate ? formik.errors.expiryDate : 'Expiry Date'}
                  </Label>
                  <Input type="text" placeholder="MM/YY" name="expiryDate" id="expirydate" value={formik.values.expiryDate} onChange={formik.handleChange}/>
               </div>
               <div className="flex flex-col gap-3 flex-1">
                  <Label htmlFor="cvv" className={`${formik.errors.cvv ? 'text-red-400 text-xs': ''}`}>
                     {formik.errors.cvv ? formik.errors.cvv : 'CVV'}
                  </Label>
                  <Input type="password" name="cvv" placeholder="xxx" id="cvv" value={formik.values.cvv} onChange={formik.handleChange}/>
               </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
               <span className="text-sm text-zinc-600">Amount</span>
               <span className="text-lg font-semibold text-zinc-700">#1200</span>
            </div>
            
            <Button type="submit" className="mt-6 w-full text-lg" size='lg'>
               Pay <CreditCard size={18} strokeWidth={1.5} className="ml-2"/>
            </Button>
         </form>
         <div className="bg-zinc-800 overflow-hidden col-span-2 max-md:hidden rounded-md">
            <div className="w-full aspect-video text-white text-center px-6 flex flex-col gap-4 justify-center items-center">
               <Link href='/' className="text-2xl font-bold flex items-center gap-2"><Text size={20}/>Folio.</Link>
               <p>Subscribe and start enjoying our premium features.</p>
            </div>
            <div className="bg-white">
               <Lottie animationData={Animation} loop={true}/>
            </div>
         </div>
      </div>
   )
}

export default PaymentForm

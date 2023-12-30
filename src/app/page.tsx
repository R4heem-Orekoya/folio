import Image from 'next/image'
import Link from 'next/link'
import Blob from '@/components/Blob'
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server"

export default function Home() {
  return (
    <>
      <section className='my-20 sm:mt-30 flex flex-col justify-center items-center gap-6 text-center'>
        <h1 className='max-w-4xl text-4xl md:text-5xl lg:text-7xl font-semibold'>Chat with PDF documents in seconds</h1>
        <p className='max-w-3xl mx-auto sm:text-xl pb-5'>
          Folio allows you to chat with your pdf documents. Simply upload your document and start asking questions.
        </p>
        <RegisterLink>
          <span className='px-8 py-4 rounded-md bg-zinc-800 hover:bg-zinc-700 duration-300 text-white sm:text-lg'>Get Started</span>
        </RegisterLink>

        <Blob />

        <div className='image max-w-4xl w-full aspect-[4/3] sm:aspect-video mt-8 rounded-md p-4 bg-zinc-100 border border-zinc-300'></div>

      </section>

      <section className='py-20 md:px-8'>
        <h2 className='text-center text-2xl sm:text-3xl md:text-4xl font-semibold'>Steps to follow</h2>
        <p className='text-center text-lg sm:text-xl mt-4'>Chatting with PDF documents has never been easier than this.</p>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-16 sm:mt-20'>
          <div className='col-span-1 aspect-video'>
            <span className='text-lg'>01.</span>
            <h3 className='text-zinc-800 font-semibold text-xl'>Create an account</h3>
            <p className='my-3'>Either starting out with a free plan or choose our <Link href='/pricing' className='text-blue-500 underline'>Pro plan</Link>.</p>
            <div className='w-full aspect-video mt-8 rounded-md bg-zinc-100 border border-zinc-300'>

            </div>
          </div>
          <div className='col-span-1 aspect-video'>
            <span className='text-lg'>02.</span>
            <h3 className='text-zinc-800 font-semibold text-xl'>Upload your PDF file</h3>
            <p className='my-3'>We&apos;ll process your file and make it ready for you to chat with.</p>
            <div className='w-full aspect-video mt-8 rounded-md bg-zinc-100 border border-zinc-300'>

            </div>
          </div>
          <div className='col-span-1 aspect-video'>
            <span className='text-lg'>03.</span>
            <h3 className='text-zinc-800 font-semibold text-xl'>Start asking questions</h3>
            <p className='my-3'>It&apos;s that simple. Try out paperflow today, it takes less than a minute.</p>
            <div className='w-full aspect-video mt-8 rounded-md bg-zinc-100 border border-zinc-300'>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

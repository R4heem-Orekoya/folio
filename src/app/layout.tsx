import { Poppins } from 'next/font/google' 
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import Providers from '@/components/Providers'
import 'react-loading-skeleton/dist/skeleton.css'
import 'simplebar-react/dist/simplebar.min.css'
import { constructMetadata } from '@/lib/utils'
import type { Viewport } from 'next'


const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: 'black',
}
export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
      <Providers>
        <body className='antialiased bg-white text-zinc-900'>
          <Navbar />
          <main className='relative w-[min(1400px,90%)] mx-auto max-sm:overflow-x-hidden'>
            {children}
          </main>
          <Footer />
          <Toaster />
        </body>
      </Providers>
    </html>
  )
}

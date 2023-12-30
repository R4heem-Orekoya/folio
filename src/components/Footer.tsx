import { Github, Instagram, Twitter } from 'lucide-react'


const Footer = () => {
  return (
     <footer className='mt-16 py-6 border-t text-center flex flex-col gap-6 items-center justify-center'>
          <h4 className='text-2xl font-semibold text-zinc-700'>REDOXX</h4>
          <ul className='flex gap-4 items-center'>
               <li>
                    <a href="https://www.instagram.com/redoxx.code/"><Instagram size={30} strokeWidth={1.5}/></a>
               </li>
               <li>
                    <a href="https://twitter.com/Redoxx_Code"><Twitter size={30} strokeWidth={1.5}/></a>
               </li>
               <li>
                    <a href="https://github.com/R4heem-Orekoya"><Github size={30} strokeWidth={1.5}/></a>
               </li>
          </ul>
     </footer>
  )
}

export default Footer

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Fullscreen, Loader2 } from "lucide-react"
import { useToast } from './ui/use-toast';
import SimpleBar from "simplebar-react"
import { Document, Page } from 'react-pdf'
import { useResizeDetector } from "react-resize-detector";

interface PdfFullScreenProps{
   url: string
 }

const PDFFullscreen = ({url}: PdfFullScreenProps) => {
   const { width, ref } = useResizeDetector();
   const {toast}  = useToast()
   const [isOpen, setIsOpen] = useState(false)
   const [numPages, setNumPages] = useState<number>()
   
   
  return (
   <Dialog open={isOpen} onOpenChange={(e) => {
      if(!e){
         setIsOpen(e)
      }
   }}>
      <DialogTrigger asChild>
         <button onClick={() => setIsOpen(true)} aria-label='full-screen' className='p-2 hover:bg-zinc-100 rounded-md'>
            <Fullscreen size={20} strokeWidth={2} className='text-zinc-800'/>
          </button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
         <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
         <div ref={ref}>
            <Document 
              loading={
                <div className='w-full flex justify-center'><Loader2 size={20} strokeWidth={1.5} className='animate-spin text-zinc-700'/></div>
              } 
              onLoadError={() => {
                toast({
                  title: 'Error loading PDF! 😓',
                  description: 'Please try again later.',
                  variant: 'destructive'
                }) 
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={url} className='max-h-full'>
              {new Array(numPages).fill(0).map((_, i) => (
               <Page 
                  key={i}
                  width={width ? width : 1}
                  pageNumber={i + 1}
               />
              ))}
            </Document>
          </div> 
         </SimpleBar>
      </DialogContent>
   </Dialog>
  )
}

export default PDFFullscreen

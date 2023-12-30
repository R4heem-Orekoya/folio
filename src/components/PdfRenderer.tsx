'use client'

import { ChevronDown, ChevronUp, Loader2, RotateCw, ZoomIn } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf'

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';

import {useResizeDetector} from 'react-resize-detector'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

import Simplebar from 'simplebar-react'
import PDFFullscreen from './PDFFullscreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PdfRendererProps{
  url: string
}

const PdfRenderer = ({url}: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number>()
  const [currPage, setCurrPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [renderedScale, setRenderedScale] = useState<number | null>(null)
  const {toast}  = useToast()
  const { width, ref } = useResizeDetector();
  
  const isLoading = renderedScale !== scale
  
  const pageValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  })
  
  type TCustomPageValidation = z.infer<typeof pageValidator>
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TCustomPageValidation>({
    defaultValues: {
      page: '1'
    },
    resolver: zodResolver(pageValidator) 
  })
  
  const handlePageSubmit = ({page}: TCustomPageValidation) => {
    setCurrPage(Number(page))
    setValue('page', String(page))
  }
  
  return (
    <div className="bg-zinc-50 px-4 shadow rounded-lg w-full flex flex-col items-center">
      <div className="h-14 w-full border-b flex justify-between items-center">
        <div className='flex items-center gap-4 divide-x-[1px] divide-zinc-300'>
          <div className='flex items-center gap-1'>
            <input 
              {...register('page')} 
              type="text" 
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  handleSubmit(handlePageSubmit)()
                }
              }}
              className={`h-8 aspect-square bg-zinc-100 focus:outline-zinc-800 rounded-md px-2 ${errors.page ? 'focus:outline-red-500' : ''}`}/>
            <p className='text-zinc-800 text-lg space-x-1 flex items-center'>
              <span>/</span>
              <span>{numPages ?? (<Loader2 size={15} className='animate-spin'/>)}</span>
            </p>
          </div>
          <div className='flex items-center gap-1 pl-2'>
            <button onClick={() => {
                setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
                setValue('page', String(currPage - 1))
              }} 
              disabled={currPage <= 1} aria-label='previous page' className='hover:bg-zinc-100 disabled:opacity-25 rounded-md grid place-items-center h-8 aspect-square'>
              <ChevronDown size={20} strokeWidth={2} className='text-zinc-700'/>
            </button>
            <button onClick={() => {
                setCurrPage(prev => (prev + 1 > numPages! ? numPages! : prev + 1))
                setValue('page', String(currPage + 1))
              }} 
              disabled={numPages === undefined || currPage >= numPages!} aria-label='next page' className='hover:bg-zinc-100 disabled:opacity-25 rounded-md grid place-items-center h-8 aspect-square'>
              <ChevronUp size={20} strokeWidth={2} className='text-zinc-700'/>
            </button> 
          </div>
        </div>
        
        <div className='space-x-1 flex items-center '>
          <div className='small-screen-hidden-buttons'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label='zoom in' className='flex items-center gap-1 p-2 rounded-md hover:bg-zinc-100'>
                  <ZoomIn size={20} strokeWidth={1.8} className='text-zinc-800'/>
                  {scale * 100}%
                  <ChevronDown size={16} strokeWidth={2} strokeOpacity={0.6}/>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setScale(1)}>100%</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.5)}>150%</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2)}>200%</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2.5)}>250%</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(3)}>300%</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <button onClick={() => setRotation(prev => prev + 90)} aria-label='rotate 90 degrees' className='small-screen-hidden-buttons p-2 hover:bg-zinc-100 rounded-md'>
            <RotateCw size={20} strokeWidth={2} className='text-zinc-800'/>
          </button>
          
          <PDFFullscreen url={url}/>
        </div>
      </div>
      
      <div className="flex-1 w-full my-4 max-h-screen">
        <Simplebar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
          <div ref={ref}>
            <Document 
              loading={
                <div className='w-full my-20 flex justify-center'>
                  <Loader2 size={20} strokeWidth={1.5} className='animate-spin text-zinc-700'/>
                </div>
              } 
              onLoadError={() => {
                toast({
                  title: 'Error loading PDF! 😓',
                  description: 'Please try again later.',
                  variant: 'destructive'
                }) 
              }}
              onLoadSuccess={({numPages}) => setNumPages(numPages)}
              file={url} className='max-h-full'>
              {isLoading && renderedScale ? 
                <Page 
                  width={width ? width : 1} 
                  pageNumber={currPage} scale={scale} 
                  rotate={rotation} 
                  key={`@${renderedScale}`}
                /> : null
              }
                <Page 
                  className={`${isLoading ? 'hidden' : ''}`}
                  width={width ? width : 1} 
                  pageNumber={currPage} scale={scale} 
                  rotate={rotation}
                  key={`@${scale}`}
                  loading={
                    <div>
                      <Loader2 size={25} strokeWidth={2} className='text-zinc-800 animate-spin'/>
                    </div>
                  }
                  onRenderSuccess={() => setRenderedScale(scale)}
                />
            </Document>
          </div> 
        </Simplebar>
      </div>
    </div>
  )
}

export default PdfRenderer

import Lottie from 'lottie-react'
import Animation from '../../public/EmptyAnimation.json'

const Empty = () => {
   return (
      <div className="w-full flex flex-col justify-center items-center">
         <div className='w-[180px] aspect-square'>
            <Lottie animationData={Animation}/>
         </div>
         <p className='text-lg text-zinc-700 text-center'>You haven&apos;t uploaded any file!</p>
      </div>
   )
}

export default Empty
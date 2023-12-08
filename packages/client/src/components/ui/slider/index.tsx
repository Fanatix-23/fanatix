import React from 'react'
import Image from 'next/image'
import { MdAllInclusive } from 'react-icons/md'

const Slider = () => {
    return (
        <div className='w-[480px] mx-auto my-10 flex overflow-hidden bg-[#1E2B53]'>
            <div className='animate-infinite-slider hover:animat flex gap-[40px] items-center text-primary'>
                <Image height={80} width={80} src={"/image/illustrative-bg.jpg"} alt="" className='aspect-square'/>
                <Image height={80} width={80} src={"/image/pastel-hero.jpg"} alt="" className='aspect-square'/>
                <Image height={80} width={80} src={"/image/illustrative-bg.jpg"} alt="" className='aspect-square'/>
                <Image height={80} width={80} src={"/image/pastel-hero.jpg"} alt="" className='aspect-square'/>
                <Image height={80} width={80} src={"/image/illustrative-bg.jpg"} alt="" className='aspect-square'/>
                <Image height={80} width={80} src={"/image/pastel-hero.jpg"} alt="" className='aspect-square'/>
                <Image height={80} width={80} src={"/image/illustrative-bg.jpg"} alt="" className='aspect-square'/>
                <Image height={80} width={80} src={"/image/pastel-hero.jpg"} alt="" className='aspect-square'/>
            </div>
        </div>
    )
}

export default Slider
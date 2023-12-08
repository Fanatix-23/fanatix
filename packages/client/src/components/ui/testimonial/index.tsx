import React from 'react'
import Image from 'next/image'

interface TestimonialProps {
    image: string
    title: string
    text: string
}


const Testimonial: React.FC<TestimonialProps> = ({image, title, text}) => {
  return (
    <div className="flex flex-col gap-2 p-5 bg-primary rounded-md border-2 border-accent ">
        <div className="flex gap-3 items-center">
        <Image
            height={60}
            width={60}
            src={image}
            alt="Profile Picture"
            className="rounded-full overflow-hidden aspect-square"
        />
        <h1 className="text-2xl font-bold text-accent">{title}</h1>
        </div>
        <div className="text-md font-md text-offset">
        {text}
        </div>
    </div>
  )
}

export default Testimonial
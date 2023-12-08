import React from 'react'
import clsx from 'clsx'

interface HeroProps {
    title?: string
    textClassname?: string
    className?: string
}

const Hero: React.FC<HeroProps> = ({ title, textClassname, className}) => {
  return (
    <div className={clsx("w-screen p-10 flex items-center min-h-[60vh] relative", className)}>
      {title && (
        <h1 className={clsx('text-5xl md:text-9xl font-bold text-accent', textClassname)}>
          {title}
        </h1>
      )}
    </div>
  )
}

export default Hero
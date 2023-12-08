import React, { PropsWithChildren } from 'react'

interface BarProps {
  className?: string
  color?: string
}

const Bar: React.FC<BarProps & PropsWithChildren> = ({children, className, color}) => {
  return (
    <div className='w-screen' style={{
        backgroundColor: color ? color : 'transparent',
        backdropFilter: 'blur(10px)'
    }}>
        <div className='grid grid-cols-1 md:grid-cols-2 w-[90%] max-w-7xl mx-auto py-20 gap-5'>
            {children}
        </div>
    </div>
  )
}

export default Bar
import clsx from 'clsx'
import React from 'react'

interface InfoCardProps {
    title: string
    info: string
    icon?: React.ReactNode,
    className?: string
}

const InfoCard: React.FC<InfoCardProps> = ({ title, info, icon, className }) => {
    return (
        <div className={clsx("flex flex-col gap-2 p-5 text-accent items-center", className)}>
            {icon && icon}
            <h1 className='text-lg font-semibold'>{title}</h1>
            <p className="text-md text-primary font-medium bg-offset p-1 rounded-md w-fit items-center justify-center flex gap-2">
                {info}
            </p>
        </div>
    )
}

export default InfoCard
import React from 'react'
import clsx from 'clsx'

interface Input {
    name: string
    type?: "text" | "number"
    variant?: "primary" | "secondary"
    onChange?: (e: any) => void
    placeholder?: string
    className?: string
    value?: number
}

const TEXT_VARIANTS = {
    "primary": 'border-primary border-b-2 rounded-md bg-transparent text-accent text-lg p-2 outline-none focus:outline-none focus:border-accent',
    "secondary": ''
}

const NUMBER_VARIANTS = {
    "primary": "p-2 border border-accent border-2 rounded-md text-lg bg-transparent focus:outline-none",
    "secondary": "bg-transparent p-2 border-none text-primary rounded-md cursor-default text-center focus:outline-none"
}

const Input: React.FC<Input> = ({ type = "text", variant = "primary", name, placeholder, className, onChange, value }) => {
    if (type === "number") {
        if (variant === "primary") {
            return (
                <input
                    type="number"
                    className={clsx(NUMBER_VARIANTS['primary'], className)}
                    name={name}
                    placeholder={placeholder}
                />
            )
        }
        else {
            const [value, setValue] = React.useState(0)
            return (
                <div className='flex gap-2 items-center justify-between px-5 border-2 border-accent rounded-md'>
                    <div 
                        className='rounded-full h-min w-min font-bold text-2xl text-primary cursor-pointer'
                        onClick={() => {
                            setValue(value - 1);
                        }}
                    >
                        -
                    </div>
                    <input
                        type="number"
                        className={clsx(NUMBER_VARIANTS['secondary'], className)}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        disabled={true}
                    />
                    <div 
                        className='rounded-full h-min w-min font-bold text-2xl text-primary cursor-pointer' 
                        onClick={() => {
                            setValue(value + 1);
                        }}
                    >
                        +
                    </div>
                </div>
            )
        }
    }
    return (
        <input
            type="text"
            className={clsx(TEXT_VARIANTS[variant], className)}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
        />
    )
}

export default Input
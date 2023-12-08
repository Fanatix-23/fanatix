import React from "react"

import { MdArrowOutward, MdArrowForward } from 'react-icons/md'

const variants = {
  primary: "bg-accent text-primary",
  secondary: "border-2 border-primary text-accent hover:bg-primary",
  link: "text-md group text-accent",
  external_link: "!px-1 group text-md text-accent",
  plain: "text-md text-accent",
}

interface ButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string
  textClassName?: string
  variant?: keyof typeof variants
}

const Button = ({
  title,
  onClick,
  className = "",
  disabled = false,
  textClassName = "",
  variant = "primary",
  children,
  type,
  style,
  ...properties
}: ButtonProperties) => {
  const BASE_CLASS = "flex justify-center items-center text-semibold rounded-full px-3 py-1 transition-all"

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`${BASE_CLASS} ${variant && variants[variant]} ${className}`}
      {...properties}
    >
      {children && children}
      {title && <p className={` ${textClassName}`}>{title}</p>}
      {variant === "external_link" && <MdArrowOutward className="ml-1 group-hover:rotate-45 transition-all"/>}
      {variant === "link" && <MdArrowForward className="ml-1 group-hover:ml-2 transition-all"/>}
    </button>
  )
}

export default Button

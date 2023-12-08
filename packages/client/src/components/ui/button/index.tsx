import React from "react"

const variants = {
  primary: "",
  secondary: "",
  link: "",
  pill: "",
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
  const BASE_CLASS = ""

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
    </button>
  )
}

export default Button

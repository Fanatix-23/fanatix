import React from "react"
import Link from "next/link"

interface FooterProps {
  className?: string
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <div className="bg-primary text-accent w-screen py-10">
      <div className="w-[90%] max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">
        <h1 className="font-black text-3xl">
          FANATIX
        </h1>
        <div className="flex flex-wrap items-center gap-4 flex-col text-xl font-extrabold">
          <Link href={"#"}>HOME</Link>
        </div>
      </div>
      <div className="flex md:hidden w-full h-10"></div>
    </div>
  )
}

export default Footer

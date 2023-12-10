import React, { ReactNode, useRef } from "react"
import Avatar from "boring-avatars"
import Link from "next/link"
import { MdOutlineAllInclusive, MdOutlineHome, MdOutlineShoppingBag } from "react-icons/md"
import { UserContext } from "../index1"
import Button from "@/components/ui/button"
import { useUserSession } from "@/providers/user-context"

interface HeaderProps {
  className?: string
}

const LINKS = [
  {
    title: "HOME",
    link: "/home",
    icon: (
      <MdOutlineHome
        style={{
          height: "30px",
          width: "30px",
        }}
      />
    ),
  },
  {
    title: "ABOUT",
    link: "/about",
    icon: (
      <MdOutlineAllInclusive
        style={{
          height: "30px",
          width: "30px",
        }}
      />
    ),
  },
  {
    title: "MARKETPLACE",
    link: "/marketplace",
    icon: (
      <MdOutlineShoppingBag
        style={{
          height: "30px",
          width: "30px",
        }}
      />
    ),
  },
]

const Header: React.FC<HeaderProps> = ({ className }) => {
  const headerRef = useRef<HTMLDivElement>(null)
  const userContext = React.useContext(UserContext)
  const user = userContext?.user
  const userSessionContext = useUserSession()
  return (
    <div className="z-[100] relative">
      <div
        className="flex justify-center items-center w-[90%] max-w-7xl my-2 bg-primary bg-opacity-40 fixed top-0 left-1/2 -translate-x-1/2 backdrop-blur-2xl rounded-full overflow-hidden p-2 shadow-md"
        ref={headerRef}
      >
        <div className="flex items-center justify-between w-full text-accent gap-10">
          <h1 className="font-bold text-xl px-3">FANATIX</h1>
          <div className="justify-center items-center gap-2 text-sm font-semibold hidden md:flex">
            {LINKS.map((link) => {
              return (
                <Link href={link.link} className="px-2" key={link.link}>
                  {link.title}
                </Link>
              )
            })}
          </div>
          {user?.isLoggedIn ? (
            <Avatar name={user?.user.walletAddress} />
          ) : (
            <Button
              title="CONNECT"
              className=""
              onClick={() => {
                userSessionContext?.login()
              }}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 w-screen md:hidden fixed bottom-0 left-0 bg-gradient-to-t from-slate-800 to-transparent py-2">
        {LINKS.map((link) => {
          return (
            <Link
              href={link.link}
              className="flex flex-col justify-center items-center p-2 text-accent"
              key={link.link}
            >
              {link.icon}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Header

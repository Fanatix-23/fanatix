import React from "react"
import clsx from "clsx"
import { ToastContainer } from "react-toastify"

import { UserProvider } from "@/providers/user-context"

import Footer from "./footer"
import Header from "./header"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <>
      <UserProvider>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="light"
        />
        <Header />
        <main className={clsx("", className)}>{children}</main>
        <Footer />
      </UserProvider>
    </>
  )
}

export default Layout

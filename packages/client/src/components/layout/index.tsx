import React from "react"
import clsx from "clsx"
import { ToastContainer } from "react-toastify"

import { HUDDLE01_PROJECT_ID } from "@/config/env"
import { Huddle01Provider } from "@/providers/huddle01-context"
import { UserProvider } from "@/providers/user-context"
import { HuddleClient, HuddleProvider } from "@huddle01/react"
import {
  coinbaseWallet,
  metamaskWallet,
  ThirdwebProvider,
  walletConnect,
} from "@thirdweb-dev/react"

import Footer from "./footer"
import Header from "./header"

const client = new HuddleClient({
  projectId: HUDDLE01_PROJECT_ID,
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
})

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <>
      <ThirdwebProvider
        supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
        activeChain="ethereum"
        clientId="your-client-id"
      >
        <UserProvider>
          <HuddleProvider key="huddle01-provider" client={client}>
            <Huddle01Provider>
              
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
              <main className={clsx("min-h-screen", className)}>{children}</main>
              <Footer />
            </Huddle01Provider>
          </HuddleProvider>
        </UserProvider>
      </ThirdwebProvider>
    </>
  )
}

export default Layout

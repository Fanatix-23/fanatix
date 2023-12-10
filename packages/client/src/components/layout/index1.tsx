import React from "react"
import clsx from "clsx"
import { ToastContainer } from "react-toastify"

import { HUDDLE01_PROJECT_ID } from "@/config/env"
import { Huddle01Provider } from "@/providers/huddle01-context"
import { HuddleClient, HuddleProvider } from "@huddle01/react"
import {
  SafeAuthPack,
  SafeAuthConfig,
  SafeAuthInitOptions,
  SafeAuthUserInfo,
} from "@safe-global/auth-kit"

import { RPC_URL } from "@/config/env"

import {
  coinbaseWallet,
  metamaskWallet,
  ThirdwebProvider,
  walletConnect,
} from "@thirdweb-dev/react"

import Footer from "./footer"
import Header from "./header"
import { useUserSession } from "@/providers/user-context"

export interface IUserContext {
  isLoggedIn: boolean
  isCreator: boolean
  user: {
    walletAddress: string
  }
  creator: {
    lensId: string
    contract: {}
  }
}

interface T {
  user: IUserContext
  setUser: (user: IUserContext) => void
}

export const UserContext = React.createContext<T>({} as T)

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
  const [user, setUser] = React.useState<IUserContext>({
    isLoggedIn: false,
    isCreator: false,
    user: {
      walletAddress: "",
    },
    creator: {
      lensId: "",
      contract: "",
    },
  })

  const UserSession = useUserSession()

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-expect-error - Missing globals
      const params = new URL(window.document.location).searchParams
      const chainId = params.get("chainId")

      const safeAuthConfig: SafeAuthConfig = {
        txServiceUrl: "https://safe-transaction-sepoliai.safe.global",
      }

      ;(async () => {
        const options: SafeAuthInitOptions = {
          enableLogging: true,
          buildEnv: "production",
          chainConfig: {
            chainId: chainId || "0xaa36a7",
            rpcTarget: RPC_URL,
          },
        }
        if (window == null) return
        const authPack = new SafeAuthPack(safeAuthConfig)

        await authPack.init(options)

        // console.log("safeAuthPack:safeEmbed", authPack.safeAuthEmbed);

        UserSession.setSafeAuthPack(authPack)

        authPack.subscribe("accountsChanged", async (accounts: any) => {
          // console.log("safeAuthPack:accountsChanged", accounts, authPack.isAuthenticated);
          if (authPack.isAuthenticated) {
            const signInInfo = await authPack?.signIn()

            UserSession.setSafeAuthSignInResponse(signInInfo)
            UserSession.setIsAuthenticated(true)
          }
        })

        authPack.subscribe("chainChanged", (eventData: any) =>
          console.log("safeAuthPack:chainChanged", eventData)
        )
      })()
    }
  }, [])
  return (
    <>
      <ThirdwebProvider
        supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
        activeChain="ethereum"
        clientId="your-client-id"
      >
        <UserContext.Provider value={{ user, setUser }}>
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
        </UserContext.Provider>
      </ThirdwebProvider>
    </>
  )
}

export default Layout

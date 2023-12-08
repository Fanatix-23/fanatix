import { NextPage } from "next"
import type { AppProps } from "next/app"
import clsx from "clsx"

import Layout from "@/components/layout"

import "@/styles/globals.css"
import "@/styles/particles.css"

import { Noto_Sans, Courgette } from "next/font/google"

// If loading a variable font, you don't need to specify the font weight
const noto = Noto_Sans({weight:["100", "200", "300", "400", "500", "600", "700", "800" ], subsets: ["latin"], variable: "--font-noto" })
const handlee = Courgette({weight:["400"], subsets: ["latin"], variable: "--font-handlee" })

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      {/* <div id="modalContainer" className="fixed top-0 left-0 h-screen w-screen hidden justify-center items-center z-50"/> */}
      <main className={clsx(noto.variable, handlee.variable, "relative bg-black")}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </>
  )
}

export default App

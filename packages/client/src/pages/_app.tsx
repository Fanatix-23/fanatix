import { NextPage } from "next"
import type { AppProps } from "next/app"

import Layout from "@/components/layout"

import "@/styles/globals.css"

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App

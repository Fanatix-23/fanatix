import { Head, Html, Main, NextScript } from "next/document"

const Document = () => {
  if (typeof window == undefined) return null;
  return (
    <Html lang="en">
      <Head />
      <body className="min-w-screen overflow-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document

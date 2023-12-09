import React from "react"

import Stars from "@/components/design/stars"
import WalletConnection from "@/components/onboarding/wallet-connection"

const CreatorOnboaring = () => {
  return (
    <div className="w-full min-h-screen center">
      <Stars />
      <>
        <div className="z-10">
          <WalletConnection />
        </div>
      </>
    </div>
  )
}

export default CreatorOnboaring

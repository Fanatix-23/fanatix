import React from "react"
import Image from "next/image"
import Button from "@/components/ui/button"
import NFTDisplayCard from "@/components/ui/NFTDisplayCard"

interface HomePageProps {
  path?: string
}

const HomePage: React.FC<HomePageProps> = () => {
  const featuredNFTs = [
    {
      image: "/image/nft1.png",
      socialImage: "/image/nft1.png",
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      increase: "12%"
    },
    {
      image: "/image/nft1.png",
      socialImage: "/image/nft1.png",
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      increase: "12%"
    },
    {
      image: "/image/nft1.png",
      socialImage: "/image/nft1.png",
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      increase: "12%"
    },
  ]
  return (
    <div>
      <div className="min-h-[60vh] w-screen overflow-hidden relative">
        <div className="flex flex-col justify-between gap-10 relative min-h-[60vh] rounded-xl w-[90%] mx-auto mb-10 mt-20 p-10 overflow-hidden bg-secondary">
            <div className="animation-wrapper">
                <div className="particle particle-1"/>
                <div className="particle particle-2"/>
                <div className="particle particle-3"/>
                <div className="particle particle-4"/>
            </div>
            <h1 className="md:text-[5vw] text-4xl md:max-w-[60%] font-black text-accent leading-tight z-10">Earn with your fav creators. <span className="font-handlee">Seamlessly.</span></h1>
            <div className="flex gap-20 z-10">
              <Button title="Invest now!" className="md:text-4xl md:!p-5 md:!px-10 text-xl font-bold"/>
              <Button title="I'm a creator" className="md:text-4xl md:!p-5 md:!px-10 text-xl font-bold" variant="secondary"/>
            </div>
        </div>
        <div className="flex flex-col gap-10 relative min-h-[60vh] rounded-xl w-[90%] mx-auto my-10 overflow-hidden bg-slate-800">
          <h1 className="text-4xl font-black text-accent">Featured Creators</h1>
          <div className="flex flex-wrap gap-10">
            {
              featuredNFTs.map(data => <NFTDisplayCard {...data} />)
            }
          </div>
          <Button title="Explore More!"/>
        </div>
        <div className="flex flex-col relative min-h-[60vh] rounded-xl w-[90%] mx-auto my-10 overflow-hidden bg-slate-800">
          <h1 className="text-4xl font-black text-accent">Features</h1>
        </div>
      </div>
    </div>
  )
}

export default HomePage

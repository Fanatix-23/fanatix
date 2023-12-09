import React from "react"

import NFTDisplayCard, { NFTDisplayCardProps } from "@/components/ui/NFTDisplayCard"
import Hoverable from "@/components/ui/hoverable"
import Input from "@/components/ui/input"
import axios from "axios"
import { IUserContext } from "@/components/layout"

const Marketplace = () => {
  const recommendedNFTs: NFTDisplayCardProps[] = [
    {
      image: "/image/nft1.jpg",
      socialImage: "/image/nft1.jpg",
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      increase: "12%",
      tier: "silver",
    },
    {
      image: "/image/nft2.jpg",
      socialImage: "/image/nft2.jpg",
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      increase: "12%",
    },
    {
      image: "/image/nft3.jpg",
      socialImage: "/image/nft3.jpg",
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      increase: "12%",
    },
    {
      image: "/image/nft1.jpg",
      socialImage: "/image/nft1.jpg",
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      increase: "12%",
      tier: "bronze",
    },
  ]

  const [creators, setCreators] = React.useState<IUserContext[]>([])

  React.useEffect(() => {
    axios
      .get("/api/getCreators")
      .then((res) => {
        console.log(res.data)
        setCreators(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  return (
    <div>
      <div className="min-h-[100vh] w-screen overflow-hidden relative">
        <div className="flex text-center justify-center text-accent text-5xl font-black gap-10 relative rounded-xl w-[90%] mx-auto mb-10 mt-20 p-10 overflow-hidden bg-secondary">
          <div className="animation-wrapper">
            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
            <div className="particle particle-4" />
          </div>
          <p>
            The creator <span className="font-handlee">marketplace</span>
          </p>
        </div>
        <div className="w-[90%] bg-offset p-10 my-10 mx-auto rounded-xl flex flex-col gap-10">
          <h1 className="text-3xl text-accent font-bold outline-primary outline-4">
            Recommended for <span className="font-handlee">you</span>!
          </h1>
          <div className="flex flex-wrap justify-evenly w-full gap-10">
            {recommendedNFTs.map((nft, index) => (
              <Hoverable>
                <NFTDisplayCard key={index} {...nft} />
              </Hoverable>
            ))}
          </div>
        </div>
        <div className="w-[90%] flex flex-col gap-10 items-center p-10 mx-auto my-10 bg-primary rounded-xl">
          <h1 className="text-4xl text-accent font-bold">Explore!</h1>
          <Input
            name="searchBar"
            placeholder="Search for creators"
            className="text-xl border-2 !rounded-full !px-5 border-secondary w-full text-center"
          ></Input>
          <div className="flex gap-10 justify-evenly"></div>
        </div>
      </div>
    </div>
  )
}

export default Marketplace

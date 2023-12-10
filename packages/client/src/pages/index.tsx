import NFTDisplayCard, { NFTDisplayCardProps } from "@/components/ui/NFTDisplayCard"
import Button from "@/components/ui/button"
import Hoverable from "@/components/ui/hoverable"
import { UserContext } from "@/components/layout"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import Avatar from "boring-avatars"

interface HomePageProps {
  path?: string
}

const HomePage: React.FC<HomePageProps> = () => {
  const featuredNFTs: NFTDisplayCardProps[] = [
    {
      image: <Avatar name="nft1" size={250} />,
      socialImage: <Avatar name="nft1" />,
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      left: 12,
    },
    {
      image: <Avatar name="nft2" size={250} />,
      socialImage: <Avatar name="nft2" />,
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      left: 24,
    },
    {
      image: <Avatar name="nft3" size={250} />,
      socialImage: <Avatar name="nft3" />,
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      left: 2,
    },
    {
      image: <Avatar name="nft1" size={250} />,
      socialImage: <Avatar name="nft1" />,
      name: "NFT Name",
      link: "#",
      handle: "@creator1",
      cost: "12 USDC",
      left: 15,
    },
  ]

  const user = React.useContext(UserContext).user
  return (
    <div>
      <div className="min-h-[60vh] w-screen overflow-hidden relative">
        <div className="flex flex-col justify-between gap-10 relative min-h-[60vh] rounded-xl w-[90%] mx-auto mb-10 mt-20 p-10 overflow-hidden bg-secondary">
          <div className="animation-wrapper">
            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
            <div className="particle particle-4" />
          </div>
          <h1 className="md:text-[5vw] text-4xl md:max-w-[60%] font-black text-accent leading-tight z-10">
            Earn with your fav creators. <span className="font-handlee">Seamlessly.</span>
          </h1>
          {user.isLoggedIn ? (
            <div className="flex gap-20 z-10">
              <Button title="Go to dashboard" className="md:text-4xl md:!p-5 md:!px-10 text-xl" />
            </div>
          ) : (
            <div className="flex gap-20 z-10">
              <Button title="Invest now!" className="md:text-4xl md:!p-5 md:!px-10 text-xl" />
              <Button
                title="I'm a creator"
                className="md:text-4xl md:!p-5 md:!px-10 text-xl"
                variant="secondary"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-10 relative min-h-[60vh] rounded-xl w-[90%] mx-auto my-10 overflow-hidden bg-slate-800 p-10">
          <h1 className="text-4xl font-black text-accent">Featured Creators</h1>
          <div className="flex flex-wrap justify-evenly gap-10">
            {featuredNFTs.map((data, index) => (
              <Hoverable>
                <NFTDisplayCard {...data} key={index} />
              </Hoverable>
            ))}
          </div>
          <Link href="/marketplace">
            <Button title="Explore More!" className="w-fit mx-auto" />
          </Link>
        </div>
        <div className="flex justify-between items-stretch relative min-h-[60vh] rounded-xl w-[90%] mx-auto my-10 p-10 overflow-hidden border-4 border-[#ff8dd1]">
          <div className="bg-[#ff8dd1] p-10 rounded-xl flex gap-10 flex-col md:max-w-[40%]">
            <h1 className="text-primary text-7xl font-black">Feature 1</h1>
            <p className="text-xl text-primary">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque reprehenderit porro
              ratione ut voluptatum quisquam voluptatibus accusamus sint sapiente impedit.
            </p>
            <Button className="!bg-[#ffb6e2] mt-auto text-2xl !py-3" title="CONNECT" />
          </div>
        </div>
        <div className="flex justify-between items-stretch relative min-h-[60vh] rounded-xl w-[90%] mx-auto my-10 p-10 overflow-hidden bg-[#F39F5A]">
          <div></div>
          <div className="bg-primary p-10 rounded-xl flex gap-10 flex-col md:max-w-[40%]">
            <h1 className="text-[#ffc494] text-7xl font-black">Feature 1</h1>
            <p className="text-xl text-[#ffc494]">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque reprehenderit porro
              ratione ut voluptatum quisquam voluptatibus accusamus sint sapiente impedit.
            </p>
            <Button className="bg-[#ffc494] mt-auto text-2xl !py-3" title="CONNECT" />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <h1>What our users have to say</h1>
        </div>
      </div>
    </div>
  )
}

export default HomePage

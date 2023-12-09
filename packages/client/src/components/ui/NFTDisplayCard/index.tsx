import React from "react"
import Image from "next/image"
import Link from "next/link"

import { MdStarBorder, MdMoney, MdCardMembership, MdStar } from "react-icons/md"

export interface NFTDisplayCardProps {
  image: string
  socialImage: string
  name: string
  link: string
  handle: string
  cost: string
  left: number
}

const NFTDisplayCard: React.FC<NFTDisplayCardProps> = ({
  image,
  socialImage,
  name,
  link,
  handle,
  cost,
  left,
}) => {
  return (
    <Link href={link}>
      <div className="relative min-h-[360px] w-72 p-2 rounded-xl border border-accent bg-primary">
        <div className="relative h-64 w-full rounded-xl overflow-hidden">
          <Image fill src={image} alt="" />
        </div>
        <div className="my-2 flex flex-col">
          <div className="flex items-center gap-2">
            <Image
              src={socialImage}
              height={40}
              width={40}
              className="rounded-full aspect-square h-min"
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-accent">{name}</h1>
              <p className="text-opacity-40 text-accent font-bold">{handle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <p className="text-md text-primary font-medium bg-offset p-1 rounded-md w-fit items-center justify-center flex gap-2">
              <MdMoney />
              {cost}
            </p>
            <p className="text-md text-primary font-medium bg-offset p-1 rounded-md w-fit items-center justify-center flex gap-2">
              <MdCardMembership className="text-red-100" />
              {left} left
            </p>
          </div>
        </div>
        <div
          className="absolute top-1/4 left-0 -translate-x-1/2 p-2 bg-primary rounded-full text-accent shadow-2xl border-2"
          style={{
            borderColor: {
              1: "#FFD700",
              2: "#C0C0C0",
              3: "#CD7F32",
            }[left <= 10 ? 3 : left <= 20 ? 2 : 1],
          }}
        >
          <MdStar
            style={{
              height: "40px",
              width: "40px",
              color: {
                1: "#FFD700",
                2: "#C0C0C0",
                3: "#CD7F32",
              }[left <= 10 ? 3 : left <= 20 ? 2 : 1],
            }}
          />
        </div>
      </div>
    </Link>
  )
}

export default NFTDisplayCard

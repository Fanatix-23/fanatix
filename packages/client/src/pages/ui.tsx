import React from "react"
import clsx from "clsx"
import Image from "next/image"

import Bar from "@/components/ui/bar"
import Button from "@/components/ui/button"
import Hero from "@/components/ui/hero"
import Hoverable from "@/components/ui/hoverable"
import Modal from "@/components/ui/modal"
import Input from "@/components/ui/input"

import { MdAllInclusive, MdStarBorder } from 'react-icons/md'
import Testimonial from "@/components/ui/testimonial"
import NFTDisplayCard from "@/components/ui/NFTDisplayCard"
import InfoCard from "@/components/ui/infoCard"


const ui = () => {
  return (
    <div
      className="min-h-screen min-w-screen font-sans"
    >
      <Image
        src="https://lensv2.cdn.prismic.io/lensv2/39d8234c-4674-4326-9991-16a380e0e803_creators-hero.svg"
        fill
        objectFit="cover"
        alt=""
        className="fixed top-0 left-0 w-screen h-screen -z-10"
      />
      <Hero
        title="UI Components"
      />
      <Bar
        color="#1E2B53"
      >
        <div className="flex flex-col gap-5 md:max-w-[60%]">
          <h1 className="text-7xl font-bold text-accent">Buttons</h1>
          <p className="text-2xl font-medium text-secondary">
            These are the available buttons for the project.
          </p>
        </div>
        <div className="flex gap-3 h-min flex-wrap">
          <Button title="Primary" />
          <Button title="Secondary" variant="secondary" />
          <Button title="Link" variant="link" />
          <Button title="External Link" variant="external_link" />
        </div>
      </Bar>
      <Bar
        color="#2D437F"
      >
        <div className="flex flex-col justify-center gap-5 md:max-w-[60%]">
          <h1 className="text-7xl font-bold text-accent">Cards</h1>
          <p className="text-2xl font-medium text-secondary">
            These are some examples of the cards we have.
          </p>
        </div>
        <div className="flex gap-10 flex-wrap">
          {/* Simple hoverable */}
          <div className="h-64 w-64">
            <Hoverable skew={1.07} className="rounded-md">
              <div
                className={clsx("h-64 w-64 rounded-md overflow-hidden")}
                style={{
                  backgroundImage: `url(/image/nft2.jpg)`,
                }}
              ></div>
            </Hoverable>
          </div>
          {/* Plain with image */}
          <NFTDisplayCard 
            image="/image/nft1.jpg"
            socialImage="/image/nft2.jpg"
            name="Kanye West"
            link="#"
            handle="@westernKanya"
            cost="12 USDC"
            increase="12%"
          />
          {/* Testimonial */}
          <Testimonial 
            title="Testimonial"
            image="/image/nft1.jpg"
            text="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus reprehenderit, eum inventore cum repellat, dolor, nam maxime corrupti quasi eius sint? Veniam debitis repudiandae repellendus corporis quisquam magnam excepturi iste?"
          />
          {/* InfoCard */}
          <InfoCard 
            title="Current Rate"
            info="120 USDC"
            icon= {(
              <MdAllInclusive />
            )}
            className="bg-primary border border-accent rounded-md"
          />
        </div>
      </Bar>
      <Bar
        color="#1E2B53"
      >
        <div className="flex flex-col justify-center gap-5 md:max-w-[60%]">
          <h1 className="text-7xl font-bold text-accent">Modals</h1>
          <p className="text-2xl font-medium text-secondary">
            These are some examples of the modals we have.
          </p>
        </div>
        <div>
          <Modal />
        </div>
      </Bar>
      <Bar
        color="#2D437F"
      >
        <div className="flex flex-col justify-center gap-5 md:max-w-[60%]">
          <h1 className="text-7xl font-bold text-accent">Inputs</h1>
          <p className="text-2xl font-medium text-secondary">
            These are some examples of the inputs we have.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-accent font-lg font-semibold">
          <p>Simple Input</p>
          <Input name="simpleInput" placeholder="Simple Input" />
          <p>Simple Number</p>
          <Input name="simpleNumber" placeholder="0" type="number" />
          <p>Step Number</p>
          <Input name="simpleNumber" type="number" variant="secondary"/>
        </div>
      </Bar>
      {/* <Slider /> */}
    </div>
  )
}

export default ui

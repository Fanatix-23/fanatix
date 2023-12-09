import React, { useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import {ethers} from 'ethers'
import {contractAddress, abi} from '../../assets/abi/fanatix.json';
import MetamaskIcon from "@/assets/svg/wallets/metamask.svg"
import { metamaskWallet, useConnect, useConnectionStatus , useWallet} from "@thirdweb-dev/react"

const metamask = metamaskWallet()

const WalletConnection = () => {
  const router = useRouter()

  const connect = useConnect()
  const connectionStatus = useConnectionStatus()

  const handleConnection = async () => {
    const wallet = await connect(metamask, {})
    console.log("Connected: ", wallet)
  }
  
  const mintingContract = async() => {
    const contract = new ethers.Contract(contractAddress, abi, useWallet);
    await contract.initialize("tokenURI");
    await contract.createTier(1, 10);
    await contract.createTier(2, 10);
    await contract.createTier(3, 10);
    console.log("contract created");
  }

  useEffect(() => {
    if (connectionStatus === "connected") {
      mintingContract();
      console.log("Wallet connected")
      router.push("/creator/profile")
    }
  }, [connectionStatus])

  return (
    <div className="center gap-4 min-w-[360px]">
      {connectionStatus === "connecting" ? <div className="bg-white rounded-md w-12 h-12" /> : null}
      {connectionStatus === "connecting" ? (
        <div className="flex-1 overflow-hidden h-[3px] bg-white rounded-md">
          <div className="bg-primary h-[3px] w-[25%] signing-loader" />
        </div>
      ) : null}
      <button className=" text-white cursor-pointer" onClick={() => handleConnection()}>
        <Image src={MetamaskIcon} width={64} height={64} alt="" />
      </button>
    </div>
  )
}

export default WalletConnection

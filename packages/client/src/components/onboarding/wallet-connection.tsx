import React, { useEffect, useContext } from "react"
import Image from "next/image"
import axios from "axios"
import { useRouter } from "next/router"
import {ethers} from 'ethers'
import {contractAddress, abi} from '../../assets/abi/fanatix.json';
import MetamaskIcon from "@/assets/svg/wallets/metamask.svg"
import {
  metamaskWallet,
  useConnect,
  useConnectionStatus,
  useUser,
  useWallet,
} from "@thirdweb-dev/react"
import { UserContext } from "@/components/layout"
import { toast } from "react-toastify"

const metamask = metamaskWallet()

/// pass something to store the contract or pass to database
// const WalletConnection = ({useContract}) => {
  const WalletConnection = () => {
  const router = useRouter()

  const connect = useConnect()
  const connectionStatus = useConnectionStatus()
  const userWallet = useWallet()
  const userContext = useContext(UserContext)
  const user = userContext?.user
  const setUser = userContext?.setUser

  const handleConnection = async () => {
    const wallet = await connect(metamask, {})
    console.log("Connected: ", wallet)
  }

  useEffect(() => {
    if (connectionStatus === "connected") {
      mintingContract();
      console.log("Wallet connected")
      userWallet?.getAddress().then(async (address) => {
        setUser &&
          setUser({
            isLoggedIn: true,
            isCreator: false,
            user: {
              walletAddress: address,
            },
            creator: {
              lensId: "",
            },
          })
        const dbData = await axios.post("/api/getData", { data: user })
        if (!dbData.data.value) {
          const social = await axios.post("/api/getSocials", { data: user }).then((res) => res.data)
          if (!social.data.Wallet?.socials) {
            toast.error("You need a lens account to become a creator")
              setUser({
                isLoggedIn: false,
                isCreator: false,
                user: {
                  walletAddress: "",
                },
                creator: {
                  lensId: "",
                },
              })
            userWallet.disconnect()
          } else {
              setUser({
                isLoggedIn: true,
                isCreator: true,
                user: {
                  walletAddress: address,
                },
                creator: {
                  lensId: social.data.Wallet.socials[0].profileName,
                },
              })
            await axios.post("/api/saveData", {
              data: {
                isLoggedIn: true,
                isCreator: true,
                user: {
                  walletAddress: address,
                },
                creator: {
                  lensId: social.data.Wallet.socials[0].profileName,
                },
              },
            })
          }
        } else {
          console.log("Got the values: ", dbData.data.value.data)
          setUser(dbData.data.value.data)
        }
      })
      router.push("/home")
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

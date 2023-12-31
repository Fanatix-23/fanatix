import React, { useEffect, useContext } from "react"
import Image from "next/image"
import axios from "axios"
import { useRouter } from "next/router"
import { Contract, ethers } from "ethers"
import { contractAddress, abi } from "../../assets/abi/fanatix.json"
import MetamaskIcon from "@/assets/svg/wallets/metamask.svg"
import {
  metamaskWallet,
  useConnect,
  useConnectionStatus,
  useSigner,
  useUser,
  useWallet,
} from "@thirdweb-dev/react"
import { UserContext } from "@/components/layout"
import { toast } from "react-toastify"
import { mintingContract } from "../contract_info/contract_info"
import Button from "../ui/button"

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
  const signer = useSigner()

  const handleConnection = async () => {
    const wallet = await connect(metamask, {})
    console.log("Connected: ", wallet)
  }

  useEffect(() => {
    console.log("signer: ", signer)
    if (signer) {
      let signerAddress: string
      signer.getAddress().then((address) => {
        signerAddress = address
      })
      userWallet?.getAddress().then(async (address) => {
        setUser({
          isLoggedIn: true,
          isCreator: false,
          user: {
            walletAddress: address,
          },
          creator: {
            lensId: "",
            contract: signerAddress,
          },
        })
        const dbData = await axios.post("/api/getData", {
          data: {
            walletAddress: address,
          },
        })
        if (!dbData.data.value) {
          setUser({
            isLoggedIn: true,
            isCreator: false,
            user: {
              walletAddress: address,
            },
            creator: {
              lensId: "",
              contract: signerAddress,
            },
          })
          await axios.post("/api/saveData", {
            data: {
              isLoggedIn: true,
              isCreator: false,
              user: {
                walletAddress: address,
              },
              creator: {
                lensId: "",
                contract: signerAddress,
              },
            },
          })
        } else {
          setUser(dbData.data.value.data)
        }
      })
      router.push("/home")
    }
  }, [signer])

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

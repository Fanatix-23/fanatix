import React, { useContext, useEffect } from "react"
import axios from "axios"
import { Contract, ethers } from "ethers"
import Image from "next/image"
import { useRouter } from "next/router"
import { toast } from "react-toastify"

import MetamaskIcon from "@/assets/svg/wallets/metamask.svg"
import { usePushContext } from "@/providers/push-context"
import {
  metamaskWallet,
  useConnect,
  useConnectionStatus,
  useSigner,
  useUser,
  useWallet,
} from "@thirdweb-dev/react"

import { UserContext } from "@/components/layout"

import { abi, contractAddress } from "../../assets/abi/fanatix.json"
import { mintingContract } from "../contract_info/contract_info"
import Button from "../ui/button"

const metamask = metamaskWallet()

/// pass something to store the contract or pass to database
// const WalletConnection = ({useContract}) => {
const WalletConnection = () => {
  const router = useRouter()

  const {
    initialize,
    group: { createGroup },
  } = usePushContext()
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
        console.log("Data from DB: ", dbData?.data?.value)
        if (!dbData.data.value) {
          const social = await axios
            .post("/api/getSocials", {
              data: {
                isLoggedIn: true,
                isCreator: false,
                user: {
                  walletAddress: address,
                },
                creator: {
                  lensId: "",
                  contract: "",
                },
              },
            })
            .then((res) => res.data)
          console.log("Socials Data: ", social.data)
          if (!social.data.Wallet?.socials) {
            console
            toast.error("You need a lens account to become a creator")
            setUser({
              isLoggedIn: false,
              isCreator: false,
              user: {
                walletAddress: "",
              },
              creator: {
                lensId: "",
                contract: "",
              },
            })
            userWallet.disconnect()
          } else {
            console.log("Creating contract")
            const contract = await mintingContract(signer)
            setUser({
              isLoggedIn: true,
              isCreator: true,
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
                isCreator: true,
                user: {
                  walletAddress: address,
                },
                creator: {
                  lensId: "",
                  contract: signerAddress,
                },
              },
            })

            // Create a new group for the creator
            await initialize()
            await createGroup(user?.creator?.lensId ?? "", {
              admins: [signerAddress],
              description: "Group for the creator",
              private: false,
            })
          }
        } else {
          console.log("Got the values: ", dbData.data.value.data)
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

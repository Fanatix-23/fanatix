import { mintingNFT } from "@/components/contract_info/contract_info"
import NFTDisplayCard from "@/components/ui/NFTDisplayCard"
import Button from "@/components/ui/button"
import Hoverable from "@/components/ui/hoverable"
import { useWallet } from "@thirdweb-dev/react"
import axios from "axios"
import Avatar from "boring-avatars"
import { useRouter } from "next/router"
import React from "react"

const NFTDetails = () => {
  const [creator, setCreator] = React.useState<any>({})
  const [loading, setLoading] = React.useState(true)
  const [userWallet, setUserWallet] = React.useState<string>("")
  const router = useRouter()
  useWallet()
    ?.getAddress()
    .then((res) => {
      setUserWallet(res)
    })
  React.useEffect(() => {
    const id = router.query.slug
    console.log(id)
    axios
      .post("/api/getDataByID", {
        data: {
          lensId: id,
        },
      })
      .then((res) => {
        console.log(res.data)
        setCreator(res.data.value.data)
      })
    console.log(creator, userWallet)
    setLoading(false)
  }, [])

  if (loading || !creator) return "..."
  return (
    <div className="flex flex-col items-center justify-center gap-10 py-20">
      <NFTDisplayCard
        cost={"1ETH"}
        handle={creator.creator?.lensId}
        image={<Avatar name={creator.user?.walletAddress} size={250} />}
        left={creator.creator?.NFTleft || 30}
        link={`/marketplace/${creator.creator?.lensId}`}
        name={creator.user?.walletAddress}
        socialImage={<Avatar name={creator.user?.walletAddress} />}
      />
      <Button
        title="Mint now!"
        onClick={() => {
          mintingNFT(creator.user?.walletAddress, userWallet)
          axios.post("/api/updateNFTleft", {
            data: {
              walletAddress: creator.user?.walletAddress,
              NFTleft: creator.creator?.NFTleft,
            },
          })
        }}
      />
    </div>
  )
}

export default NFTDetails

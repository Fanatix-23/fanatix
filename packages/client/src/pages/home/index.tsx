import React from "react"
import { useRouter } from "next/router"
import { Tab } from "@headlessui/react"
import { UserContext } from "@/components/layout"

import Button from "@/components/ui/button"
import Avatar from "boring-avatars"

const Home = () => {
  const userContext = React.useContext(UserContext);
  const user = userContext?.user;
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    if (!user.isLoggedIn) {
      router.push("/")
    }

    if (user.isCreator) {
      router.push("/home/creator")
    }

    console.log(user)
    // setLoading(false)
  }, [])

  if (loading) return "..."

  return (
    <div>
      <div className="min-h-[100vh] w-screen overflow-hidden relative">
        <div className="flex flex-col justify-between gap-10 relative rounded-xl w-[90%] mx-auto mb-10 mt-20 p-10 overflow-hidden bg-secondary">
          <div className="animation-wrapper">
            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
            <div className="particle particle-4" />
          </div>
          <h1 className="md:text-[5vw] text-4xl md:max-w-[60%] font-black text-accent leading-tight z-10">
            Welcome, <span className="font-handlee">{user?.creator?.lensId}</span>
          </h1>
        </div>
        <div className="flex gap-5 mx-auto w-[90%] relative my-10">
          <div className="bg-primary p-10 flex flex-col gap-5 items-center justify-center rounded-xl">
            <Avatar name={user?.user.walletAddress} size={300} />
            <h1 className="text-accent text-4xl ">{user?.creator?.lensId}</h1>
            <p className="text-offset text-lg ">{user?.user.walletAddress}</p>
          </div>
          <div className="w-full bg-offset p-10 rounded-xl">
            <Tab.Group>
              <Tab.List className="bg-primary mx-auto flex gap-3 justify-evenly w-fit p-3 rounded-xl">
                <Tab className={({selected}) => {
                  return `outline-none focus:outline-none p-3 rounded-xl text-md font-semibold text-offset ${selected ? "bg-offset !text-accent" : ""}`
                }}>User Details</Tab>
                <Tab className={({selected}) => {
                  return `outline-none focus:outline-none p-3 rounded-xl text-md font-semibold text-offset ${selected ? "bg-offset !text-accent" : ""}`
                }}>Manage NFTs</Tab>
              </Tab.List>
              <Tab.Panel>
                <div className="flex flex-col gap-5 p-5">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-accent text-2xl">Name</h1>
                    <p className="text-offset text-lg">{user?.creator?.lensId}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-accent text-2xl">Wallet Address</h1>
                    <p className="text-offset text-lg">{user?.user.walletAddress}</p>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

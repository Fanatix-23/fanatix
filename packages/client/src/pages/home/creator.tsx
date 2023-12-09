import React from "react"
import { useRouter } from "next/router"

import Avatar from "boring-avatars"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"

import { useUserContext } from "@/providers/user-context"

const Creator = () => {
  const user = useUserContext()
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    if (!user.isLoggedIn) {
      router.push("/")
    }

    if (!user.user.isCreator) {
      router.push("/home")
    }
    setLoading(false)
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
            Welcome, <span className="font-handlee">{user.user.name}</span>
          </h1>
        </div>
        <div className="flex gap-5 mx-auto w-[90%] relative my-10">
          <div className="bg-primary p-10 flex flex-col gap-5 items-center justify-center rounded-xl">
            <Avatar name={user.user.walletAddress} size={300} />
            <h1 className="text-accent text-4xl ">{user.user.name}</h1>
            <p className="text-offset text-lg ">{user.user.walletAddress}</p>
          </div>
          <div className="w-full bg-offset p-10 rounded-xl">
            <Tabs>
              <TabList style={{
                color: '#2E4374'
              }}>
                <Tab selectedClassName="text-accent bg-primary border border-accent rounded-t-md">User Details</Tab>
                <Tab selectedClassName="text-accent bg-primary border border-accent rounded-t-md">Manage NFTs</Tab>
                <Tab selectedClassName="text-accent bg-primary border border-accent rounded-t-md">Revenue Sharing</Tab>
                <Tab selectedClassName="text-accent bg-primary border border-accent rounded-t-md">Stream</Tab>
              </TabList>
              <TabPanel>
                <div className="flex flex-col gap-5 p-5">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-accent text-2xl">Name</h1>
                    <p className="text-offset text-lg">{user.user.name}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-accent text-2xl">Wallet Address</h1>
                    <p className="text-offset text-lg">{user.user.walletAddress}</p>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Creator

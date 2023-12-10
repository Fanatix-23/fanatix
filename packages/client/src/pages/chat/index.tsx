import React, { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import { usePushContext } from "@/providers/push-context"
import { IFeeds } from "@pushprotocol/restapi"
import { useSigner } from "@thirdweb-dev/react"

import { UserContext } from "@/components/layout"
import Avatar from "boring-avatars"
import Button from "@/components/ui/button"

const ChatPage = () => {
  const router = useRouter()
  const userContext = React.useContext(UserContext)
  const {
    user: { creator },
  } = userContext
  const signer = useSigner()

  const [chats, setChats] = useState<IFeeds[]>([])

  const {
    user,
    initialize,
    chat: { chatOverview },
    group: { createGroup },
    ...ctx
  } = usePushContext()

  console.log(ctx)
  useEffect(() => {
    if (!user) {
      console.log("Initializing...")
      initialize()
    }
    console.log(user)
  }, [user])

  useEffect(() => {
    if (user) {
      console.log("User: ", user)

      const fetchChats = async () => {
        const chats = await chatOverview()
        console.log("Chats: ", chats)
        if (chats) {
          const { chats: c, requests } = chats
          console.log(c, requests)
          setChats(c)

          if (!c || c.length === 0) {
            if (!signer) {
              console.log("No signer")
              return
            }
            const signerAddress = await signer.getAddress()

            console.log("No chat detected")
            const dbData = await axios.post("/api/getData", {
              data: {
                walletAddress: signerAddress,
              },
            })
            console.log("Query: ", dbData?.data?.value)
            // if (dbData?.data?.value) {
            //   const { isCreator } = dbData.data.value.data
            //   if (isCreator) {
            console.log("Creator: ", creator)
            createGroup(creator?.lensId ?? "fanatix", {
              description: "Fanatix Group",
              image:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
              admins: [],
              private: false,
              members: [],
            })
            // }
            // }
          }
        }
      }

      fetchChats()
    }
  }, [user])

  return (
    <div className="min-h-screen center">
      {chats.map((chat) => {
        return (
          <div key={chat.chatId}>
            <div className="bg-primary p-4 center flex-col rounded-lg gap-4">
              <Avatar size={40} name={chat.name ?? "fanatix chats"} variant="beam" />
              <div className="flex flex-col text-center gap-2">
                <h1 className="text-accent text-2xl">{chat?.name ?? "Fanatix"}</h1>
                <p className="text-white">{chat?.wallets?.[0] ?? "0xb299b...e45160"}</p>
              </div>
              <Button
                onClick={() => {
                  router.push(`/chat/${chat.chatId}`)
                }}
              >
                Enter chat
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChatPage

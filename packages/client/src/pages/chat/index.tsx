import React, { useEffect } from "react"
import axios from "axios"

import { usePushContext } from "@/providers/push-context"
import { useSigner } from "@thirdweb-dev/react"

import { UserContext } from "@/components/layout"

const ChatPage = () => {
  const userContext = React.useContext(UserContext)
  const {
    user: { creator },
  } = userContext
  const signer = useSigner()

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

          if (!c || c.length === 0) {
            if (!signer) {
              console.log("No signer")
              return
            }
            const signerAddress = await signer.getAddress()

            console.log("No chat detected")
            const dbData = await axios.post("/api/getData", {
              data: {
                // walletAddress: signerAddress,
              },
            })
            console.log("Query: ", dbData?.data?.value)
            if (dbData?.data?.value) {
              const { isCreator } = dbData.data.value.data
              if (isCreator) {
                console.log("Creator: ", creator)
                createGroup(creator?.lensId ?? "fanatix", {
                  description: "Fanatix Group",
                  image:
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC",
                  admins: [signerAddress],
                  private: false,
                  members: [],
                })
              }
            }
          }
        }
      }

      fetchChats()
    }
  }, [user])

  return <div></div>
}

export default ChatPage

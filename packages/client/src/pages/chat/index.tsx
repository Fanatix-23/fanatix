import React, { useEffect } from "react"
import axios from "axios"

import { usePushContext } from "@/providers/push-context"
import { useSigner } from "@thirdweb-dev/react"

import { UserContext } from "@/components/layout"

const ChatPage = () => {
  const userContext = React.useContext(UserContext)
  const {
    user: { isCreator, creator },
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
            console.log("No chat detected")
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
            if (isCreator) {
              console.log("Creator: ", creator)
              if (!signer) {
                console.log("No signer")
                return
              }
              const signerAddress = await signer.getAddress()
              createGroup(creator?.lensId ?? "fanatix", {
                description: "Fanatix Group",
                admins: [signerAddress],
                private: false,
              })
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

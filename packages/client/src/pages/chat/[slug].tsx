import React from "react"
import { useRouter } from "next/router"

import ChatArea from "@/components/chat/area"
import ChatMessenger from "@/components/chat/messenger"

const ChatSlug = () => {
  const router = useRouter()
  const { slug } = router.query

  console.log(slug)

  return (
    <>
      <div className="center w-full min-h-screen ">
        <div className="relative w-4/5 h-[620px] rounded-lg center bg-primary">
          <ChatArea chatId={slug as string} />
          <ChatMessenger chatId={slug as string} />
        </div>
      </div>
    </>
  )
}

export default ChatSlug

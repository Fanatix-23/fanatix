import React, { useRef } from "react"
import { MessageList, MessageType } from "react-chat-elements"

import { usePushContext } from "@/providers/push-context"

interface ChatAreaProps {
  chatId: string
}

const dataSource: MessageType[] = [
  {
    type: "text",
    id: 1,
    position: "left",
    text: "Uff finallyyyy,,,",
    date: new Date(),
    title: "Gkab07",
    focus: false,
    titleColor: "#000000",
    forwarded: false,
    replyButton: true,
    removeButton: true,
    status: "sent",
    notch: true,
    retracted: false,
  },
  {
    type: "text",
    id: 2,
    position: "right",
    text: "Chal gya projvt",
    date: new Date(),
    title: "0xKarthik",
    focus: false,
    titleColor: "#000000",
    forwarded: false,
    replyButton: true,
    removeButton: true,
    status: "sent",
    notch: true,
    retracted: false,
  },
]

const ChatArea: React.FC<ChatAreaProps> = ({ chatId }) => {
  const {
    chat: { fetchChats },
  } = usePushContext()
  const mssgList = useRef(null)

  React.useEffect(() => {
    if (chatId) {
      // const ft = async () => {
      //   const {} = await fetchChats(chatId)
      // }
    }
  }, [chatId])

  return (
    <div className="w-full">
      <div className="px-4 py-6">
        <MessageList
          referance={mssgList}
          toBottomHeight={"100%"}
          className="message-list"
          lockable={true}
          dataSource={dataSource}
        />
      </div>
    </div>
  )
}

export default ChatArea

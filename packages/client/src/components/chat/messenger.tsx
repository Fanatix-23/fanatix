import { FC, useRef, useState } from "react"
import Image from "next/image"
import { MdSend } from "react-icons/md"
import TextareaAutosize from "react-textarea-autosize"

import useMediaQuery from "@/hooks/use-media-query"
import { usePushContext } from "@/providers/push-context"

import Button from "@/components/ui/button"

interface ChatMessengerProps {
  chatId: string
}

const ChatMessenger: FC<ChatMessengerProps> = ({ chatId }) => {
  const isLessThan768 = useMediaQuery("max-width: 768px")

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const {
    message: { sendMessage: pushMssg },
  } = usePushContext()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>("")

  const sendMessage = async () => {
    setIsLoading(true)
    console.log(chatId)
    setTimeout(() => {
      setIsLoading(false)
      setInput("")
    }, 1000)
    pushMssg(chatId, input)
  }

  return (
    <div className="absolute bottom-0 w-full justify-between bg-primary-black p-3 md:gap-12 md:px-8 md:py-4 flex-row">
      <div className="center grow gap-4">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={1}
          minRows={1}
          maxRows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type your message here...`}
          className="w-full resize-none rounded border-0 bg-primary-white px-4 py-1 text-gray-900 outline-none ring-0 placeholder:text-secondary-black/50"
        />
      </div>
      <div className="">
        <Button
          disabled={isLoading}
          className="px-6 py-1 text-sm"
          onClick={sendMessage}
          type="submit"
        >
          {isLessThan768 ? <MdSend /> : "Send"}
        </Button>
      </div>
    </div>
  )
}

export default ChatMessenger

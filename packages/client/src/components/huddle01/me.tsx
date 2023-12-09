import { FC, useEffect, useState } from "react"
import Avatar from "boring-avatars"
import clsx from "clsx"
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai"
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs"

import { useDataMessage, useLocalAudio, useLocalPeer, useLocalVideo } from "@huddle01/react/hooks"
import { Role } from "@huddle01/server-sdk/auth"

import VideoElem from "./video"

const LocalPeerData: FC = () => {
  const displayName: string = "Me"

  const { track: cam, enableVideo, disableVideo, isVideoOn } = useLocalVideo()
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio()

  const [cursorPosition, setCursorPosition] = useState({
    top: 0,
    left: 0,
  })

  const { sendData } = useDataMessage()

  const { role, updateMetadata } = useLocalPeer<{
    displayName: string
    avatarUrl: string
  }>()

  useEffect(() => {
    updateMetadata({
      displayName: displayName,
      avatarUrl: `/0.png`,
    })
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const cursorWidth = 200 // adjust as needed
      const cursorHeight = 150 // adjust as needed
      const adjustedTop = Math.min(e.clientY, screenHeight - cursorHeight)
      const adjustedLeft = Math.min(e.clientX, screenWidth - cursorWidth)

      setCursorPosition({
        top: adjustedTop + 15,
        left: adjustedLeft + 15,
      })
      sendData({
        to: "*",
        payload: JSON.stringify({
          top: adjustedTop + 15,
          left: adjustedLeft + 15,
        }),
        label: "cursor",
      })
    }
    document.addEventListener("mousemove", onMouseMove)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
    }
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div
          style={{
            position: "absolute",
            ...cursorPosition,
            zIndex: 1000,
          }}
        >
          <div className="relative flex w-32 h-28 rounded-lg bg-gray-200 justify-center items-center">
            {isVideoOn ? <VideoElem track={cam} /> : <Avatar name={displayName ?? "Guest"} />}
            <div
              className={clsx(
                "absolute bottom-2 left-2 px-2 rounded-lg",
                isVideoOn ? "bg-gray-800/60 text-white" : "text-black"
              )}
            >
              {displayName !== "" ? displayName : "Guest"}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className="p-1 rounded-lg"
            onClick={() => {
              isVideoOn ? disableVideo() : enableVideo()
            }}
          >
            {isVideoOn ? "Cam:ON" : "Cam:OFF"}
          </button>
          <button
            className="p-1 rounded-lg"
            onClick={() => {
              isAudioOn ? disableAudio() : enableAudio()
            }}
          >
            {isAudioOn ? "Mic:ON" : "Mic:OFF"}
          </button>
        </div>
        {role === Role.HOST ? (
          <div className="absolute center bottom-12 bg-white/10 p-4 rounded-lg gap-4">
            <button
              className={clsx(
                "rounded-lg p-2",
                isAudioOn ? "bg-primary text-accent" : "bg-red-500/100 text-white"
              )}
              onClick={() => {
                if (isAudioOn) {
                  disableAudio()
                } else {
                  enableAudio()
                }
              }}
            >
              {isAudioOn ? <AiOutlineAudio size={24} /> : <AiOutlineAudioMuted size={24} />}
            </button>
            <button
              className={clsx(
                "rounded-lg p-2",
                isVideoOn ? "bg-primary text-accent" : "bg-red-500/100 text-white"
              )}
              onClick={() => {
                if (isVideoOn) {
                  disableVideo()
                } else {
                  enableVideo()
                }
              }}
            >
              {isVideoOn ? <BsCameraVideo size={24} /> : <BsCameraVideoOff size={24} />}
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default LocalPeerData

/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react"
import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import { HUDDLE01_API_KEY } from "@/config/env"
import { useRoom } from "@huddle01/react/hooks"
import { AccessToken, Role } from "@huddle01/server-sdk/auth"

import Input from "@/components/ui/input"

const Huddle01Stream = () => {
  const router = useRouter()

  const { joinRoom } = useRoom({
    onJoin: () => {
      console.log({
        displayName: "guest",
        avatarUrl: `/0.png`,
      })
    },
  })

  const createAndJoinRoom = async (title?: string) => {
    const response = await axios.post(
      "https://api.huddle01.com/api/v1/create-room",
      {
        title: title ?? "Stream",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": HUDDLE01_API_KEY,
        },
      }
    )

    const data = response.data

    console.log({ data })

    const { roomId } = data.data
    const userToken = await createAccessToken(roomId)
    console.log("userToken", userToken)

    // Socket connection to AI model
    const symblWebSocketUrl = `wss://api.symbl.ai/v1/streaming/${roomId}?access_token=${userToken}`
    const socket = new WebSocket(symblWebSocketUrl)

    // @ts-ignore
    window.huddle01ws = socket

    socket.onopen = () => {
      console.log("WebSocket connection established with Symbl.ai")
    }

    await joinRoom({
      roomId: roomId,
      token: userToken,
    })

    // TODO: After joining room, redirect to stream page after the Symbl websocket connection is established
    socket.onmessage = (io) => {
      console.log(io)
      if (io.type === "started_listening") {
        const startRequestMessage = {
          type: "start_request",
          config: {
            confidenceThreshold: 0.7,
            detectEntities: true,
            languageCode: "en-US",
            meetingTitle: "Streaming API Meeting",
            sentiment: true,
          },
          customVocabulary: [],
          disconnectOnStopRequest: true,
          disconnectOnStopRequestTimeout: 600,
          insightTypes: ["question", "action_item"],
          noConnectionTimeout: 600,
          speaker: {
            name: "Creator",
            userId: userToken,
          },
          trackers: {
            enableAllTrackers: true,
            interimResults: true,
          },
        }
        socket.send(JSON.stringify(startRequestMessage))
      }

      if (io.type === "conversation_created") {
        const { conversationId } = io.data
        // @ts-ignore
        window.huddle01wsConversationId = conversationId
        console.clear()
        console.log("conversationId", conversationId)
        router.push(`/stream/${roomId}`)
      }
    }
  }

  const createAccessToken = async (userRoomId: string) => {
    const accessToken = new AccessToken({
      apiKey: HUDDLE01_API_KEY,
      roomId: userRoomId,
      role: Role.HOST,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: { cam: true, mic: true, screen: true },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
    })
    const userToken = await accessToken.toJwt()
    return userToken
  }

  return (
    <div style={{ pointerEvents: "all", display: "flex" }}>
      <div className="flex m-2 min-h-screen w-screen justify-center items-center">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <>
                <>
                  <Input
                    name="displayName"
                    onChange={(e) => {
                      console.log("Data being set to", e.target.value)
                    }}
                    placeholder="Stream name (eg: My Stream)"
                    className="rounded-lg border-2 border-gray-200 p-2"
                  />
                  <button
                    className="rounded-lg bg-primary text-accent w-full p-2"
                    onClick={async () => {
                      await createAndJoinRoom()
                    }}
                  >
                    Create Stream
                  </button>
                </>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Huddle01Stream

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
        displayName: "Creator",
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
    await joinRoom({
      roomId: roomId,
      token: userToken,
    })
    router.push(`/stream/${roomId}`)
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
    <button
      className="rounded-lg bg-primary text-accent w-full p-2"
      onClick={async () => {
        await createAndJoinRoom()
      }}
    >
      Create Stream
    </button>
  )
}

export default Huddle01Stream

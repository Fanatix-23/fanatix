import React from "react"
import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import { HUDDLE01_API_KEY } from "@/config/env"
import { useLocalPeer, usePeerIds, useRoom } from "@huddle01/react/hooks"
import { AccessToken, Role } from "@huddle01/server-sdk/auth"

import LocalPeerData from "@/components/huddle01/me"
import ShowPeers from "@/components/huddle01/peers"
import Input from "@/components/ui/input"
import Button from "@/components/ui/button"

const Huddle01Stream = () => {
  const router = useRouter()

  // const displayName: string = "Guest"

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
      // role: data.previewPeers.length > 0 ? Role.LISTENER : Role.HOST,
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
                      //   setDisplayName(e.target.value)
                    }}
                    placeholder="Enter you name"
                    className="rounded-lg border-2 border-gray-200 p-2"
                  />
                  <button
                    className="rounded-lg bg-blue-500 w-full p-2 text-white"
                    onClick={async () => {
                      await createAndJoinRoom()
                    }}
                  >
                    {"Create Stream"}
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

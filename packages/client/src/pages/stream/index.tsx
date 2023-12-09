import React from "react"
import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import { HUDDLE01_API_KEY } from "@/config/env"
import { useLocalPeer, usePeerIds, useRoom } from "@huddle01/react/hooks"
import { AccessToken, Role } from "@huddle01/server-sdk/auth"

import LocalPeerData from "@/components/huddle01/me"
import ShowPeers from "@/components/huddle01/peers"

const Huddle01Stream = () => {
  const router = useRouter()
  const { slug } = router.query

  const displayName: string = "Guest"

  const { peerIds } = usePeerIds()

  const { metadata } = useLocalPeer<{
    displayName: string
    avatarUrl: string
  }>()

  const { joinRoom, state: roomState } = useRoom({
    onJoin: () => {
      console.log({
        displayName: displayName,
        avatarUrl: `/0.png`,
      })
    },
  })

  useEffect(() => {
    if (slug && displayName !== "") {
      console.log({
        displayName: displayName,
        avatarUrl: "/0.png",
      })
    }
  }, [slug])

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
      <div className="flex m-2 justify-center">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              {slug && metadata?.displayName ? (
                <LocalPeerData />
              ) : (
                <>
                  {roomState !== "connected" ? (
                    <>
                      <input
                        value={displayName}
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
                          if (slug && typeof slug === "string") {
                            const userToken = await createAccessToken(slug)
                            await joinRoom({
                              roomId: slug,
                              token: userToken,
                            })
                          } else {
                            await createAndJoinRoom()
                          }
                        }}
                      >
                        {slug ? "Join Meeting" : "Create Meeting"}
                      </button>
                    </>
                  ) : (
                    <LocalPeerData />
                  )}
                </>
              )}
            </div>
          </div>
          {peerIds.map((peerId) => {
            return <ShowPeers peerId={peerId} key={peerId} />
          })}
        </div>
      </div>
    </div>
  )
}

export default Huddle01Stream
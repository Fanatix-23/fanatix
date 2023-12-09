import React from "react"
import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import { HUDDLE01_API_KEY } from "@/config/env"
import { useLocalPeer, usePeerIds, useRoom } from "@huddle01/react/hooks"
import { AccessToken, Role } from "@huddle01/server-sdk/auth"

import LocalPeerData from "@/components/huddle01/me"
import ShowPeers from "@/components/huddle01/peers"

const Huddle01Room = () => {
  const router = useRouter()
  const { slug } = router.query

  const { peerIds } = usePeerIds()

  const { metadata } = useLocalPeer<{
    displayName: string
    avatarUrl: string
  }>()

  const { joinRoom, state: roomState } = useRoom({
    onJoin: () => {
      console.log({
        avatarUrl: ``,
      })
    },
  })

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
      <div className="relative min-h-screen w-full center flex m-2 justify-center">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              {slug && metadata?.displayName ? (
                <LocalPeerData />
              ) : (
                <>
                  {roomState !== "connected" ? (
                    <>
                      <button
                        className="rounded-lg bg-primary w-full p-2 text-accent"
                        onClick={async () => {
                          if (slug && typeof slug === "string") {
                            const userToken = await createAccessToken(slug)
                            await joinRoom({
                              roomId: slug,
                              token: userToken,
                            })
                          }
                        }}
                      >
                        {"Join Stream"}
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

export default Huddle01Room

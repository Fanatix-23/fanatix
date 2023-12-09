import React from "react"
import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import { HUDDLE01_API_KEY, SYMBL_ACCESS_TOKEN } from "@/config/env"
import { useLocalAudio, useLocalPeer, usePeerIds, useRoom } from "@huddle01/react/hooks"
import { AccessToken, Role } from "@huddle01/server-sdk/auth"

import LocalPeerData from "@/components/huddle01/me"
import ShowPeers from "@/components/huddle01/peers"

let mediaRecorder: MediaRecorder
const chunks: Array<Blob> = []

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

  const { stream: audioStream, isAudioOn } = useLocalAudio({})

  console.log(isAudioOn, {
    audioStream,
    chunks,
  })

  useEffect(() => {
    if (isAudioOn) {
      console.log("Recording audio...")
      startRecording()
    } else {
      console.log("Stopping audio recording...")
      stopRecording()
      // saveAndTranscribe()
      sendAudioToServer()
    }
  }, [isAudioOn])

  const startRecording = () => {
    if (!audioStream) return

    mediaRecorder = new MediaRecorder(audioStream, {
      mimeType: "audio/webm",
    })

    mediaRecorder.ondataavailable = (e) => {
      console.log("Fetching audio data: ", e.data)
      chunks.push(e.data)
      if (chunks.length >= 30 || e.data.size > 120000) {
        stopRecording()
        // saveAndTranscribe()
        sendAudioToServer()
      }
    }

    mediaRecorder.start(30000)
  }

  const stopRecording = () => {
    if (!mediaRecorder) return

    mediaRecorder.stop()
  }

  // const saveAndTranscribe = () => {
  //   console.log("Saving and transcribing audio...", chunks)
  //   if (chunks.length === 0) return

  //   // Convert chunks to a Blob
  //   // const blob = new Blob(chunks, { type: "audio/mp3" })

  //   // Convert Blob to base64
  //   // const reader = new FileReader()
  //   // reader.readAsDataURL(blob)
  //   // reader.onloadend = () => {
  //   //   if (typeof reader.result !== "string") return

  //   //   const base64data = reader.result.split(",")[1]
  //   //   transcribeAudio(base64data)
  //   // }
  //   // transcribeAudio(blob)
  // }

  // const transcribeAudio = (audioData: string | Blob) => {
  //   if (!audioData) return

  //   // Send audio data to Symbl API for transcription
  //   const apiUrl = "https://api.symbl.ai/v1/process/audio"

  //   axios
  //     .post(apiUrl, audioData, {
  //       headers: {
  //         "Content-Type": "audio/mp3",
  //         Authorization: `Bearer ${SYMBL_ACCESS_TOKEN}`,
  //       },
  //     })
  //     .then((response) => {
  //       console.clear()
  //       console.log("Transcription:", response.data)
  //       // Handle response data as needed
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error)
  //       // Handle error
  //     })
  //     .finally(() => {
  //       chunks.slice(0, chunks.length)
  //     })
  // }

  const sendAudioToServer = () => {
    const formData = new FormData()
    formData.append("audio", new Blob(chunks, { type: "audio/webm" }))

    fetch("http://localhost:5001/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Transcription:", data)
        // Handle the transcription data as needed in your app
      })
      .catch((error) => {
        console.error("Error:", error)
      })
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

import React from "react"
import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"

import { HUDDLE01_API_KEY, HUDDLE01_PROJECT_ID, REVAI_ACCESS_TOKEN } from "@/config/env"
import { useLocalAudio, useLocalPeer, usePeerIds, useRoom } from "@huddle01/react/hooks"
import { AccessToken, Role } from "@huddle01/server-sdk/auth"
import { Recorder } from "@huddle01/server-sdk/recorder"

import LocalPeerData from "@/components/huddle01/me"
import ShowPeers from "@/components/huddle01/peers"

// let mediaRecorder: MediaRecorder
// const chunks: Array<Blob> = []
let socket: WebSocket

const Huddle01Room = () => {
  const router = useRouter()
  const recorder = new Recorder(HUDDLE01_PROJECT_ID, HUDDLE01_API_KEY)
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
      startRecording()
    },
    onLeave: () => {
      console.log("Left room")
      recorder.stop({ roomId: slug as string })
      socket.close()
    },
  })

  const { stream: audioStream, isAudioOn } = useLocalAudio({})

  console.log(isAudioOn, {
    audioStream,
  })

  const startRecording = async () => {
    const userToken = await createAccessToken(slug as string)

    const response = await axios.post(
      `https://api.rev.ai/speechtotext/v1/live_stream/rtmp`,
      {
        // media_url: `rtmp://live.restream.io/live/${slug}`,
        "Content-Type": "audio/x-wav",
        metadata: slug as string,
      },
      {
        headers: {
          Authorization: `Bearer ${REVAI_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    )

    const { ingestion_url, read_url, stream_name } = response.data
    socket = new WebSocket(read_url)

    // Assuming you have obtained the necessary details from the previous response
    const readUrl =
      "wss://api.rev.ai/speechtotext/v1/read_stream?read_token=Ji2CwNlLpl-1_3OhUVq1SXxgyjQ31soGqn_xPwVwllc3sFjaqYsMxP7Kg4g9JEW1"

    // Create a WebSocket connection
    const ws = new WebSocket(readUrl)

    // Handle WebSocket events
    ws.onopen = () => {
      console.log("WebSocket connection is open")
      const audioChunks: Array<Blob> = []

      const mediaRecorder = new MediaRecorder(audioStream as MediaStream)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })

        const fileReader = new FileReader()
        fileReader.onload = () => {
          const arrayBuffer = fileReader.result

          socket.send(arrayBuffer as ArrayBuffer)
        }
        fileReader.readAsArrayBuffer(audioBlob)
      }

      // Start recording
      mediaRecorder.start()
    }

    socket.onopen = () => {
      console.log("Socket connected")
      recorder.startLivestream({
        roomId: slug as string,
        token: userToken,
        rtmpUrls: [ingestion_url],
      })
    }

    socket.onmessage = (event) => {
      console.log(event.type, event.data)
    }
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

  // const sendAudioToServer = () => {
  //   const formData = new FormData()
  //   formData.append("audio", new Blob(chunks, { type: "audio/webm" }))

  //   fetch("http://localhost:5001/upload", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Transcription:", data)
  //       // Handle the transcription data as needed in your app
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error)
  //     })
  // }

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

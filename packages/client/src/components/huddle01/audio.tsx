import React, { useEffect, useRef } from "react"

interface AudioElementProps {
  deviceId?: string
  track: MediaStreamTrack | null
}

const AudioElement: React.FC<AudioElementProps> = ({ track }) => {
  const audioElem = useRef<
    HTMLAudioElement & {
      setSinkId: (id: string) => void
    }
  >(null)

  const getStream = (_track: MediaStreamTrack) => {
    const stream = new MediaStream()
    stream.addTrack(_track)
    return stream
  }

  useEffect(() => {
    const audioRef = audioElem.current

    if (track && audioRef) {
      audioRef.load()
      audioRef.srcObject = getStream(track)
    }

    return () => {
      if (audioRef) {
        audioRef.srcObject = null
      }
    }
  }, [audioElem.current, track])

  return <audio autoPlay controls={false} ref={audioElem} />
}

export default React.memo(AudioElement)

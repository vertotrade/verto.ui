import { useEffect, useRef } from 'react'

export function Clip({ url }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const { current } = videoRef
    if (!current) {
      return undefined
    }

    current.load()
    return undefined
  }, [url])

  return (
    <video width="100%" height="100%" autoPlay muted loop ref={videoRef} playsInline>
      <source src={url} />
    </video>
  )
}

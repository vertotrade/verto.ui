import { useEffect, useRef } from 'react'

export function Clip({ url, width = '100%', height = '100%' }) {
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
    <video width={width} height={height} autoPlay muted loop ref={videoRef}>
      <source src={url} />
    </video>
  )
}

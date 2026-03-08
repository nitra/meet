import { useSearchParams } from 'react-router-dom'
import { VideoConferenceClientImpl } from './custom/VideoConferenceClientImpl'

export default function Custom() {
  const [searchParams] = useSearchParams()
  const liveKitUrl = searchParams.get('liveKitUrl') ?? undefined
  const token = searchParams.get('token') ?? undefined
  const singlePC = searchParams.get('singlePC') ?? undefined

  if (typeof liveKitUrl !== 'string') {
    return <h2>Missing LiveKit URL</h2>
  }
  if (typeof token !== 'string') {
    return <h2>Missing LiveKit token</h2>
  }

  return (
    <main data-lk-theme='default' style={{ height: '100%' }}>
      <VideoConferenceClientImpl liveKitUrl={liveKitUrl} token={token} singlePeerConnection={singlePC === 'true'} />
    </main>
  )
}

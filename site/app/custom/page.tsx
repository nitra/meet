import { VideoConferenceClientImpl } from './VideoConferenceClientImpl';

export default async function CustomRoomConnection(props: {
  searchParams: Promise<{
    liveKitUrl?: string;
    token?: string;
    singlePC?: string;
  }>;
}) {
  const { liveKitUrl, token, singlePC } = await props.searchParams;
  if (typeof liveKitUrl !== 'string') {
    return <h2>Missing LiveKit URL</h2>;
  }
  if (typeof token !== 'string') {
    return <h2>Missing LiveKit token</h2>;
  }

  return (
    <main data-lk-theme="default" style={{ height: '100%' }}>
      <VideoConferenceClientImpl
        liveKitUrl={liveKitUrl}
        token={token}
        singlePeerConnection={singlePC === 'true'}
      />
    </main>
  );
}

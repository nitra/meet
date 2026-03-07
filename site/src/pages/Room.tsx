import { useParams, useSearchParams } from 'react-router-dom';
import { PageClientImpl } from './PageClientImpl';

export default function Room() {
  const { roomName } = useParams<{ roomName: string }>();
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region') ?? undefined;
  const hq = searchParams.get('hq') === 'true';

  if (!roomName) {
    return <h2>Missing room name</h2>;
  }

  return <PageClientImpl roomName={roomName} region={region} hq={hq} />;
}

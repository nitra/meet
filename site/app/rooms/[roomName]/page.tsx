import * as React from 'react';
import { PageClientImpl } from './PageClientImpl';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ roomName: string }>;
  searchParams: Promise<{
    region?: string;
    hq?: string;
  }>;
}) {
  const _params = await params;
  const _searchParams = await searchParams;
  const hq = _searchParams.hq === 'true' ? true : false;

  return (
    <PageClientImpl
      roomName={_params.roomName}
      region={_searchParams.region}
      hq={hq}
    />
  );
}

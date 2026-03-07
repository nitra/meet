export function getLiveKitURL(projectUrl: string, region: string | null): string {
  const url = new URL(projectUrl);
  if (region && url.hostname.includes('livekit.cloud')) {
    const parts = url.hostname.split('.');
    const projectId = parts[0];
    let hostParts = parts.slice(1);
    if (hostParts[0] !== 'staging') {
      hostParts = ['production', ...hostParts];
    }
    const regionURL = [projectId, region, ...hostParts].join('.');
    url.hostname = regionURL;
  }
  return url.toString();
}

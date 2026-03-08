export function getLiveKitURL(projectUrl, region) {
  const url = new URL(projectUrl)
  if (region && url.hostname.includes('livekit.cloud')) {
    let [projectId, ...hostParts] = url.hostname.split('.')
    if (hostParts[0] !== 'staging') {
      hostParts = ['production', ...hostParts]
    }
    url.hostname = [projectId, region, ...hostParts].join('.')
  }
  return url.toString()
}

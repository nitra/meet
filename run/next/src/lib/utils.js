export function randomString(length) {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function getCookieExpirationTime() {
  const now = new Date()
  now.setTime(now.getTime() + 60 * 120 * 1000)
  return now.toUTCString()
}

export function parseCookies(cookieHeader) {
  const cookies = {}
  if (!cookieHeader) return cookies
  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name) cookies[name.trim()] = rest.join('=').trim()
  }
  return cookies
}

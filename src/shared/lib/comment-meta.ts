function getWindowsVersion(userAgent: string) {
  if (userAgent.includes('Windows NT 10.0')) {
    return 'Windows 11'
  }
  if (userAgent.includes('Windows NT 6.3')) {
    return 'Windows 8.1'
  }
  if (userAgent.includes('Windows NT 6.1')) {
    return 'Windows 7'
  }
  if (userAgent.includes('Windows')) {
    return 'Windows'
  }
  return ''
}

function getMacOSVersion(userAgent: string) {
  const match = userAgent.match(/Mac OS X ([0-9_]+)/)
  if (!match) {
    return userAgent.includes('Macintosh') ? 'macOS' : ''
  }

  const version = match[1].replaceAll('_', '.')
  if (version.startsWith('10.15')) {
    return 'macOS Catalina'
  }
  if (version.startsWith('10.14')) {
    return 'macOS Mojave'
  }
  return `macOS ${version}`
}

function getOS(userAgent: string) {
  return (
    getWindowsVersion(userAgent) ||
    getMacOSVersion(userAgent) ||
    (userAgent.includes('Android') ? 'Android' : '') ||
    (userAgent.includes('iPhone') || userAgent.includes('iPad') ? 'iOS' : '')
  )
}

function getBrowser(userAgent: string) {
  const edge = userAgent.match(/Edg\/([0-9.]+)/)
  if (edge) {
    return `Edge ${edge[1]}`
  }

  const chrome = userAgent.match(/Chrome\/([0-9.]+)/)
  if (chrome) {
    return `Chrome ${chrome[1]}`
  }

  const firefox = userAgent.match(/Firefox\/([0-9.]+)/)
  if (firefox) {
    return `Firefox ${firefox[1]}`
  }

  const safari = userAgent.match(/Version\/([0-9.]+).*Safari/)
  if (safari) {
    return `Safari ${safari[1]}`
  }

  return ''
}

export function getCommentMetaFromUserAgent(userAgent?: string) {
  if (!userAgent) {
    return []
  }

  return [getOS(userAgent), getBrowser(userAgent)].filter(Boolean)
}

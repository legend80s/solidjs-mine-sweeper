const ns = 'mini-sweeper-solid-js'

export function getItem(key: string) {
  const item = window.localStorage.getItem(`${ns}_${key}`)

  if (item) {
    return JSON.parse(item)
  }

  return item;
}

export function setItem(key: string, data: any) {
  return window.localStorage.setItem(`${ns}_${key}`, JSON.stringify(data))
}
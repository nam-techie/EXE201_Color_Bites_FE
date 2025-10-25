import Constants from 'expo-constants'

const getTilesKey = () =>
  process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY ||
  (Constants?.expoConfig as any)?.extra?.GOONG_MAPTILES_KEY ||
  ''

export type GoongStyleId = 'web' | 'light' | 'dark' | 'satellite' | 'highlight'

const STYLE_FILE: Record<GoongStyleId, string> = {
  web:       'goong_map_web.json',
  light:     'goong_map_light.json',
  dark:      'goong_map_dark.json',
  satellite: 'goong_satellite.json',
  highlight: 'goong_map_highlight.json',
}

/** Tải style JSON từ Goong và ép mọi URL (glyphs/sprite/tiles/url) có ?api_key= */
export async function buildGoongStyleDataUrl(styleId: GoongStyleId): Promise<string> {
  const key = getTilesKey()
  if (!key) throw new Error('GOONG_MAPTILES_KEY is empty')

  const file = STYLE_FILE[styleId] ?? STYLE_FILE.web
  const styleJsonUrl = `https://tiles.goong.io/assets/${file}?api_key=${key}`

  console.log(`[goong-style] Fetching style: ${styleId} from ${styleJsonUrl}`)

  const res = await fetch(styleJsonUrl)
  if (!res.ok) throw new Error(`Fetch Goong style failed ${res.status}`)
  const style = await res.json()

  // glyphs
  if (typeof style.glyphs === 'string' && !style.glyphs.includes('api_key=')) {
    style.glyphs = `${style.glyphs}${style.glyphs.includes('?') ? '&' : '?'}api_key=${key}`
  }
  // sprite
  if (typeof style.sprite === 'string' && !style.sprite.includes('api_key=')) {
    style.sprite = `${style.sprite}${style.sprite.includes('?') ? '&' : '?'}api_key=${key}`
  }
  // sources -> tiles/url
  if (style.sources) {
    for (const k of Object.keys(style.sources)) {
      const s = style.sources[k]
      if (Array.isArray(s.tiles)) {
        s.tiles = s.tiles.map((u: string) => (u.includes('api_key=') ? u : `${u}${u.includes('?') ? '&' : '?'}api_key=${key}`))
      }
      if (typeof s.url === 'string' && !s.url.includes('api_key=')) {
        s.url = `${s.url}${s.url.includes('?') ? '&' : '?'}api_key=${key}`
      }
    }
  }

  const dataUrl = `data:application/json,${encodeURIComponent(JSON.stringify(style))}`
  console.log(`[goong-style] Style processed successfully for ${styleId}`)
  return dataUrl
}

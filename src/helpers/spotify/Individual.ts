export interface Artist {
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
    contentType: 'Artist'
}

export interface Album {
    album_type: string
    artists: Array<{
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        name: string
        type: string
        uri: string
    }>
    available_markets: Array<string>
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    images: Array<{
        height: number
        url: string
        width: number
    }>
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
    contentType: 'Album'
}

export interface Track {
    album: Album,
    artists: Array<Artist>
    available_markets: Array<string>
    disc_number: number
    duration_ms: number
    explicit: Boolean
    external_ids: {
        isrc: string
    }
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    is_local: Boolean
    name: string
    popularity: number
    preview_url: string
    track_number: string
    type: string
    uri: string
    contentType: 'Track'
}
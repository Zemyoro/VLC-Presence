export interface Credentials {
    id: string
    secret: string
}

export interface Search {
    type: 'artist' | 'track' | 'album'
    query: string
    limit?: string | number
}

export interface Token {
    expires_in: number
    expires_at: number
    access_token: string
}

export interface Track {
    album: {
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
    },
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
}

export interface Response {
    tracks: {
        href: string
        items: Array<Track>
        limit: number
        next: string
        offset: number
        previous: null
        total: number
    }
}

export function Callback(err: any, response: Response | null){}
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

// export function SearchCallback(err: any, response: Response | null) { }
// export function RequestCallback(err: any, respone: Track | Album | Artist | null) { }
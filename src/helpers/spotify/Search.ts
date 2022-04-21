import { Track, Album, Artist } from './Individual';

export interface TrackSearch {
    tracks: {
        href: string
        items: Array<Track>
        limit: number
        next: string
        offset: number
        previous: null
        total: number
    },
    contentType: 'tracks'
}

export interface AlbumSearch {
    albums: {
        href: string
        items: Array<Album>
        limit: number
        next: any
        offset: number
        previous: null,
        total: number
    }
    contentType: 'albums'
}

export interface ArtistSearch {
    artists: {
        href: string
        items: Array<Artist>
        limit: number
        next: any
        offset: number
        previous: null,
        total: number
    }
    contentType: 'artists'
}
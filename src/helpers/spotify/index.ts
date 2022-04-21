const req = require('request-promise');
const TOKEN_URI = "https://accounts.spotify.com/api/token";
const SEARCH_URI = "https://api.spotify.com/v1/search?type=";

import {
    TrackSearch,
    AlbumSearch,
    ArtistSearch
} from './Search';

import {
    Album,
    Track,
    Artist
} from './Individual';

import {
    Credentials,
    Search,
    Token
} from './Data';


export class Spotify {
    private token!: Token
    private credentials: Credentials
    constructor(credentials: Credentials) {
        this.credentials = {
            id: credentials.id,
            secret: credentials.secret
        }
        this.token;
    }

    /**
     * 
     * @param search - Type, query, and limit
     * @param callback - Optional function for results
     * @returns - Results for search type. If (variable.contentType === "TrackSearch") {}, if (variable.contentType === "AlbumSearch") {}, etc.
     */
    async search(search: Search, callback?: any) {
        let request;
        const opts: any = {
            method: 'GET',
            uri:
                SEARCH_URI +
                search.type +
                '&q=' +
                encodeURIComponent(search.query) +
                '&limit=' +
                (search.limit || '20'),
            json: true
        };

        if (
            !this.token ||
            !this.token.expires_in ||
            !this.token.expires_at ||
            !this.token.access_token ||
            this.isTokenExpired()
        ) {
            request = this.setToken().then(() => {
                opts.headers = this.getTokenHeader();
                return req(opts);
            });
        } else {
            opts.headers = this.getTokenHeader();
            request = req(opts);
        }

        if (callback) {
            request
                .then((response: TrackSearch | AlbumSearch | ArtistSearch) => callback(null, response))
                .catch((err: any) => callback(err, null));
        } else {
            let req: TrackSearch | AlbumSearch | ArtistSearch = await request;
            // @ts-ignore
            req.contentType = (Object.keys(req))[0];
            return req;
        }
    }

    async request(query: string, callback?: any) {
        if (!query) {
            return console.log('You must pass in a Spotify API endpoint to use this method.');
        }

        query = query.replace('https://open', 'https://api')
            .replace('/track', '/v1/tracks')
            .replace('/playlist', '/v1/playlists')
            .replace('/album', '/v1/albums')

        if (!query.includes('spotify.com')) {
            return console.log('You must provide a Spotify song link.');
        }

        let request;
        const opts: any = { method: "GET", uri: query, json: true };

        if (
            !this.token ||
            !this.token.expires_in ||
            !this.token.expires_at ||
            !this.token.access_token ||
            this.isTokenExpired()
        ) {
            request = this.setToken().then(() => {
                opts.headers = this.getTokenHeader();
                return req(opts);
            });
        } else {
            opts.headers = this.getTokenHeader();
            request = req(opts);
        }

        if (callback) {
            request
                .then((response: Track | Album | Artist) => callback(null, response))
                .catch((err: any) => callback(err, null));
        } else {
            let req: Track | Album | Artist = request;
            return req;
        }
    }

    private isTokenExpired() {
        if (this.token &&
            Date.now() / 1000 >= this.token.expires_at - 300) {
            return true;
        }
        return false;
    }

    private setToken() {
        const opts = {
            method: "POST",
            uri: TOKEN_URI,
            form: { grant_type: "client_credentials" },
            headers: this.getCredentialHeader(),
            json: true
        };
        return req(opts).then((token: any) => {
            this.token = token;
            const currentTime = new Date();
            const expireTime = new Date(+currentTime);
            return (this.token.expires_at =
                +expireTime / 1000 + this.token.expires_in);
        });
    }

    private getTokenHeader() {
        if (!this.token || !this.token.access_token) {
            return console.log('An error has occurred. Make sure you\'re using a valid client id and secret.');
        }
        return { Authorization: "Bearer " + this.token.access_token };
    }

    private getCredentialHeader() {
        return {
            Authorization:
                "Basic " +
                Buffer.from(
                    this.credentials.id + ":" + this.credentials.secret
                    , "ascii").toString("base64")
        };
    }
}
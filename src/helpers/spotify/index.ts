const req = require('request-promise');
const TOKEN_URI = "https://accounts.spotify.com/api/token";
const SEARCH_URI = "https://api.spotify.com/v1/search?type=";

import { Credentials, Search, Token, Callback, Response } from './Interfaces';

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

    search(search: Search, callback?: typeof Callback) {
        let request
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
                .then((response: Response) => callback(null, response))
                .catch((err: any, response: Response) => callback(err, null));
        } else {
            return request;
        }
    }

    request(query: any, callback?: any) {
        if (!query || typeof query !== "string") {
            throw new Error(
                "You must pass in a Spotify API endpoint to use this method."
            );
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
                .then((response: Response) => callback(null, response))
                .catch((err: any) => callback(err, null));
        } else {
            return request;
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
            throw new Error(
                "An error has occurred. Make sure you're using a valid client id and secret.'"
            );
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
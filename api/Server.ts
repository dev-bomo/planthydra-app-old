import { fetchWithError } from "./Utilities";
import SecureStorage from "./SecureStorage";

export default class Server {

    private readonly _serviceLocation: string;
    // this should have a way to communicate to the storage
    // should also set a timer for the refreshing of the token automatically
    public constructor(serviceLocation: string) {
        this._serviceLocation = serviceLocation;
    }

    public async fetch<T>(url: string, method: string, header?: any, body?: string): Promise<T> {
        let jwtToken: string | null = await SecureStorage.getJwtToken();
        if (jwtToken) {
            if (!header) {
                header = {};
            }
            header['Authorization'] = 'Bearer ' + jwtToken;

        } else {
            // if there's no token do the refreshtoken
            // this will also redirect to login if there's no refreshtoken
            jwtToken = await this.refreshToken();
            SecureStorage.setJwtToken(jwtToken);
        }

        // if the token is expired, do a refreshToken
        return fetchWithError(url, method, header, body);
    }

    private async refreshToken(): Promise<string> {
        // this makes a request to the refresh token service
        let refreshToken: string | null = await SecureStorage.getRefreshToken();
        if (refreshToken) {
            return fetchWithError(this._serviceLocation + 'auth/refreshtoken', 'POST', {
                // need to add the headers and stuff here
            });
        } else {
            // TODO: this should redirect to the login screen. So have a navigation event or something
            throw new Error('No refresh token available, log in maybe?');
        }
    }
}

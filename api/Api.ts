import { ScheduleItem } from "../model/scheduleItem";
import { HistoryRun, Level } from "../model/historyRun";
import { NewsItem } from "../model/newsItem";
import Server from "./Server";
import { fetchWithError } from "./Utilities";
import SecureStorage from "./SecureStorage";
import { DeviceStatus } from "../model/deviceStatus";

export interface LoginResponse {
    refreshToken: string;
    deviceToken: string;
    accessToken: string;
    email: string;
}

export default class Api {
    private readonly commandPath: string = 'command/';
    private readonly accountPath: string = 'account/';

    private readonly _server: Server;
    private readonly _serviceLocation: string;

    public constructor(server: Server, serviceLocation: string) {
        this._server = server;
        this._serviceLocation = serviceLocation;
    }

    public fetchSchedules(): Promise<ScheduleItem[]> {
        return this._server.fetch<ScheduleItem[]>(this._serviceLocation + this.commandPath + 'getSchedules', 'GET')
    }

    public updateSchedule(schedule: ScheduleItem): Promise<void> {
        return this._server.fetch<void>(
            this._serviceLocation + this.commandPath + 'updateSchedule',
            'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                ...schedule,
                "waterNow": {
                    ...schedule.waterNow,
                    "duration": Math.floor(schedule.waterNow.duration)
                }
            }));
    }

    public toggleSchedule(level: Level): Promise<boolean> {
        return this._server.fetch<boolean>(
            this._serviceLocation + this.commandPath + 'toggleSchedule',
            'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify(level));
    }

    public fetchHistoryData(): Promise<HistoryRun[]> {
        return this._server.fetch<HistoryRun[]>(
            this._serviceLocation + this.commandPath + 'getRunHistory',
            'GET'
        );
    }

    public waterNow(level: Level, duration: number): Promise<void> {
        return this._server.fetch(
            this._serviceLocation + this.commandPath + 'waterNow',
            'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                "level": level,
                "duration": duration
            }));
    }

    public cancelWatering(level: Level): Promise<void> {
        return this._server.fetch(
            this._serviceLocation + this.commandPath + 'cancelWatering',
            'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            JSON.stringify(level)
        );
    }

    public fetchNews(): Promise<NewsItem[]> {
        return this._server.fetch<NewsItem[]>(
            this._serviceLocation + this.commandPath + 'getNews',
            'GET'
        );
    }

    public async getDeviceState(): Promise<DeviceStatus> {
        let token: string | null = await SecureStorage.getDeviceToken();
        if (token) {
            return this._server.fetch(
                this._serviceLocation + this.commandPath + 'getDeviceStatus',
                'POST',
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                '"' + token + '"');
        } else {
            return Promise.reject('No device token');
        }

    }

    public async login(email: string, password: string): Promise<LoginResponse> {
        return this.getLoginData(email, password, 'login');
    }

    public async logout(): Promise<void> {
        return this._server.fetch<void>(this._serviceLocation + this.accountPath + 'logout', 'DELETE');
    }

    public async register(email: string, password: string): Promise<LoginResponse> {
        return this.getLoginData(email, password, 'register');
    }

    public async facebookLogin(token: string): Promise<LoginResponse> {
        let responseJson: LoginResponse = await fetchWithError(
            this._serviceLocation + this.accountPath + 'facebook',
            'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                'Token': token
            }));

        SecureStorage.setDeviceToken(responseJson.deviceToken);
        SecureStorage.setJwtToken(responseJson.accessToken);
        SecureStorage.setRefreshToken(responseJson.refreshToken);
        SecureStorage.setUserProfile({ email: responseJson.email })

        return responseJson;
    }

    public forgotPassword(email: string): Promise<string> {
        return fetchWithError(this._serviceLocation + this.accountPath + 'forgotPassword', 'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                'Email': email
            }));
    }

    public resetPassword(email: string, newPassword: string, code: string): void {
        fetchWithError(this._serviceLocation + this.accountPath + 'resetPassword', 'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                'Email': email,
                'NewPassword': newPassword,
                'ResetPasswordCode': code
            }));
    }

    public async setExpoPushToken(expoPushToken: string): Promise<boolean> {
        return this._server.fetch<boolean>(this._serviceLocation + this.accountPath + 'setExpoPushToken', 'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            JSON.stringify({
                'token': expoPushToken
            }));
    }

    public async getAllHistoryForDevice(deviceToken: string): Promise<DeviceStatus[]> {
        return this._server.fetch<DeviceStatus[]>(this._serviceLocation + this.commandPath + 'getAllHistoryForDevice', 'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            '"' + deviceToken + '"');
    }

    private async getLoginData(email: string, password: string, operation: string): Promise<LoginResponse> {
        let responseJson: LoginResponse = await fetchWithError(
            this._serviceLocation + this.accountPath + operation,
            'POST',
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                'Email': email,
                'Password': password
            }));

        SecureStorage.setDeviceToken(responseJson.deviceToken);
        SecureStorage.setJwtToken(responseJson.accessToken);
        SecureStorage.setRefreshToken(responseJson.refreshToken);
        SecureStorage.setUserProfile({ email: responseJson.email });

        return responseJson;
    }

}
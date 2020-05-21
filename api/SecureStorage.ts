import * as SecureStore from "expo-secure-store";
import { UserProfile } from "../model/userProfile";

export default class SecureStorage {
    private static readonly _jwtKey: string = 'jwtKey';
    private static readonly _refreshKey: string = 'refreshKey';
    private static readonly _deviceKey: string = 'deviceKey';
    private static readonly _userProfileKey: string = 'userProfileKey';
    private static readonly _waterNowTimeUpperKey: string = 'waterNowTimeUpper';
    private static readonly _waterNowTimeLowerKey: string = 'waterNowTimeLower';


    public static async getWaterNowTimeUpper(): Promise<number | null> {
        return this.getWaterNowTime(false);
    }

    public static async getWaterNowTimeLower(): Promise<number | null> {
        return this.getWaterNowTime(true);
    }

    private static async getWaterNowTime(isLower: boolean): Promise<number | null> {
        let timeAsString: string | null = await SecureStore.getItemAsync(
            isLower ? SecureStorage._waterNowTimeLowerKey : SecureStorage._waterNowTimeUpperKey);
        return timeAsString == null ? null : Number.parseInt(timeAsString);
    }

    public static async setWaterNowTimerUpper(timerValue: number): Promise<void> {
        return SecureStore.setItemAsync(SecureStorage._waterNowTimeUpperKey, timerValue.toString());
    }

    public static async setWaterNowTimeLower(timerValue: number): Promise<void> {
        return SecureStore.setItemAsync(SecureStorage._waterNowTimeLowerKey, timerValue.toString());
    }

    public static async getRefreshToken(): Promise<string | null> {
        return SecureStore.getItemAsync(SecureStorage._refreshKey);
    }

    public static async setRefreshToken(token: string): Promise<void> {
        return SecureStore.setItemAsync(SecureStorage._refreshKey, token);
    }

    public static async getJwtToken(): Promise<string | null> {
        return SecureStore.getItemAsync(this._jwtKey);
    }

    public static async setJwtToken(token: string): Promise<void> {
        return SecureStore.setItemAsync(SecureStorage._jwtKey, token);
    }

    public static async getDeviceToken(): Promise<string | null> {
        return SecureStore.getItemAsync(this._deviceKey);
    }

    public static async setDeviceToken(token: string): Promise<void> {
        return SecureStore.setItemAsync(SecureStorage._deviceKey, token);
    }

    public static async getUserProfile(): Promise<UserProfile | null> {
        let userProfileAsString: string | null = await SecureStore.getItemAsync(this._userProfileKey);
        if (userProfileAsString) {
            return JSON.parse(userProfileAsString);
        } else {
            return null;
        }
    }

    public static async setUserProfile(up: UserProfile): Promise<void> {
        let userProfileAsString: string = JSON.stringify(up);
        return SecureStore.setItemAsync(this._userProfileKey, userProfileAsString);
    }

    public static async removeData(): Promise<void> {
        SecureStore.deleteItemAsync(this._deviceKey);
        SecureStore.deleteItemAsync(this._refreshKey);
        SecureStore.deleteItemAsync(this._jwtKey);
        SecureStore.deleteItemAsync(this._userProfileKey);
    }
}
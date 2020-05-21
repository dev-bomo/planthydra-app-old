import { HistoryRun } from "../model/historyRun";

export default class ScheduleUtilities {
    public static getDateTimeFromStartTime(startTime: string): Date {
        let shards: string[] = startTime.split(':');
        if (shards.length < 2) {
            throw new Error('startTime string should be have the following format: {hh}:{mm}');
        }

        let utcDate2: Date = new Date(Date.now());
        utcDate2.setHours(+shards[0], +shards[1]);
        return this.convertUTCDateToLocalDate(utcDate2);
    }

    public static convertDateTimeToScheduleTime(date: Date): string {
        return date.getHours() + ':' + date.getMinutes();
    }

    public static convertDateTimeToUtcScheduleTime(date: Date): string {
        let utcStartHour: number = date.getUTCHours();
        let utcStartMinute: number = date.getUTCMinutes();
        return utcStartHour + ':' + utcStartMinute;
    }

    public static convertUTCDateToLocalDate(date: Date): Date {
        let newDate: Date = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

        return newDate;
    }

    public static convertDurationToWaterQuantity(duration: number, shouldRound: boolean): string {
        let value: number = Math.floor(duration * mlPerS);
        return shouldRound ? (value - (value % 10)) + 'ml': value + 'ml';
    }

}

const mlPerS: number = 16.67;
export enum Level {
    Upper = 1,
    Lower = 2
}

export interface HistoryRun {
    id: string,
    startTime: string,
    waterNow: WaterNow
}

export interface WaterNow {
    duration: number,
    level: Level
}
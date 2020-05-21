import { Level } from "./historyRun";

export interface ScheduleItem {
    waterNow: {
        level: Level;
        duration: number;
    };
    wateringDays: string;
    startTime: string;
    notifyBeforeMinutes: number;
    isEnabled: boolean;
}
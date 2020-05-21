import React from "react";
import { Surface, Switch, Text, TouchableRipple } from "react-native-paper";
import { StyleProp, StyleSheet, View } from "react-native";
import { ScheduleItem } from '../../model/scheduleItem';
import { Level } from "../../model/historyRun";
import WeekStrip from "./WeekStrip";
import ScheduleUtilities from "../../services/ScheduleUtilities";
import MeridiaText from "../MeridiaText";
import { Level1Icon, Level2Icon } from "../../assets/icons/Icons";
import Theme from "../../assets/theme/theme";

export interface ScheduleControlItemProps {
    item: ScheduleItem | null;
    isLoading: boolean;
    level: Level;
    toggleIsEnabled: () => void;
    editSchedule: (schedule: ScheduleItem | null, level: Level) => void;
    style?: StyleProp<any>
}

export interface ScheduleControlItemState {
}

export default class ScheduleControlItem extends React.Component<ScheduleControlItemProps, ScheduleControlItemState> {

    public constructor(props: ScheduleControlItemProps) {
        super(props);
        this.toggleIsEnabled = this.toggleIsEnabled.bind(this);
        this.editSchedule = this.editSchedule.bind(this);
        this.state = {
            isEnabled: props.item && props.item.isEnabled || false
        };
    }

    public render(): JSX.Element {
        if (!this.props.item) {
            return (
                <TouchableRipple onPress={this.editSchedule}>
                    <Surface style={[styles.item, this.props.style]}>
                        {
                            this.props.level === Level.Upper ?
                                <Level1Icon fill={Theme.COLOR_SECONDARY} height='60%' width='20%' /> :
                                <Level2Icon fill={Theme.COLOR_SECONDARY} height='70%' width='20%' />
                        }
                        <MeridiaText>{this.props.isLoading ? 'Loading...' : 'Add a schedule for the ' + (this.props.level == Level.Lower ? 'lower' : 'upper') + ' level'}</MeridiaText>
                    </Surface>
                </TouchableRipple>);
        }
        let duration: number = this.props.item.waterNow.duration;
        let startTime: string = this.props.item.startTime;
        return (
            <TouchableRipple onPress={this.editSchedule}>
                <Surface style={[styles.item, this.props.style]}>
                    {
                        this.props.level === Level.Upper ?
                            <Level1Icon fill={Theme.COLOR_SECONDARY} height='60%' width='20%' /> :
                            <Level2Icon fill={Theme.COLOR_SECONDARY} height='70%' width='20%' />
                    }
                    <View style={styles.actionBar}>
                        <Switch onValueChange={this.toggleIsEnabled} value={this.props.item.isEnabled} style={styles.actionBarItem} />
                    </View>
                    <View>
                        <MeridiaText>{ScheduleUtilities.convertDurationToWaterQuantity(duration, true) + ' at ' +
                            ScheduleUtilities.convertDateTimeToScheduleTime(ScheduleUtilities.getDateTimeFromStartTime(startTime))}
                        </MeridiaText>
                        <WeekStrip editMode={false} daysActive={this.props.item ? this.props.item.wateringDays : ''} />
                    </View>
                </Surface>
            </TouchableRipple>);
    }

    private toggleIsEnabled(): void {
        this.props.toggleIsEnabled();
    }

    private editSchedule(): void {
        this.props.editSchedule(this.props.item, this.props.level);
    }
}

const styles = StyleSheet.create({
    item: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 4,
        height: 80,
        alignSelf: 'stretch',
        borderRadius: 4
    },
    actionBar: {
        position: 'absolute',
        flexDirection: 'row',
        top: 0,
        right: 0,
        padding: 8
    },
    actionBarItem: {
        paddingLeft: 4
    },
});
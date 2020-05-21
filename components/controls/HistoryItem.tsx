import React from "react";
import { Surface, TouchableRipple } from "react-native-paper";
import { StyleProp, StyleSheet, View } from "react-native";
import { HistoryRun, Level } from "../../model/historyRun";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScheduleUtilities from "../../services/ScheduleUtilities";
import MeridiaCardHeaderText from "../MeridiaCardHeaderText";
import MeridiaText from "../MeridiaText";
import { Level1Icon, Level2Icon } from "../../assets/icons/Icons";
import Theme from "../../assets/theme/theme";

export interface HistoryItemProps {
    item: HistoryRun | null;
    isLoading: boolean;
    isWatering: boolean;
    level: Level;
    openFullHistory: () => void;
    style?: StyleProp<any>
}

export default class HistoryItem extends React.Component<HistoryItemProps, {}> {

    public render(): JSX.Element {
        let { item, isLoading, isWatering }: HistoryItemProps = this.props;

        if (!item) {
            return (
                <Surface style={[styles.item, this.props.style]}>
                    {
                        this.props.level && this.props.level === Level.Upper ?
                            <Level1Icon fill={Theme.COLOR_SECONDARY} height='60%' width='20%' /> :
                            <Level2Icon fill={Theme.COLOR_SECONDARY} height='70%' width='20%' />
                    }
                    <MeridiaCardHeaderText>{isLoading ? 'Loading...' : 'No History'}</MeridiaCardHeaderText>
                </Surface>);
        }

        return (
            <TouchableRipple onPress={this.props.openFullHistory}>
                <Surface style={[styles.item, this.props.style]}>
                    {
                        this.props.item && this.props.item.waterNow.level === Level.Upper ?
                            <Level1Icon fill={Theme.COLOR_SECONDARY} height='60%' width='20%' /> :
                            <Level2Icon fill={Theme.COLOR_SECONDARY} height='70%' width='20%' />
                    }
                    {isWatering ?
                        <MeridiaText>Watering now...</MeridiaText> :
                        <View>
                            <MeridiaText>{ScheduleUtilities.convertDurationToWaterQuantity(item.waterNow.duration, true)}</MeridiaText>
                            <MeridiaText>{this.computeDaysAgo(item)}</MeridiaText>
                        </View>
                    }
                </Surface>
            </TouchableRipple>);
    }

    private computeDaysAgo(historyItem: HistoryRun): string {
        let daysAgo: number = Math.floor((Date.now() - Date.parse(historyItem.startTime)) / (1000 * 3600 * 24));
        console.log("daysAgo: " + daysAgo);
        switch (daysAgo) {
            case 0:
                let date: Date = new Date(historyItem.startTime);
                let time: string = date.getHours() + ':' + date.getMinutes();
                return "Today at " + time;
            case 1:
                return "One day ago";
            default:
                return daysAgo + " days ago";
        }
    }
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: 4,
        height: 80,
        borderRadius: 4
    },
});
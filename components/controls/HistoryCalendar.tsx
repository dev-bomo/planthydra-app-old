import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HistoryRun, Level } from "../../model/historyRun";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Calendar, CalendarDot, CalendarTheme, Marking, CalendarMarkingProps, MultiDotMarking } from 'react-native-calendars';
import MeridiaText from "../MeridiaText";
import Theme from "../../assets/theme/theme";

export interface HistoryCalendarProps {
    items: HistoryRun[];
    defaultLevel: Level;
}

export interface HistoryCalendarState {
    calendarMarks: { [date: string]: MultiDotMarking }
}

export default class HistoryCalendar extends React.Component<HistoryCalendarProps, HistoryCalendarState>{

    constructor(props: HistoryCalendarProps) {
        super(props);
        this.state = {
            calendarMarks: this.generateMarkedDates()
        };
    }

    render(): JSX.Element {
        let { calendarMarks }: HistoryCalendarState = this.state;
        return (<View style={styles.control}>
            <View style={styles.header}>
                <MeridiaText style={styles.headerText}>History</MeridiaText>
            </View>
            <View style={styles.calendarContainer}>
                <Calendar
                    theme={calendarTheme}
                    hideExtraDays={true}
                    markingType='multi-dot'
                    markedDates={calendarMarks} />
                <View style={styles.buttonContainer}>
                    <View style={styles.legendItemContainer}>
                        <View style={[styles.legendDot, styles.legendDotUpper]}>
                        </View>
                        <MeridiaText style={styles.legendText}>Upper level</MeridiaText>
                    </View>
                    <View style={styles.legendItemContainer}>
                        <View style={[styles.legendDot, styles.legendDotLower]}>
                        </View>
                        <MeridiaText style={styles.legendText}>Lower level</MeridiaText>
                    </View>
                </View>
            </View>
        </View>);
    }

    private generateMarkedDates(): { [date: string]: MultiDotMarking } {
        let retVal: { [date: string]: MultiDotMarking } = {};
        this.props.items.forEach((item: HistoryRun) => {
            let date: Date = new Date(item.startTime);
            let year: number = date.getFullYear(),
                month: number = date.getMonth() + 1,
                day: number = date.getDate();
            let dateString: string = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
            if (retVal[dateString]) {
                if (item.waterNow.level === Level.Upper && retVal[dateString].dots.indexOf(l1) < 0) {
                    retVal[dateString].dots.push(l1);
                } else if (item.waterNow.level === Level.Lower && retVal[dateString].dots.indexOf(l2) < 0) {
                    retVal[dateString].dots.push(l2);
                }
            } else {
                retVal[dateString] = {
                    dots: item.waterNow.level === Level.Upper ? [l1] : [l2],
                    selected: true,
                    selectedColor: Theme.COLOR_SECONDARY
                }
            }
        });

        //mark today too
        let today: Date = new Date();
        let year: number = today.getFullYear(),
            month: number = today.getMonth() + 1,
            day: number = today.getDate();
        let todayString: string = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        retVal[todayString] = {
            dots: [],
            selected: true,
            selectedColor: '#DDDDCC'
        }
        return retVal;
    }
}

const styles = StyleSheet.create({
    control: {
        width: '80%',
        backgroundColor: Theme.COLOR_SECONDARY,
        borderRadius: 10
    },
    header: {
        paddingTop: 8,
        paddingBottom: 8,
        marginLeft: 8,
        marginRight: 8,
        borderBottomColor: Theme.COLOR_BACKGROUND,
        borderBottomWidth: 2
    },
    headerText: {
        textAlign: 'center',
        fontSize: 18,
        color: Theme.COLOR_PRIMARY
    },
    calendarContainer: {
        borderRadius: 8,
        backgroundColor: Theme.COLOR_BACKGROUND,
        padding: 8,
        margin: 8
    },
    buttonContainer: {
        flexDirection: 'column',
        marginTop: 10
    },
    button: {
        width: '48%',
        borderRadius: 6,
        padding: 4,
        backgroundColor: Theme.COLOR_SECONDARY
    },
    legendItemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    legendDot: {
        width: 10,
        height: 10,
        margin: 7,
        borderRadius: 5
    },
    legendDotUpper: {
        backgroundColor: Theme.COLOR_PRIMARY
    },
    legendDotLower: {
        backgroundColor: Theme.COLOR_BACKGROUND,
        borderWidth: 1,
        borderColor: Theme.COLOR_SECONDARY
    },
    legendText: {
        marginLeft: 8
    }
});

const l1: CalendarDot = { key: 'Level1', color: Theme.COLOR_BACKGROUND, selectedDotColor: Theme.COLOR_BACKGROUND };
const l2: CalendarDot = { key: 'Level2', color: Theme.COLOR_PRIMARY, selectedDotColor: Theme.COLOR_PRIMARY };

const calendarTheme: CalendarTheme = {
    backgroundColor: Theme.COLOR_SECONDARY,
    calendarBackground: Theme.COLOR_BACKGROUND,
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: Theme.COLOR_SECONDARY,
    selectedDayTextColor: Theme.COLOR_BACKGROUND,
    todayTextColor: Theme.COLOR_PRIMARY,
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: Theme.COLOR_BACKGROUND,
    arrowColor: Theme.COLOR_SECONDARY,
    monthTextColor: Theme.COLOR_PRIMARY,
    indicatorColor: 'blue',
    textDayFontWeight: '300',
    textMonthFontWeight: '300',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
};
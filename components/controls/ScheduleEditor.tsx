import React from "react";
import { View, StyleSheet, Platform, DatePickerIOS, TimePickerAndroid, Slider } from "react-native";
import { Button, Portal, Dialog, Paragraph, Modal, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ScheduleItem } from "../../model/scheduleItem";
import { Level } from "../../model/historyRun";
import MeridiaText from "../MeridiaText";
import ScheduleUtilities from "../../services/ScheduleUtilities";
import WeekStrip from "./WeekStrip";
import TimeUtils from "../../util/TimeUtils";
import Theme from "../../assets/theme/theme";

export interface ScheduleEditorProps {
    cancelOperation: () => void;
    schedule: ScheduleItem | null;
    level: Level;
    updateSchedule: (scheduledItem: ScheduleItem) => void;
}

interface ScheduleEditorState {
    hasChanges: boolean;
    isDialogVisible: boolean;

    startTimePickerVisible: boolean;
    wateringStartTime: Date;
    wateringDays: string;
    wateringDuration: number;
    wateringNotifyBeforeMinutes: number;
}

export default class ScheduleEditor extends React.Component<ScheduleEditorProps, ScheduleEditorState> {

    constructor(props: ScheduleEditorProps) {
        super(props);
        this.cancelOperation = this.cancelOperation.bind(this);
        this.cancelConfirmed = this.cancelConfirmed.bind(this);
        this.cancelRevoked = this.cancelRevoked.bind(this);
        this.waterQuantityChanged = this.waterQuantityChanged.bind(this);
        this.onDaySelected = this.onDaySelected.bind(this);
        this.startTimeChanged = this.startTimeChanged.bind(this);
        this.updateSchedule = this.updateSchedule.bind(this);
        this.waterQuantityChangeArrow = this.waterQuantityChangeArrow.bind(this);
        this.state = {
            hasChanges: false,
            isDialogVisible: false,
            startTimePickerVisible: false,
            wateringStartTime: props.schedule && ScheduleUtilities.getDateTimeFromStartTime(props.schedule.startTime) || new Date(),
            wateringDays: props.schedule && props.schedule.wateringDays || '',
            wateringDuration: props.schedule && props.schedule.waterNow.duration || 5,
            wateringNotifyBeforeMinutes: props.schedule && props.schedule.notifyBeforeMinutes || 30
        };
    }

    render(): JSX.Element {
        let { wateringStartTime, wateringDuration, wateringDays }: ScheduleEditorState = this.state;
        return (<View style={styles.control}>
            <View style={styles.header}>
                <MeridiaText style={styles.headerText}>Edit schedule</MeridiaText>
            </View>
            <View style={styles.scheduleContainer}>
                <View style={styles.editableContent}>
                    <Button
                        style={styles.timePickerButton}
                        mode='outlined'
                        onPress={() => {
                            this.createTimePicker();
                            this.setState({ startTimePickerVisible: true })
                        }}>
                        {TimeUtils.prepend0(wateringStartTime.getHours()) + ':' + TimeUtils.prepend0(wateringStartTime.getMinutes())}
                    </Button>
                    <View style={styles.waterQuantityContainer}>
                        <View style={styles.sliderContainer}>
                            <TouchableRipple underlayColor='#E2DEAB' onPress={() => this.waterQuantityChangeArrow(false)}
                                style={styles.arrowDown1}>
                                <Icon name='arrow-down-bold-circle' size={40} color={Theme.COLOR_SECONDARY}></Icon>
                            </TouchableRipple>
                            <Slider
                                thumbTintColor={Theme.COLOR_PRIMARY}
                                minimumTrackTintColor={Theme.COLOR_SECONDARY}
                                value={wateringDuration}
                                step={1}
                                style={styles.waterQuantitySlider}
                                maximumValue={300}
                                minimumValue={0}
                                onValueChange={this.waterQuantityChanged} />
                            <TouchableRipple underlayColor='#E2DEAB' onPress={() => this.waterQuantityChangeArrow(true)}
                                style={styles.arrowUp1}>
                                <Icon name='arrow-up-bold-circle' size={40} color={Theme.COLOR_SECONDARY}></Icon>
                            </TouchableRipple>
                        </View>
                        <View style={styles.quantityTextSchedule}>
                            <MeridiaText>{ScheduleUtilities.convertDurationToWaterQuantity(wateringDuration, true)}</MeridiaText>
                        </View>
                    </View>
                    <WeekStrip daysActive={wateringDays} editMode={true} onDaySelected={this.onDaySelected} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} onPress={this.cancelOperation}><Icon size={24} color={Theme.COLOR_BACKGROUND} name='close' /></Button>
                    <Button style={styles.button} onPress={this.updateSchedule}><Icon size={24} color={Theme.COLOR_BACKGROUND} name='check' /></Button>
                </View>
            </View>
            <Portal>
                <Dialog
                    visible={this.state.isDialogVisible}
                    dismissable={false}>
                    <Dialog.Title>Cancel edit</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>You've made changes to this schedule. Are you sure you want to cancel the changes?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={this.cancelConfirmed}>Yes</Button>
                        <Button onPress={this.cancelRevoked}>No</Button>
                    </Dialog.Actions>
                </Dialog>
                {Platform.OS === 'ios' ? <Modal contentContainerStyle={styles.timePicker}
                    visible={this.state.startTimePickerVisible}
                    onDismiss={() => { this.setState({ startTimePickerVisible: false }); }}>
                    <DatePickerIOS
                        mode='time'
                        minuteInterval={1}
                        date={this.state.wateringStartTime}
                        onDateChange={this.startTimeChanged} />
                </Modal> :
                    null}
            </Portal>
        </View>);
    }

    private hasChanges(): void {
        if (!this.state.hasChanges) {
            this.setState({ hasChanges: true });
        }
    }

    private onDaySelected(index: number): void {
        this.hasChanges();
        let indexInString: number = this.state.wateringDays.indexOf(index.toString());
        if (indexInString > -1) {
            this.setState({ wateringDays: this.state.wateringDays.slice(0, indexInString) + this.state.wateringDays.slice(indexInString + 1) })
        } else {
            this.setState({
                wateringDays: this.state.wateringDays + index
            });
        }
    }

    private waterQuantityChanged(value: number): void {
        this.hasChanges();
        this.setState({ wateringDuration: value });
    }

    private startTimeChanged(newDate: Date): void {
        this.hasChanges();
        let now: Date = new Date();
        now.setHours(newDate.getHours(), newDate.getMinutes());
        this.setState({
            wateringStartTime: now,
        });
    }

    private cancelOperation(): void {
        if (this.state.hasChanges) {
            this.setState({ isDialogVisible: true });
        } else {
            this.props.cancelOperation();
        }
    }

    private cancelConfirmed(): void {
        this.props.cancelOperation();
    }

    private cancelRevoked(): void {
        this.setState({ isDialogVisible: false });
    }

    private createTimePicker(): void {
        if (Platform.OS !== 'ios') {
            let now: Date = new Date();
            TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: false, // Will display '2 PM'
            }).then(({ action, hour, minute }) => {
                now.setHours(hour, minute);
                this.setState({ wateringStartTime: now });
                let date = new Date();
                date.setHours(hour);
                date.setMinutes(minute);
                this.startTimeChanged(date)
            });
        }
    }

    private updateSchedule(): void {
        if (!this.state.hasChanges) {
            return;
        }
        let utcTimeMs: number = this.state.wateringStartTime.valueOf() + this.state.wateringStartTime.getTimezoneOffset() * 60 * 1000;
        let utcTime: Date = new Date(utcTimeMs);
        let utcStartHour: number = utcTime.getHours();
        let utcStartMinute: number = utcTime.getMinutes();
        this.props.updateSchedule({
            waterNow: {
                duration: Math.floor(this.state.wateringDuration),
                level: this.props.level
            },
            wateringDays: this.state.wateringDays,
            notifyBeforeMinutes: this.state.wateringNotifyBeforeMinutes,
            startTime: TimeUtils.prepend0(utcStartHour) + ':' + TimeUtils.prepend0(utcStartMinute),
            isEnabled: this.props.schedule && this.props.schedule.isEnabled || true
        });
        // TODO: do some snackbar work to show that the update happened
    }
    private waterQuantityChangeArrow(isUp: boolean): void {
        this.hasChanges();
        let wateringDurationTemp: number = this.state.wateringDuration;
        if (isUp && wateringDurationTemp < 300) {
            this.setState({ wateringDuration: wateringDurationTemp + 0.6 });
        } else if (!isUp && wateringDurationTemp > 0) {
            this.setState({ wateringDuration: wateringDurationTemp - 0.6 });
        }
    }

}

const styles = StyleSheet.create({
    control: {
        width: '90%',
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
        fontSize: 16,
        color: Theme.COLOR_PRIMARY
    },
    scheduleContainer: {
        borderRadius: 8,
        backgroundColor: Theme.COLOR_BACKGROUND,
        padding: 8,
        margin: 8
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        width: '48%',
        margin: 6,
        borderRadius: 10,
        padding: 4,
        backgroundColor: Theme.COLOR_SECONDARY
    },
    timePicker: {
        height: 200,
        backgroundColor: Theme.COLOR_BACKGROUND
    },
    timePickerButton: {
        borderRadius: 4,
        borderColor: Theme.COLOR_SECONDARY,
        backgroundColor: Theme.COLOR_SECONDARY,
        color: Theme.COLOR_BACKGROUND,
        padding: 4,
    },
    editableContent: {
        padding: 4,
        backgroundColor: Theme.COLOR_BACKGROUND
    },
    waterQuantityContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 4
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    quantityTextSchedule: {
        marginTop: -7,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    waterQuantitySlider: {
        width: '72%'
    },
    arrowUp1: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    arrowDown1: {
        width: 40,
        height: 40,
        borderRadius: 20
    }
});
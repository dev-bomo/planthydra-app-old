import React from "react";
import { Portal, Button, TouchableRipple, Dialog, Paragraph } from "react-native-paper";
import { View, Slider, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Level, WaterNow } from "../../model/historyRun";
import MeridiaText from "../MeridiaText";
import ScheduleUtilities from "../../services/ScheduleUtilities";
import SecureStorage from "../../api/SecureStorage";
import Fade from "./Animation/Fade";
import { WaterNowIcon, Level1Icon, Level2Icon, DeviceOfflineIcon, CancelWateringIcon } from "../../assets/icons/Icons";
import Theme from "../../assets/theme/theme";

export interface WaterNowControlProps {
    waterNowTriggered: (waterNow: WaterNow) => void;
    isError: boolean;
    errorText?: string;
    nowWateringLevel: number;
    cancelWatering: (level: Level) => void;
}

interface WaterNowControlState {
    isExpanded: boolean;
    durationTop: number;
    durationBottom: number;
    isDialogVisible: boolean;
    timeLeft: number;
}

export default class WaterNowControl extends React.Component<WaterNowControlProps, WaterNowControlState> {

    private interval: number = 0;


    constructor(props: WaterNowControlProps) {
        super(props);
        this.toggleIsExpanded = this.toggleIsExpanded.bind(this);
        this.internalWaterNowTriggered = this.internalWaterNowTriggered.bind(this);
        this.waterQuantityChange = this.waterQuantityChange.bind(this);
        this.waterQuantityChangeArrow = this.waterQuantityChangeArrow.bind(this);
        this.waterQuantityChangeArrow2 = this.waterQuantityChangeArrow2.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.cancelWateringInternal = this.cancelWateringInternal.bind(this);

        SecureStorage.getWaterNowTimeUpper().then(
            (duration: number | null) => {
                duration && this.setState({ durationTop: duration });
            });

        SecureStorage.getWaterNowTimeLower().then(
            (duration: number | null) => {
                duration && this.setState({ durationBottom: duration });
            });

        this.state = {
            isExpanded: false,
            durationTop: 5,
            durationBottom: 5,
            isDialogVisible: false,
            timeLeft: 0
        };
    }

    render(): JSX.Element {
        let { isExpanded, isDialogVisible, timeLeft }: WaterNowControlState = this.state;
        let { isError, errorText, nowWateringLevel }: WaterNowControlProps = this.props;

        return (<React.Fragment>
            <Fade visible={isExpanded} style={styles.expandedOverlay}>
                <View style={styles.expandedContainer}>
                    <View style={styles.levelContainer}>
                        <TouchableRipple underlayColor='#E2DEAB' onPress={() => this.waterQuantityChangeArrow(false)}
                            style={styles.arrowButton}>
                            <Icon name='arrow-down-bold-circle' size={40} color={Theme.COLOR_SECONDARY}></Icon>
                        </TouchableRipple>
                        <Slider
                            value={this.state.durationTop}
                            onValueChange={(value: number) => this.waterQuantityChange(value, Level.Upper)}
                            style={styles.waterQuantitySlider}
                            minimumValue={0}
                            maximumValue={60}
                            thumbTintColor={Theme.COLOR_PRIMARY} minimumTrackTintColor={Theme.COLOR_SECONDARY}>
                        </Slider>
                        <TouchableRipple underlayColor='#E2DEAB' onPress={() => this.waterQuantityChangeArrow(true)}
                            style={styles.arrowButton}>
                            <Icon name='arrow-up-bold-circle' size={40} color={Theme.COLOR_SECONDARY}></Icon>
                        </TouchableRipple>
                        <TouchableRipple underlayColor='#E2DEAB' onPress={() => this.internalWaterNowTriggered(Level.Upper)}
                            style={styles.waterNowButton}>
                            <Level1Icon fill={Theme.COLOR_PRIMARY} height='60%' width='60%' />
                        </TouchableRipple>
                    </View>
                    <View style={styles.quantityText}>
                        <MeridiaText style={{ color: '#fff' }}>{ScheduleUtilities.convertDurationToWaterQuantity(this.state.durationTop, true)}</MeridiaText>
                    </View>
                    <View style={styles.levelContainer}>
                        <TouchableRipple underlayColor='#E2DEAB' onPress={() => this.waterQuantityChangeArrow2(false)}
                            style={styles.arrowButton}>
                            <Icon name='arrow-down-bold-circle' size={40} color={Theme.COLOR_SECONDARY}></Icon>
                        </TouchableRipple>
                        <Slider
                            value={this.state.durationBottom}
                            onValueChange={(value: number) => this.waterQuantityChange(value, Level.Lower)}
                            style={styles.waterQuantitySlider}
                            minimumValue={0}
                            step={1}
                            maximumValue={60}
                            thumbTintColor={Theme.COLOR_PRIMARY} minimumTrackTintColor={Theme.COLOR_SECONDARY}>
                        </Slider>
                        <TouchableRipple underlayColor='#E2DEAB' onPress={() => this.waterQuantityChangeArrow2(true)}
                            style={styles.arrowButton}>
                            <Icon name='arrow-up-bold-circle' size={40} color={Theme.COLOR_SECONDARY}></Icon>
                        </TouchableRipple>
                        <TouchableRipple underlayColor='#E2DEAB' onPress={() => this.internalWaterNowTriggered(Level.Lower)}
                            style={styles.waterNowButton}>
                            <Level2Icon fill={Theme.COLOR_PRIMARY} height='70%' width='70%' />
                        </TouchableRipple>
                    </View>
                    <View style={styles.quantityText}>
                        <MeridiaText style={{ color: '#fff' }}>{ScheduleUtilities.convertDurationToWaterQuantity(this.state.durationBottom, true)}</MeridiaText>
                    </View>
                </View>
            </Fade>
            <Dialog visible={isDialogVisible} onDismiss={this.hideDialog}>
                <Dialog.Title>Device offline</Dialog.Title>
                <Dialog.Content>
                    <Paragraph><MeridiaText>{errorText}</MeridiaText></Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={this.hideDialog}>OK</Button>
                </Dialog.Actions>
            </Dialog>
            {timeLeft > 0 && <View style={styles.timeLeftIndicator}>
                <MeridiaText style={styles.timeLeftText}>{timeLeft}</MeridiaText>
            </View>}
            <TouchableRipple
                underlayColor='#518057'
                onPress={!isError ? nowWateringLevel > 0 ? this.cancelWateringInternal : this.toggleIsExpanded : this.showDialog}
                style={!isError ? [styles.mainButton] : [styles.mainButton, styles.mainButtonError]}>
                {
                    isError ? <DeviceOfflineIcon height='70%' width='60%' /> :
                        nowWateringLevel > 0 ? <CancelWateringIcon height='70%' width='60%' fill='#BE1E2D' /> :
                            isExpanded ?
                                <Icon style={styles.mainButtonIcon} name='close' size={40} color={Theme.COLOR_SECONDARY}></Icon> :
                                <WaterNowIcon height='70%' width='60%' fill={Theme.COLOR_SECONDARY} />
                }
            </TouchableRipple>
        </React.Fragment>);
    }

    private hideDialog(): void {
        this.setState({ isDialogVisible: false });
    }

    private showDialog(): void {
        this.setState({ isDialogVisible: true });
    }

    private waterQuantityChange(newValue: number, level: Level): void {
        if (level === Level.Lower) {
            this.setState({ durationBottom: newValue });
            SecureStorage.setWaterNowTimeLower(newValue);
        } else {
            this.setState({ durationTop: newValue });
            SecureStorage.setWaterNowTimerUpper(newValue);
        }
    }
    private waterQuantityChangeArrow(isUp: boolean): void {
        let durationTopTemp: number = this.state.durationTop;
        if (isUp && durationTopTemp < 60) {
            this.setState({ durationTop: durationTopTemp + 0.6 });
        } else if (!isUp && durationTopTemp > 0) {
            this.setState({ durationTop: durationTopTemp - 0.6 });
        }
    }
    private waterQuantityChangeArrow2(isUp: boolean): void {
        let durationBottomTemp: number = this.state.durationBottom;
        if (isUp && durationBottomTemp < 60) {
            this.setState({ durationBottom: durationBottomTemp + 0.6 });
        } else if (!isUp && durationBottomTemp > 0) {
            this.setState({ durationBottom: durationBottomTemp - 0.6 });
        }
    }

    private cancelWateringInternal(): void {
        this.setState({ timeLeft: 0 });
        this.props.cancelWatering(this.props.nowWateringLevel)
        clearInterval(this.interval);
    }

    private toggleIsExpanded(): void {
        let isExpanded: boolean = this.state.isExpanded;
        this.setState({ isExpanded: !isExpanded });
    }

    componentDidUpdate(prevProps: WaterNowControlProps, prevState: WaterNowControlState): void {
        if (prevState.timeLeft === 1 && this.state.timeLeft === 0) {
            clearInterval(this.interval);
        }
    }

    private internalWaterNowTriggered(level: Level): void {
        let duration: number = level === Level.Upper ? this.state.durationTop : this.state.durationBottom;
        let integerDuration: number = Math.floor(duration);
        this.setState({ isExpanded: false, timeLeft: integerDuration });
        this.props.waterNowTriggered({ duration: integerDuration, level: level });
        this.interval = setInterval(() => {
            this.setState({ timeLeft: this.state.timeLeft - 1 });
        }, 1000);
    }
}

const styles = StyleSheet.create({
    mainButton: {
        position: 'absolute',
        height: 80,
        width: 80,
        bottom: 40,
        right: 20,
        backgroundColor: Theme.COLOR_PRIMARY,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeLeftIndicator: {
        width: 40,
        height: 40,
        position: 'absolute',
        bottom: 105,
        right: 20,
        backgroundColor: Theme.COLOR_PRIMARY,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeLeftText: {
        color: Theme.COLOR_SECONDARY
    },
    mainButtonError: {
        backgroundColor: Theme.COLOR_ERROR
    },
    mainButtonIcon: {
        width: 40,
        height: 40
    },
    expandedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    expandedContainer: {
        position: 'absolute',
        height: 160,
        width: '100%',
        bottom: 120,
        right: 28
    },
    levelContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    waterQuantitySlider: {
        width: '47%',
        marginTop: 15
    },
    quantityText: {
        marginTop: -25,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    waterNowButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Theme.COLOR_SECONDARY,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginTop: 15
    }
});
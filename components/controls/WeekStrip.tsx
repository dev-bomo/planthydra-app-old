import React from "react";
import { View, StyleSheet, RegisteredStyle } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import MeridiaText from "../MeridiaText";
import Theme from "../../assets/theme/theme";

export interface WeekStripProps {
    daysActive: string;
    editMode: boolean;
    onDaySelected?: (index: number) => void;
}

export default class WeekStrip extends React.Component<WeekStripProps, {}> {

    constructor(props: WeekStripProps) {
        super(props);
        this.getDayStyle = this.getDayStyle.bind(this);
        this.onDaySelected = this.onDaySelected.bind(this);
    }

    render(): JSX.Element {
        return (<View style={this.props.editMode ? [styles.item, styles.editMode] : styles.item}>
            <TouchableRipple style={styles.ripple} onPress={this.props.editMode ? () => { this.onDaySelected(1) } : undefined}>
                <MeridiaText style={this.getDayStyle(1)}>Mo</MeridiaText>
            </TouchableRipple>
            <TouchableRipple style={styles.ripple} onPress={this.props.editMode ? () => { this.onDaySelected(2) } : undefined}>
                <MeridiaText style={this.getDayStyle(2)}>Tu</MeridiaText>
            </TouchableRipple>
            <TouchableRipple style={styles.ripple} onPress={this.props.editMode ? () => { this.onDaySelected(3) } : undefined}>
                <MeridiaText style={this.getDayStyle(3)}>We</MeridiaText>
            </TouchableRipple>
            <TouchableRipple style={styles.ripple} onPress={this.props.editMode ? () => { this.onDaySelected(4) } : undefined}>
                <MeridiaText style={this.getDayStyle(4)}>Th</MeridiaText>
            </TouchableRipple>
            <TouchableRipple style={styles.ripple} onPress={this.props.editMode ? () => { this.onDaySelected(5) } : undefined}>
                <MeridiaText style={this.getDayStyle(5)}>Fr</MeridiaText>
            </TouchableRipple>
            <TouchableRipple style={styles.ripple} onPress={this.props.editMode ? () => { this.onDaySelected(6) } : undefined}>
                <MeridiaText style={this.getDayStyle(6)}>Sa</MeridiaText>
            </TouchableRipple>
            <TouchableRipple style={styles.ripple} onPress={this.props.editMode ? () => { this.onDaySelected(0) } : undefined}>
                <MeridiaText style={this.getDayStyle(0)}>Su</MeridiaText>
            </TouchableRipple>
        </View>);
    }

    private getDayStyle(index: number): RegisteredStyle<any>[] | '' {
        let indexAsString: string = index.toString();
        let returnedValue: RegisteredStyle<any>[] = [styles.weekDay];
        if (this.props.editMode) {
            returnedValue.push(styles.weekDayEdit);
        }
        if (this.props.daysActive && this.props.daysActive.indexOf(indexAsString) > -1) {
            if (this.props.editMode) {
                returnedValue.push(styles.daySelected);
            } else {
                returnedValue.push(styles.bold);
            }
        }
        return returnedValue;
    }

    private onDaySelected(index: number): void {
        this.props.onDaySelected && this.props.onDaySelected(index);
    }
}

const styles = StyleSheet.create({
    bold: {
        borderWidth: 2,
        borderRadius: 4,
        borderColor: Theme.COLOR_SECONDARY,
        width: 30
    },
    editMode: {
        borderRadius: 4,
        borderColor: Theme.COLOR_SECONDARY,
        backgroundColor: Theme.COLOR_SECONDARY,
        color: Theme.COLOR_BACKGROUND,
        padding: 4,
        justifyContent: 'center',
    },
    item: {
        flexDirection: 'row',
        marginTop: 12
    },
    weekDay: {
        width: 28,
        textAlign: 'center',
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 16
    },
    weekDayEdit: {
        color: Theme.COLOR_BACKGROUND,
    },
    button: {
        padding: 0,
        borderWidth: 0
    },
    daySelected: {
        color: Theme.COLOR_PRIMARY,
        backgroundColor: Theme.COLOR_BACKGROUND,
        borderRadius: 4
    },
    ripple: {
        margin: 2,
        borderRadius: 4,
    }
});
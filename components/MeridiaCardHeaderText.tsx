import * as React from "react";
import MeridiaText, {MeridiaTextProps} from "./MeridiaText";
import {StyleProp, StyleSheet, Text, TextStyle} from "react-native";

export interface MeridiaCardHeaderTextProps {
    style?: StyleProp<TextStyle>;
}

export default class MeridiaCardHeaderText extends React.Component<MeridiaCardHeaderTextProps,{}> {
    render() {
        return (
            <MeridiaText style={[styles.cardHeaderStyle, this.props.style]}>
                <Text>{this.props.children}</Text>
            </MeridiaText>
        );
    }

}

const styles = StyleSheet.create({
    cardHeaderStyle: {
        textAlign: 'center',
        padding: 8,
    }
});
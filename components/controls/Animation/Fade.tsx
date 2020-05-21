import { Animated, ViewStyle, StyleProp } from 'react-native';
import React from 'react';

export interface FadeProps {
    visible: boolean;
    style?: StyleProp<ViewStyle>
}

interface FadeState {
    visible: boolean;
}

export default class Fade extends React.Component<FadeProps, FadeState> {
    _visibility: any;
    constructor(props: FadeProps) {
        super(props);
        this.state = {
            visible: props.visible,
        };
    };

    componentWillMount() {
        this._visibility = new Animated.Value(this.props.visible ? 1 : 0);
    }

    componentWillReceiveProps(nextProps: FadeProps) {
        if (nextProps.visible) {
            this.setState({ visible: true });
        }
        Animated.timing(this._visibility, {
            toValue: nextProps.visible ? 1 : 0,
            duration: 300,
        }).start(() => {
            this.setState({ visible: nextProps.visible });
        });
    }

    render() {
        const { visible, style, children, ...rest } = this.props;

        const containerStyle = {
            opacity: this._visibility.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),
            transform: [
                {
                    scale: this._visibility.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1.05, 1],
                    }),
                },
            ],
        };

        const combinedStyle = [containerStyle, style];
        return (
            <Animated.View style={this.state.visible ? combinedStyle : containerStyle} {...rest}>
                {this.state.visible ? children : null}
            </Animated.View>
        );
    }
}
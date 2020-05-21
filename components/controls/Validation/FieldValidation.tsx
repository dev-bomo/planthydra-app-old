import React, { ReactElement } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as validate from "validate.js";
import Theme from "../../../assets/theme/theme";
import { isThisISOWeek } from "date-fns";

export interface FieldValidationProps {
    type: string;
    value: any;
    onErrorStatusChanged: (errorStatus: boolean) => void;
}

export default class FieldValidation extends React.Component<FieldValidationProps, {}> {

    private _hasError: boolean = false;

    render(): JSX.Element {

        let { type, value }: FieldValidationProps = this.props;

        let result;
        let child: ReactElement<any> = React.Children.only(this.props.children);

        if (value) {
            result = validate.validate({ [type]: value }, validationDictionary, { fullMessages: false });

            if (result && result[type]) {
                let oldStyle = child.props.style;
                let newChild: ReactElement<any> = React.cloneElement(child, { style: [oldStyle, styles.errorStyle] })

                return (<View>
                    {newChild}
                    {result && result[type] && this.getError(result[type][0])}
                </View>);
            }
        }

        return (<View>
            {child}
        </View>);
    }

    componentDidUpdate(prevProps: FieldValidationProps) {
        let { type, value }: FieldValidationProps = prevProps;
        if (value) {
            let result = validate.validate({ [type]: value }, validationDictionary, { fullMessages: false });
            if (result && result[type]) {
                this.toggleErrorStatus(true);
            } else {
                this.toggleErrorStatus(false);
            }
        }
    }

    private toggleErrorStatus(hasError: boolean): void {
        if (this._hasError && hasError === false) {
            this.props.onErrorStatusChanged(false);
        } else if (!this._hasError && hasError === true) {
            this.props.onErrorStatusChanged(true);
        }

        this._hasError = hasError;
    }

    private getError(error: string): JSX.Element {
        return (<Text style={styles.errorContainer}>{error}</Text>);
    }
}

const styles = StyleSheet.create({
    errorContainer: {
        color: Theme.COLOR_ERROR,
        textAlign: 'right',
        fontWeight: '800',
    },
    errorStyle: {
        backgroundColor: Theme.COLOR_ERROR_OPAQUE,
        color: Theme.COLOR_BACKGROUND
    }
});

export const validationDictionary = {
    email: {
        presence: {
            allowEmpty: false,
            message: 'Field is required'
        },
        email: {
            message: 'Must be a valid email address'
        }
    },
    passwordRecovery: {
        presence: {
            allowEmpty: false,
            message: 'Must specify a password recovery code'
        }
    },
    password: {
        presence: {
            allowEmpty: false,
            message: 'Must specify a password'
        },
        length: {
            minimum: 6,
            message: 'Must be at least 6 caracters long'
        },
        format: {
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&+=`|{}:;!.?\""()\[\]-]{1,}$/,
            message: "Must contain one capital, one lowercase, one digit and one special character"
        },
    },

    confirmPassword: {
        equality: {
            attribute: 'password',
            message: 'Must be the same as password',
            comparator: function (both: any) {
                return both.password === both.confirmPassword
            }
        }
    }
}
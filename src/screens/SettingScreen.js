import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from "react-native";

import { Container, Header, Content, Form, Item, Input, Label, Button, Title, Toast, Root } from 'native-base';
import settingContainer from '../containers/SettingContainer'

import { saveSettings } from '../helpers/utils'
import { SubscribeOne } from "unstated-x";
// import console = require("console");

export default class SettingScreen extends React.Component {
    onSaveSettingHandle = () => {

        const data = {
            addRate: Number(settingContainer.state.addRate) === NaN ? 1 : Number(settingContainer.state.addRate),
            playBack: Number(settingContainer.state.playBack) === NaN ? 5 : Number(settingContainer.state.playBack)
        }

        saveSettings(data)
        // settingContainer.setState({
        //     addRate: Number(settingContainer.state.addRate) === NaN ? 1 : Number(settingContainer.state.addRate),
        //     playBack: Number(settingContainer.state.playBack) === NaN ? 5 : Number(settingContainer.state.playBack)
        // }, () => {
        //     AsyncStorage.setItem('WeleSetting', JSON.stringify(settingContainer.state))
        //     ToastAndroid.showWithGravityAndOffset(
        //         'Setting Success !!',
        //         ToastAndroid.LONG,
        //         ToastAndroid.BOTTOM,
        //         30,
        //         50,
        //     );
        // })
    }
    render() {
        return (
            <SubscribeOne to={settingContainer} bind={['addRate', 'playBack']}>
                {
                    setting => {
                        return (
                            <Root>
                                <Container>
                                    <Header primary
                                        style={styles.header}
                                    ><Title>Settings</Title></Header>
                                    <Content >
                                        <Form style={styles.container}>
                                            <Item floatingLabel>
                                                <Label>Speed</Label>
                                                <Input value={setting.state.addRate.toString()}
                                                    onChangeText={(text) => { setting.setState({ addRate: text }) }}
                                                />
                                            </Item>
                                            <Item floatingLabel last>
                                                <Label>PlayBack</Label>
                                                <Input value={setting.state.playBack.toString()}
                                                    onChangeText={(text) => { setting.setState({ playBack: text }) }}
                                                />
                                            </Item>
                                            <Button style={styles.button} rounded success
                                                onPress={this.onSaveSettingHandle}
                                            >
                                                <Text>Save Settings</Text>
                                            </Button>
                                        </Form>
                                    </Content>

                                </Container>
                            </Root>
                        )
                    }
                }
            </SubscribeOne>

        )
    }
}

var styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
        width: '80%'
    },
    header: {
        justifyContent: 'center',
        paddingTop: 20
    },
    button: {
        marginTop: 20,
        height: 40,
        paddingRight: 10,
        paddingLeft: 10,
    }
})
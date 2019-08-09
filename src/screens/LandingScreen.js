import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Screen from "../components/Screen";
import DocumentPicker from 'react-native-document-picker';


export default class LandingScreen extends Screen {
    static navigationOptions = {
        leftButtonText: "Menu",
        title: "Landing"
    };

    onFilePickerHandle = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
            });
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Example Demos</Text>
                <TouchableOpacity onPress={() => this.navigateTo("Playlist")}>
                    <Text>Playlist Example</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onFilePickerHandle()}>
                    <Text>Test File Picker </Text>
                </TouchableOpacity>
  
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    header: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 10,
        fontWeight: "bold",
        textAlign: "center"
    }
});
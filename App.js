import React from "react";
import { createStackNavigator, createAppContainer, createDrawerNavigator, createBottomTabNavigator } from "react-navigation";


import { Text, View, StyleSheet } from 'react-native'

import PlaylistScreen from './src/screens/PlaylistScreen'
import PlayerScreen from "./src/screens/PlayerScreen";
import AddPlaylistScreen from "./src/screens/AddPlaylistScreen"

import DrawerLayout from 'react-native-drawer-layout-polyfill';
import SettingScreen from './src/screens/SettingScreen'

import { Root } from 'native-base'

import { Provider } from 'unstated-x'

import {PermissionsAndroid} from 'react-native';


import { getSettings } from './src/helpers/utils'

const AppNavigator = createStackNavigator(
  {
    Playlist: {
      screen: PlaylistScreen
    },
    Player: {
      screen: PlayerScreen
    },
    AddPlaylist: {
      screen: AddPlaylistScreen
    }
  },
  { initialRouteName: "Playlist" }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {

    requestFolderAccessPermission = async ()=> {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Wele Tool Permissions',
          message:
            'Cool Photo App needs access to your Foler ' +
            'so you can play your own playlist.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can access the folder');
      } else {
        console.log('Folder permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  drawer = {}
  closeDrawer = () => {
    this.drawer._root.close()
  };

  componentDidMount = async () => {
    await getSettings()
    await this.requestFolderAccessPermission()
  }
  render() {
    return (
      <Root>
        <Provider>

          <DrawerLayout
            drawerWidth={300}
            keyboardDismissMode="on-drag"
            statusBarBackgroundColor="blue"
            renderNavigationView={() => <SettingScreen />}>
            <AppContainer />
          </DrawerLayout>


        </Provider>
      </Root>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
})

import uuid from 'uuid'
import settingContainer from '../containers/SettingContainer'
import playlistContainer from '../containers/PlayListContainer'
import AsyncStorage from '@react-native-community/async-storage'
import { ToastAndroid } from 'react-native'

export const WELE_PLAYLISTS = 'wele_playlists'
export const CURRENT_PLAYLIST = 'wele_current_playlist'
export const SETTING = 'wele_setting'

export const saveCurrentList = (data) => {
    playlistContainer.setState({ currentPlaylist: data }, () => {
        AsyncStorage.setItem(CURRENT_PLAYLIST, JSON.stringify(playlistContainer.state.currentPlaylist))
    })
}

export const getCurrentPlayList = async () => {
    const currentPlaylist = await AsyncStorage.getItem(CURRENT_PLAYLIST)
    if (currentPlaylist) {
        const currentPlaylistJSON = JSON.parse(currentPlaylist)
        await playlistContainer.setState({
            currentPlaylist: currentPlaylistJSON
        })
    }
}

export const saveWelePlayList = async (data) => {

    const uid = data.key ? data.key : uuid()

    if (!data.key) {
        const welePlaylistData = [...playlistContainer.state.welePlaylist, {
            key: uid,
            ...data
        }]
        await AsyncStorage.setItem(WELE_PLAYLISTS, JSON.stringify(welePlaylistData))

        await playlistContainer.setState({ welePlaylist: welePlaylistData })
        toast('Add Playlist Successful !')
    } else {
        const welePlaylistData = [...playlistContainer.state.welePlaylist.filter(e => e.key !== uid), {
            key: uid,
            ...data
        }]
        await AsyncStorage.setItem(WELE_PLAYLISTS, JSON.stringify(welePlaylistData))
        await playlistContainer.setState({ welePlaylist: welePlaylistData })
        toast('Edit Playlist Successful !')
    }
}



export const deleteWelePlayList = async (key) => {
    const welePlaylistData = playlistContainer.state.welePlaylist.filter(e => e.key !== key)
    await AsyncStorage.setItem(WELE_PLAYLISTS, JSON.stringify(welePlaylistData))
    await playlistContainer.setState({ welePlaylist: welePlaylistData })
    toast('Delete Playlist Successful !')
}

export const getWelePlayList = async () => {
    const welePlaylist = await AsyncStorage.getItem(WELE_PLAYLISTS)
    if (welePlaylist) {
        const welePlaylistData = JSON.parse(welePlaylist)
        await playlistContainer.setState({
            welePlaylist: welePlaylistData
        })
    }
}


export const saveSettings = (data) => {
    settingContainer.setState({
        ...data
        // addRate: Number(settingContainer.state.addRate) === NaN ? 1 : Number(settingContainer.state.addRate),
        // playBack: Number(settingContainer.state.playBack) === NaN ? 5 : Number(settingContainer.state.playBack)
    }, () => {
        AsyncStorage.setItem(SETTING, JSON.stringify(settingContainer.state))
        toast('Settings Saved')
    })
}

export const toast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        30,
        50,
    );
}

export const getSettings = async () => {
    const state = await AsyncStorage.getItem(SETTING)
    if (state) {
        settingContainer.setState(JSON.parse(state))
    }
}

export const clear = () => {
    AsyncStorage.clear()
}

export const trimString = (string, threshold = 30) => {
    if (string.length <= threshold) {
        return string
    } else {
        return string.substring(0, threshold) + '...'
    }
}
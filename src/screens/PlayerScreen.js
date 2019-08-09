import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from 'native-base'
import TrackPlayer, { usePlaybackState } from "react-native-track-player";
import Player from "../components/Player";
import localTrack from "../resources/pure.m4a";
import { toast } from '../helpers/utils'


export default class PlayerScreen extends React.Component {
    state = {
        playbackState: TrackPlayer.STATE_NONE
    }

    sub = null
    componentDidMount = async () => {
        this.sub = TrackPlayer.addEventListener(TrackPlayer.TrackPlayerEvents.PLAYBACK_STATE, data => {
            this.setState({ playbackState: data.state })
        })

        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_STOP,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_SEEK_TO
            ],
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_STOP,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_SEEK_TO
            ]
        });
        await TrackPlayer.reset();
    }

    componentWillUnmount = () => {
        this.sub.remove()
    }

    onSlideCompleteHandle = async (value) => {
        TrackPlayer.seekTo(value)
    }

    onSetRateHandle = async (value) => {
        currentRate = await TrackPlayer.getRate()
        await TrackPlayer.setRate(currentRate * value)
        if(value < 1.0){
            toast(`Slower ${value} times !`)
        }else{
            toast(`Faster ${value} times !`)
        }
        
    }

    seekBack = async (value) => {
        const position = await TrackPlayer.getPosition()
        await TrackPlayer.seekTo(position - value < 0 ? 0 : position - value)
        toast(`play back ${value} seconds !`)
    }

    togglePlayback = async (playList) => {
        const playListData = Object.assign([], playList)
        const currentTrack = await TrackPlayer.getCurrentTrack()
        if (currentTrack == null) {


            await TrackPlayer.add(playListData);
            await TrackPlayer.add({
              id: "local-track",
              url: localTrack,
              title: "Pure (Demo)",
              artist: "David Chavez",
              artwork: "https://picsum.photos/200"
            });
            await TrackPlayer.play();
            toast(`Playing`)
        } else {
            if (this.state.playbackState === TrackPlayer.STATE_PAUSED) {
                await TrackPlayer.play();
                toast(`Playing`)
            } else {
                await TrackPlayer.pause();
                toast(`Paused`)
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <View style={styles.container}>
                    <Player
                        onNext={skipToNext}
                        style={styles.player}
                        onPrevious={skipToPrevious}
                        onTogglePlayback={this.togglePlayback}
                        onSlideCompleteHandle={this.onSlideCompleteHandle}
                        onSetRateHandle={this.onSetRateHandle}
                        seekBack={this.seekBack}
                    />
                </View>
                <View style={styles.container2}>
                    <Button style={styles.leftbutton} rounded success
                        onPress={skipToPrevious}
                    >
                        <Text>Previous</Text>
                    </Button>
                    <Button style={styles.rightbutton} rounded success
                        onPress={skipToNext}
                    >
                        <Text>Next</Text>
                    </Button>
                </View>
            </React.Fragment>)
    }
}

PlayerScreen.navigationOptions = {
    title: 'Player'
}


async function skipToNext() {
    try {
        await TrackPlayer.skipToNext();
    } catch (_) { }
}

async function skipToPrevious() {
    try {
        await TrackPlayer.skipToPrevious();
    } catch (_) { }
}

const styles = StyleSheet.create({
    container: {

        flex: 0.6,
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    container2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flex: 0.2

    },
    description: {
        width: "80%",
        marginTop: 20,
        textAlign: "center"
    },
    player: {
        marginTop: 40
    },
    state: {
        marginTop: 20
    },
    leftbutton: {
        marginLeft: 20,
        marginTop: 20,
        height: 40,
        padding: 10,
        width: 100,
        justifyContent: 'center',
    },
    rightbutton: {
        marginRight: 20,
        marginTop: 20,
        height: 40,
        width: 100,
        justifyContent: 'center',
        padding: 10,
    }
});

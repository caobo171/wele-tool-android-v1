import React, { useState } from "react";
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState,
  useTrackPlayerEvents
} from "react-native-track-player";


import settingContainer from '../containers/SettingContainer'
import Slider from '@react-native-community/slider';

import { trimString } from '../helpers/utils'



import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from "react-native";


import Icon from 'react-native-vector-icons/FontAwesome';
import { SubscribeOne } from "unstated-x";
import playlistContainer from "../containers/PlayListContainer";

function ProgressBar(props) {
  const progress = useTrackPlayerProgress();

  return (
    <View style={styles.progress}>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={progress.duration}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        value={progress.position}

        onSlidingComplete={(value) => {
          props.onSlideCompleteHandle(value)
        }}

      />
    </View>
  );
}

function ControlButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.controlButtonContainer} onPress={onPress}>
      <Icon
        height={60}
        name={title}
        style={styles.controlButtonText}
      ></Icon>
      {/* <Text>{title}</Text> */}
    </TouchableOpacity>
  );
}


export default function Player(props) {
  const playbackState = usePlaybackState();
  const [trackTitle, setTrackTitle] = useState("");
  const [trackArtist, setTrackArtist] = useState("");


  useTrackPlayerEvents(["playback-track-changed"], async event => {
    if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setTrackTitle(track.title);
      setTrackArtist(track.artist);
    }
  });

  const { style, onTogglePlayback, onSlideCompleteHandle, onSetRateHandle, seekBack } = props;

  onPlayBackHandle = (value) => {
    seekBack(value)
  }
  var middleButtonText = "play";
  if (
    playbackState === TrackPlayer.STATE_PLAYING ||
    playbackState === TrackPlayer.STATE_BUFFERING
  ) {
    middleButtonText = "stop";
  }

  return (
    <SubscribeOne to={playlistContainer} bind={['currentPlaylist']}>
      {
        pll => {
          return (
            <SubscribeOne to={settingContainer} bind={['addRate', 'playBack']}>
              {
                setting => {
                  return (
                    <View style={[styles.card, style]}>
                      <Image style={styles.cover} source={require('../images/wele.jpg')} />
                      <ProgressBar onSlideCompleteHandle={onSlideCompleteHandle} />
                      <Text style={styles.title}>{trimString(trackTitle, 30)}</Text>
                      <Text style={styles.artist}>{trackArtist}</Text>
                      <View style={styles.controls}>
                        <ControlButton title="fast-backward" onPress={() => onSetRateHandle(1.0 / (setting.state.addRate))} />
                        <ControlButton title={"backward"} onPress={() => onPlayBackHandle(setting.state.playBack)} />
                        <ControlButton title={middleButtonText} onPress={() => onTogglePlayback(pll.state.currentPlaylist)} />
                        <ControlButton title="fast-forward" onPress={() => onSetRateHandle(setting.state.addRate)} />
                      </View>
                    </View>
                  )
                }
              }

            </SubscribeOne>
          )
        }
      }
    </SubscribeOne>

  );
}





Player.defaultProps = {
  style: {}
};

const styles = StyleSheet.create({
  card: {
    width: "80%",
    elevation: 1,
    borderRadius: 4,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    alignItems: "center",
    shadowColor: "black",
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 1 }
  },
  cover: {
    width: 140,
    height: 140,
    marginTop: 20,
    backgroundColor: "grey"
  },
  progress: {
    height: 1,
    width: "90%",
    marginTop: 10,
    flexDirection: "row"
  },
  title: {
    marginTop: 30
  },
  artist: {
    fontWeight: "bold"
  },
  controls: {
    marginVertical: 20,
    flexDirection: "row"
  },
  controlButtonContainer: {
    flex: 1
  },
  controlButtonText: {
    fontSize: 18,
    textAlign: "center"
  }
});
import React, { Component } from 'react';
import { StyleSheet } from 'react-native'
import {
    Container, Header, Content, Form, Item, Input, Label,
    Icon, Button, Text, List, ListItem, Thumbnail, Left, Body, Right
} from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import FilePickerManager from 'react-native-file-picker';
import uuid from 'uuid'
import AsyncStorage from '@react-native-community/async-storage'
import RNFileSelector from 'react-native-file-selector';
import { trimString, saveWelePlayList, saveCurrentList } from '../helpers/utils'
import playlistContainer from '../containers/PlayListContainer';

var RNGRP = require('react-native-get-real-path');

// import { DocumentPicker, ImagePicker } from 'expo';



export default class AddPlaylistScreen extends Component {

    state = {
        playListTitle: '',
        playListSongs: [],
        edit: false,
        playlistKey: null
    }

    componentDidMount = () => {
        const playlistKey = this.props.navigation.getParam('playlistKey', null)
        if (playlistKey) {
            const playList = playlistContainer.state.welePlaylist.find(e => e.key === playlistKey)

            if (playList) {
                this.setState({
                    playListSongs: playList.songs,
                    edit: true,
                    playlistKey,
                    playListTitle: playList.title
                })
            }
        }
    }

    onPickHandle = async () => {

        // let result = await DocumentPicker.getDocumentAsync({});
        // alert(result.uri);
        // console.log(result)
        // console.log(result);


        const res = await DocumentPicker.pickMultiple({
            type: [DocumentPicker.types.audio],
        });
 
        let playListSongs = res.map(result => {
            const path = RNGRP.getRealPathFromURI(result.uri)
    
            var uri_dec = decodeURIComponent(result.uri);
            var realpath = 'file:///'+ uri_dec.split(':')[uri_dec.split(':').length -1]
            console.log('check ', realpath , result.uri)
            return {
                id: uuid(),
                url: result.uri,
                title: result.name,
                artist: "David Chavez",
                artwork: "https://picsum.photos/200"
            }
        })
        let playList = [...this.state.playListSongs, ...playListSongs]
        this.setState({ playListSongs: playList })


        // await RNFileSelector.Show(
        //     {
        //         title: 'Select File',
        //         onDone: (path) => {
        //             console.log('file selected: ' + path)
        //         },
        //         onCancel: () => {
        //             console.log('cancelled')
        //         }
        //     }
        // )

        // FilePickerManager.showFilePicker(null, (response) => {
        //     console.log('Response = ', response);
          
        //     if (response.didCancel) {
        //       console.log('User cancelled file picker');
        //     }
        //     else if (response.error) {
        //       console.log('FilePickerManager Error: ', response.error);
        //     }
        //     else {
        //       this.setState({
        //         file: response
        //       });
        //     }
        //   });
    }

    setName = (value) => {
        this.setState({ playListTitle: value })
    }

    onSaveHandle = async () => {
        if (this.state.edit) {
            saveWelePlayList({
                title: this.state.playListTitle,
                songs: this.state.playListSongs,
                key: this.state.playlistKey
            })
        } else {
            saveWelePlayList({
                title: this.state.playListTitle,
                songs: this.state.playListSongs
            })

        }

        this.reset()
    }

    reset = () => {
        this.setState({
            playListTitle: '',
            playListSongs: []
        }, () => {
            this.props.navigation.navigate('Playlist')
        })
    }
    renderForm = () => {
        const title = this.state.playListTitle.replace(/\s/g, "")
        if (title === '') {
            return (
                <Item floatingLabel>
                    <Label>Title</Label>
                    <Input onChangeText={this.setName} value={this.state.playListTitle} />
                </Item>
            )
        } else if (false) {

        } else {
            return (
                <Item floatingLabel success>
                    <Label>Title</Label>
                    <Input onChangeText={this.setName} value={this.state.playListTitle} />
                    <Icon name='checkmark-circle' />
                </Item>
            )
        }
    }
    render() {


        return (
            <Container>
                <Content>
                    <Form style={styles.form}>
                        <RNFileSelector title={"Select File"} visible={this.state.visible} onDone={() => {
                            console.log("file selected: " + path);
                        }} onCancel={() => {
                            console.log("cancelled");
                        }} />
                        {this.renderForm()}
                        {
                            this.state.edit && (
                                <Button
                                    onPress={() => {
                                        saveCurrentList(this.state.playListSongs)
                                        this.props.navigation.navigate("Player", {
                                            playlistKey: this.state.playlistKey
                                        })
                                    }}
                                    style={styles.buttonsongpicker} full warning
                                >
                                    <Text>
                                        Open Playlist
                                    </Text>
                                </Button>
                            )
                        }
                        {
                            this.state.playListSongs.length > 0 && (
                                <Button
                                    onPress={this.onSaveHandle}
                                    style={styles.buttonsongpicker} full success
                                >
                                    <Text>
                                        Save PlayList
                                    </Text>
                                </Button>
                            )
                        }

                        <Button
                            onPress={this.onPickHandle}
                            style={styles.buttonsongpicker} full info >
                            <Text>
                                Pick songs
                        </Text>
                        </Button>
                    </Form>
                    <List style={styles.list}>
                        {
                            this.state.playListSongs.map(song => {
                                return (
                                    <ListItem style={styles.listitem} icon key={song.id}>
                                        <Body style={styles.bodyitem}>
                                            <Text>{trimString(song.title)}</Text>
                                        </Body>
                                        <Right>
                                            <Button transparent
                                                onPress={() => {
                                                    this.setState({ playListSongs: this.state.playListSongs.filter(e => e.id !== song.id) })
                                                }}
                                            >
                                                <Icon name="trash" success></Icon>
                                            </Button>
                                        </Right>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Content>
            </Container>
        );
    }
}

AddPlaylistScreen.navigationOptions = {
    title: 'Add Playlist'
}

const styles = StyleSheet.create({
    form: {
        padding: 20,

    },
    buttonsongpicker: {
        marginTop: 10
    },
    list: {
        marginRight: 10
    },
    listitem: {
        marginTop: 10
    },
    bodyitem: {
        paddingBottom: 10
    }
})
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Container, Fab, Content, Card, CardItem, Thumbnail, Text, Button, Left, Body, Right, List, ListItem } from 'native-base';

import DocumentPicker from 'react-native-document-picker';
import uuid from 'uuid'
import playlistContainer from '../containers/PlayListContainer'

import { getCurrentPlayList, getWelePlayList, deleteWelePlayList, saveCurrentList, clear, trimString } from '../helpers/utils'

import { SubscribeOne } from 'unstated-x'

// import RNFetchBlob from 'react-native-fetch-blob'

import RNGRP from 'react-native-get-real-path'

export default class PlaylistScreen extends Component {
    state = {
        active: false
    }


    componentDidMount = async () => {
        await getWelePlayList()
        await getCurrentPlayList()
 
    }

    onAddPlaylistHandle = () => {

        this.props.navigation.navigate('AddPlaylist')

    }

    onOpenPlaylistHandle = async () => {
        const res = await DocumentPicker.pickMultiple({
            type: [DocumentPicker.types.audio],
        });


        const playDataList = await res.map(async (result) => {

            let correctPath = result.uri
            if (result.uri.indexOf('externalstorage') !== -1) {
                const stats = await RNGRP.getRealPathFromURI(result.uri)// Relative path obtained from document picker
                var str1 = "file://";
                var str2 = stats
                correctPath = str1.concat(str2);
            }
     
            return {
                id: uuid(),
                url: correctPath,
                title: result.name,
                artist: "David Chavez",
                artwork: "https://picsum.photos/200"
            }
        })

        const data = await Promise.all(playDataList)

        console.log('check ', data)

        await saveCurrentList(data)
        this.props.navigation.navigate("Player")
    }


    onDeletePlaylist = async (key) => {

        deleteWelePlayList(key)
    }

    render() {
        return (
            <SubscribeOne to={playlistContainer} bind={['currentPlaylist', 'welePlaylist']}>
                {
                    pll => {
                        return (
                            <Container>
                                <Content>
                                    {pll.state.currentPlaylist && (
                                        <Card>
                                            <CardItem>
                                                <Left>
                                                    <Thumbnail source={require('../images/wele.jpg')} />
                                                    <Body>
                                                        <Text>Last Playlist</Text>
                                                        <Text note>GeekyAnts</Text>

                                                    </Body>
                                                </Left>
                                                <Right>
                                                    <Button
                                                        onPress={(value) => {
                                                            this.props.navigation.navigate("Player")
                                                        }}
                                                        small warning>
                                                        <Text>Open</Text>
                                                    </Button>
                                                </Right>

                                            </CardItem>
                                        </Card>)}
                                    <List>
                                        {
                                            pll.state.welePlaylist.map(playlist => {
                                                return (
                                                    <ListItem thumbnail key={playlist.key}>
                                                        <Left>
                                                            <Thumbnail square source={require('../images/wele.jpg')} />
                                                        </Left>
                                                        <Body>
                                                            <Text>{trimString(playlist.title, 10)}</Text>
                                                        </Body>
                                                        <Right style={{ flexDirection: 'row' }}>
                                                            <Button transparent onPress={() => this.onDeletePlaylist(playlist.key)}>
                                                                <Text>Delete</Text>
                                                            </Button>
                                                            <Button transparent onPress={async () => {
                                                                // saveCurrentList(playlist.songs)
                                                                //   this.props.navigation.navigate("Player",{
                                                                //     playlistKey: playlist.key
                                                                // })
                                                                this.props.navigation.navigate("AddPlaylist", {
                                                                    playlistKey: playlist.key
                                                                })

                                                            }}>
                                                                <Text>View</Text>
                                                            </Button>
                                                        </Right>
                                                    </ListItem>)
                                            })
                                        }
                                    </List>
                                </Content>
                                <Fab
                                    active={this.state.active}
                                    direction="up"
                                    containerStyle={{}}
                                    style={{ backgroundColor: '#5067FF' }}
                                    position="bottomRight"
                                    onPress={() => {
                                        this.setState({ active: !this.state.active })
                                    }}>
                                    <AntDesign name="setting" backgroundColor="green" />
                                    <Button style={{ backgroundColor: 'green' }} onPress={this.onAddPlaylistHandle}><Icon name="plus" /></Button>
                                    <Button style={{ backgroundColor: 'red' }} onPress={this.onOpenPlaylistHandle}><Icon name="folder-open-o" /></Button>
                                </Fab>
                            </Container>
                        )
                    }
                }
            </SubscribeOne>

        );
    }
}


PlaylistScreen.navigationOptions = {
    title: 'Playlist'
}
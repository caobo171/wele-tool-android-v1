import {Container } from 'unstated-x'


 class PlaylistContainer extends Container {
    state = {
        currentPlaylist:null,
        welePlaylist:[]
    }
}

const playlistContainer = new PlaylistContainer()
export default playlistContainer 
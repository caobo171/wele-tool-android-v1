import {Container } from 'unstated-x'

 class SettingContainer extends Container {
    state = {
        addRate: 1,
        playBack: 5
    }
}

const settingContainer = new SettingContainer()
export default settingContainer 
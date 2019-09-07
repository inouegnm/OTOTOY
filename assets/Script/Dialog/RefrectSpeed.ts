import { musicSetting } from '../Util/Setting'

const { ccclass } = cc._decorator;

@ccclass
export default class RefrectSpeed extends cc.Component {

    start() {
        this.node.children[2].children[0].getComponent(cc.Label).string = musicSetting.noteSpeed.toString();
    }

    valueChanged() {
        let progress: number = this.node.getComponent(cc.Slider).progress;
        let speed = Math.floor(progress * 10);
        this.node.children[2].children[0].getComponent(cc.Label).string = speed.toString();
        musicSetting.noteSpeed = speed;
    }
}

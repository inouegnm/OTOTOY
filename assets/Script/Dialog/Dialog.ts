import * as Setting from '../Util/Setting';
import { dialogType } from '../Util/Setting';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dialog extends cc.Component {
    showDialog = (type: dialogType) => {
        this.node.children[1].children.forEach((parts, idx) => {
            parts.active = idx == type;
        });
        switch (type) {
            case dialogType.difficulty:
                this.node.children[1].children[type].children[0].getComponent(cc.Label).string = Setting.musicSelection.title;
                break;

            case dialogType.setting:

                break;

            case dialogType.pause:

                break;

            default:
                break;
        }
        this.node.active = true;
    }

    closeDialog() {
        this.node.active = false;
    }

    onClickStartGame(event: cc.Event) {
        let target: cc.Node = event.target;
        Setting.musicSelection.difficulty = target.name;
        cc.director.loadScene(Setting.GAMESCENE);
    }
}

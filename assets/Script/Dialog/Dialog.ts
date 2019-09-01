import selectedMusic from '../Menu/StartMenu';

export enum dialogType {
    difficulty = 0,
    setting = 1,
    pause = 2,
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dialog extends cc.Component {
    showDialog(type: dialogType) {
        this.node.children[1].children.forEach((parts, idx) => {
            parts.active = idx == type;
        });
        switch (type) {
            case dialogType.difficulty:
                this.node.children[1].children[type].children[0].getComponent(cc.Label).string = selectedMusic[0];
                break;

            case dialogType.setting:

                break;

            case dialogType.pause:

                break;

            default:
                break;
        }
        this.node.active = true
    }
}

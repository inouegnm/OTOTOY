const { ccclass } = cc._decorator;

@ccclass
export default class RefrectSpeed extends cc.Component {
    valueChanged() {
        let progress: number = this.node.getComponent(cc.Slider).progress;
        this.node.children[2].children[0].getComponent(cc.Label).string = Math.floor(progress * 10).toString();
    }
}

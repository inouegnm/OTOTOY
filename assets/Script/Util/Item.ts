const { ccclass } = cc._decorator;

@ccclass
export default class Item extends cc.Component {
    title: string
    clip: cc.AudioClip
    backgroundImage: string

    setParam(title: string, clip: cc.AudioClip, backgroundImage: string) {
        this.title = title;
        this.clip = clip;
        this.backgroundImage = backgroundImage;
        this.node.children[1].getComponent(cc.Label).string = title;
        this.node.getComponent(cc.AudioSource).clip = clip;
    }
}

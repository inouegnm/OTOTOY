import Item from '../Util/Item';
const { ccclass, property } = cc._decorator;

@ccclass
export default class StartMenu extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    itemPrefab: cc.Prefab = null;
    musics: Item[] = new Array();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.loader.loadRes('prefab/Item', cc.Prefab, (err, item) => {
            this.itemPrefab = item;
        });
    }

    start() {
        // TODO: Get Resources From Network
        this.forDebug();

        let array = this.musics;
        // 7以下の場合（あり得ない）は足りるように追加（後ほどあり得るかもしれないけど…）
        // while (array.length < 7) {
        //     let add = array[array.length - 2]
        //     array.push(add);
        // }

        array.forEach((musicinfo, idx) => {
            let item = cc.instantiate(this.itemPrefab);
            item.children[1].getComponent(cc.Label).string = musicinfo.title;
            let audioSource = item.getComponent(cc.AudioSource);
            item.parent = this.content;
            let audioID: number;
            cc.loader.loadResDir(musicinfo.soundPath, cc.AudioClip, (err, clip: cc.AudioClip[]) => {
                if (err) {
                    cc.error(err);
                    return;
                }
                if (cc.audioEngine.isMusicPlaying) {
                    cc.audioEngine.stopAll();
                }
                audioSource.clip = clip[idx];
            });
        });
    }

    // 現時点ではローカルに置いているが将来的にはクラウド管理がいい
    forDebug() {
        this.musics.push(new Item('Protocol Omega', 'musics/ADDrumnBass3'));
        this.musics.push(new Item('Open your eyes you freak', 'musics/ADDrumnBass3'));
        this.musics.push(new Item('Black Future', 'musics/ADDrumnBass3'));
        this.musics.push(new Item('Formula', 'musics/ADDrumnBass3'));
        this.musics.push(new Item('Eruption', 'musics/ADDrumnBass3'));
        this.musics.push(new Item('Hacker', 'musics/ADDrumnBass3'));
        this.musics.push(new Item('4_3', 'musics/ADDrumnBass3'));
        this.musics.push(new Item('8', 'musics/ADDrumnBass3'));
    }
    // update (dt) {}
}

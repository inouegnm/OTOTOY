import Item from '../Util/Item';
const { ccclass, property } = cc._decorator;

@ccclass
export default class StartMenu extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    // Item:button -> MusicTitle:label
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    musics: Item[] = new Array();

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // TODO: Get Resources From Network
        this.forDebug();

        let array = this.musics;
        let maxWidth: number = this.content.width;
        let totalWidth: number = 0;
        // 7以下の場合（あり得ない）は足りるように追加（後ほどあり得るかもしれないけど…）
        // while (array.length < 7) {
        //     let add = array[array.length - 2]
        //     array.push(add);
        // }

        array.forEach((musicinfo, idx) => {
            let item = cc.instantiate(this.itemPrefab);
            item.children[1].getComponent(cc.Label).string = musicinfo.title;
            item.parent = this.content;
            let move: number = (idx >= array.length - 3) ? item.width * (idx - array.length) : totalWidth;
            item.setPosition(new cc.Vec2(move, 0));
            totalWidth += item.width;
            let audioID: number;
            cc.loader.loadResDir('musics/ADDrumnBass3', cc.AudioClip, (err, clip: cc.AudioClip[]) => {
                if (err) {
                    cc.error(err);
                    return;
                }
                if (cc.audioEngine.isMusicPlaying) {
                    cc.audioEngine.stopAll();
                }
                cc.audioEngine.playMusic(clip[idx], false)
            });
            // cc.loader.loadRes(musicinfo.soundPath, cc.AudioClip, (err, clip: cc.AudioClip) => {
            //     if (err) {
            //         cc.error(err.message || err);
            //         return;
            //     }
            //     if (cc.audioEngine.isMusicPlaying) {
            //         cc.audioEngine.stopAll();
            //     }
            //     cc.audioEngine.playMusic(clip[idx], false)
            // });
        });

        this.content.width = totalWidth;
    }

    // 現時点ではローカルに置いているが将来的にはクラウド管理がいい
    forDebug() {
        this.musics.push(new Item('Protocol Omega', 'musics/ADDrumnBass3/1.mp3'));
        this.musics.push(new Item('Open your eyes you freak', 'musics/ADDrumnBass3/2.mp3'));
        this.musics.push(new Item('Black Future', 'musics/ADDrumnBass3/3.mp3'));
        this.musics.push(new Item('Formula', 'musics/ADDrumnBass3/4.mp3'));
        this.musics.push(new Item('Eruption', 'musics/ADDrumnBass3/5.mp3'));
        this.musics.push(new Item('Hacker', 'musics/ADDrumnBass3/6.mp3'));
        this.musics.push(new Item('4_3', 'musics/ADDrumnBass3/7.mp3'));
        this.musics.push(new Item('8', 'musics/ADDrumnBass3/8.mp3'));
    }
    // update (dt) {}
}

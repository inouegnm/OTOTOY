import Item from '../Util/Item';
const { ccclass, property } = cc._decorator;

@ccclass
export default class StartMenu extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    itemPrefab: cc.Prefab = null;
    musics: Item[] = new Array();
    clickEventHandler: cc.Component.EventHandler = new cc.Component.EventHandler();
    audioId: number = null;
    backgroundView: cc.Sprite = null;
    currentBackgroundView: string = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.loader.loadRes('prefab/Item', cc.Prefab, (err, item) => {
            if (err) {
                cc.error(err);
                return;
            }
            this.itemPrefab = item;
        });
        this.backgroundView = this.node.children[1].children[0].getComponent(cc.Sprite);
    }

    start() {
        this.clickEventHandler.component = "StartMenu";
        this.clickEventHandler.handler = "onClickMusicTitle";

        // TODO: Get Resources From Network
        this.forDebug();

        let array = this.musics;
        this.currentBackgroundView = array[0].backgroundImage;
        // 7以下の場合（あり得ない）は足りるように追加（後ほどあり得るかもしれないけど…）
        // while (array.length < 7) {
        //     let add = array[array.length - 2]
        //     array.push(add);
        // }

        let contentChild: cc.Node[] = new Array();
        array.forEach((musicinfo) => {
            let item = cc.instantiate(this.itemPrefab);
            item.parent = this.content;
            cc.loader.loadRes(musicinfo.soundPath, cc.AudioClip, (err, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(err);
                    return;
                }
                if (cc.audioEngine.isMusicPlaying) {
                    cc.audioEngine.stopAll();
                }
                item.getComponent(cc.AudioSource).clip = clip;
            });
            item.children[1].getComponent(cc.Label).string = musicinfo.title;
            this.clickEventHandler.target = item;
            item.getComponent(cc.Button).clickEvents.push(this.clickEventHandler);
        });
    }

    onClickMusicTitle(event: cc.Event) {
        let node: cc.Node = event.target;
        let audioSource: cc.AudioSource = node.getComponent(cc.AudioSource);
        cc.log(cc.audioEngine.isMusicPlaying());
        cc.log(this.audioId);

        // 難易度選択ダイアログを出す
    }

    onScrolled(event: cc.Event) {
        // 始点70*(n-2)+74
        // 中点70*(n-1)+74
        // 終点70*(n)+74
        // 上の選択肢にフォーカスをあてる
        console.log(this.content.position.y % 222);
        if (this.content.position.y % 222 < 0) {

        } else if

        // // 選択対象が変わったときBGMを切り替える
        // if(targetChanged) {
        // // 選択対象が一つ前に選択していた音楽のアルバムと違っているとき、背景画像を変える
        //     if (this.currentBackgroundView != targetChanged.backgroundImage) {
        //         this.backgroundView = targetChanged.backgroundImage
        //     }
        //     cc.audioEngine.stopMusic();
        //     this.audioId = cc.audioEngine.playMusic(audioSource.clip, false);
        // }
    }

    // 現時点ではローカルに置いているが将来的にはクラウド管理がいい
    forDebug() {
        this.musics.push(new Item('Protocol Omega', 'musics/ADDrumnBass3/1', 'image/ADDrumnBass3'));
        this.musics.push(new Item('Open your eyes you freak', 'musics/ADDrumnBass3/2', 'image/ADDrumnBass3'));
        this.musics.push(new Item('Black Future', 'musics/ADDrumnBass3/3', 'image/ADDrumnBass3'));
        this.musics.push(new Item('Formula', 'musics/ADDrumnBass3/4', 'image/ADDrumnBass3'));
        this.musics.push(new Item('Eruption', 'musics/ADDrumnBass3/5', 'image/ADDrumnBass3'));
        this.musics.push(new Item('Hacker', 'musics/ADDrumnBass3/6', 'image/ADDrumnBass3'));
        this.musics.push(new Item('4_3', 'musics/ADDrumnBass3/7', 'image/ADDrumnBass3'));
        this.musics.push(new Item('Broken', 'musics/ADDrumnBass3/8', 'image/ADDrumnBass3'));
        this.musics.push(new Item('I\'m a Fighter', 'musics/ADDrumnBass3/9', 'image/ADDrumnBass3'));
        this.musics.push(new Item('Finally Puzzle', 'musics/ADDrumnBass3/10', 'image/ADDrumnBass3'));
        this.musics.push(new Item('Dawnscape', 'musics/ADDrumnBass3/11', 'image/ADDrumnBass3'));
        this.musics.push(new Item('Central Nucleus', 'musics/ADDrumnBass3/12', 'image/ADDrumnBass3'));
        this.musics.push(new Item('So Far Gone', 'musics/ADDrumnBass3/13', 'image/ADDrumnBass3'));
        this.musics.push(new Item('physics', 'musics/ADDrumnBass3/14', 'image/ADDrumnBass3'));
    }
    // update (dt) {}
}

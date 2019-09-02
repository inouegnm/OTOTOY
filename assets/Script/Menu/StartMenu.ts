import Item from '../Util/Item';
import Dialog, { dialogType } from '../Dialog/Dialog';

const { ccclass, property } = cc._decorator;

export var selectedMusic: [string, cc.AudioClip] = [null, null];

@ccclass
export default class StartMenu extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    itemPrefab: cc.Prefab = null;
    musics: string[][] = new Array();
    clickEventHandler: cc.Component.EventHandler = new cc.Component.EventHandler();
    audioId: number = null;
    backgroundView: cc.Sprite = null;
    currentBackgroundView: string = null;
    contentChild: cc.Node[] = new Array();
    selectionArea: cc.Rect;
    bgmTitle: string;
    dialogPrefab: cc.Prefab;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.loader.loadResDir('prefab', cc.Prefab, (err, item) => {
            if (err) {
                cc.error(err);
                return;
            }
            this.itemPrefab = item[0];
            this.dialogPrefab = item[1];
        });
    }

    start() {
        this.clickEventHandler.component = "StartMenu";
        this.clickEventHandler.handler = "onClickMusicTitle";
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.backgroundView = this.node.children[1].children[0].getComponent(cc.Sprite);

        this.createSelectRect();

        // TODO: Get Resources From Network
        this.forDebug();

        let array = this.musics;
        this.currentBackgroundView = array[0][2];
        // 7以下の場合（あり得ない）は足りるように追加（後ほどあり得るかもしれないけど…）
        // while (array.length < 7) {
        //     let add = array[array.length - 2]
        //     array.push(add);
        // }

        array.forEach((musicinfo) => {
            let item = cc.instantiate(this.itemPrefab);
            item.parent = this.content;
            let itemClass: Item = item.getComponent(Item);
            cc.loader.loadRes(musicinfo[1], cc.AudioClip, (err, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(err);
                    return;
                }
                itemClass.setParam(musicinfo[0], clip, musicinfo[2]);
            });
            this.clickEventHandler.target = item;
            item.getComponent(cc.Button).clickEvents.push(this.clickEventHandler);
            this.contentChild.push(item);
        });

        // なぜかItem以下がundefindになる
        // let firstMusic = this.contentChild[0];
        // firstMusic.children[1].setScale(1.2, 1.2);

        // let firstMusicItem = this.contentChild[0].getComponent(Item);
        // this.audioId = cc.audioEngine.playMusic(firstMusicItem.clip, false);
        // this.bgmTitle = firstMusicItem.title;
        // console.log(this.bgmTitle)
        // cc.loader.loadRes(firstMusicItem.backgroundImage, cc.SpriteFrame, (err, res) => {
        //     if (err) {
        //         cc.error(err);
        //         return;
        //     }
        //     this.backgroundView.spriteFrame = res;
        // });
    }

    onClickMusicTitle(event: cc.Event) {
        let node: cc.Node = event.target;
        selectedMusic = [node.getComponent(Item).title, node.getComponent(Item).clip];
        console.log(selectedMusic)

        // 難易度選択ダイアログを出す
        // let dialog = cc.instantiate(this.dialogPrefab);
        // dialog.getComponent(Dialog).showDialog(dialogType.difficulty);
    }

    // 曖昧な位置にいたとき近くの選択肢に移動する
    onTouchEnd() {
        // contentの高さの絶対値から初期値分引いたもの
        let absY = this.content.position.y < 0 ? -this.content.position.y - 74 : this.content.position.y - 74;
        // absYをItemの高さ(148?)で割った余り
        let distanceNear = absY % 148;
        let moveTo: number = this.content.position.y;

        if (distanceNear < 37) { // 上にフォーカスする
            moveTo -= distanceNear;
        } else if (distanceNear < 111) { // フォーカスを選択していたものに戻す
            moveTo += 74 > distanceNear ? 74 + distanceNear : 74 - distanceNear;
        } else { // 下にフォーカスする
            moveTo += this.contentChild[0].height - distanceNear;
        }

        // アニメーション
        let tween = new cc.Tween().target(this.content)
            .to(0.5, { position: new cc.Vec2(0, moveTo) }, { progress: null, easing: null }).start();
        this.onScrolled();
    }

    onScrolled() {
        this.contentChild.forEach(item => {
            if (this.selectionArea.containsRect(item.getBoundingBoxToWorld())) {
                item.children[1].setScale(1.2, 1.2);
                // 選択対象が一つ前に選択していた音楽のアルバムと違っているとき、背景画像を変える
                // 変わったらロードするのではなくactiveの切り替えの方がいいのでは？
                if (this.currentBackgroundView != item.getComponent(Item).backgroundImage) {
                    cc.loader.loadRes(item.getComponent(Item).backgroundImage, cc.SpriteFrame, (err, res) => {
                        if (err) {
                            cc.error(err);
                            return;
                        }
                        this.backgroundView.spriteFrame = res;
                    });
                }
                // 選択対象が変わったときBGMを切り替える
                if (this.bgmTitle != item.getComponent(Item).title) {
                    cc.audioEngine.stopMusic();
                    this.audioId = cc.audioEngine.playMusic(item.getComponent(Item).clip, false);
                    this.bgmTitle = item.getComponent(Item).title;
                }
            } else {
                item.children.forEach(child => child.setScale(1, 1));
            }
        });
    }

    createSelectRect() {
        this.selectionArea = this.node.children[1].children[2].getBoundingBoxToWorld();
    }

    // 現時点ではローカルに置いているが将来的にはクラウド管理がいい
    forDebug() {
        this.musics.push(['Protocol Omega', 'musics/ADDrumnBass3/1', 'image/cover/ADDrumnBass']);
        this.musics.push(['Open your eyes you freak', 'musics/ADDrumnBass3/2', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Black Future', 'musics/ADDrumnBass3/3', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Formula', 'musics/ADDrumnBass3/4', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Eruption', 'musics/ADDrumnBass3/5', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Hacker', 'musics/ADDrumnBass3/6', 'image/cover/ADDrumnBass3']);
        this.musics.push(['4_3', 'musics/ADDrumnBass3/7', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Broken', 'musics/ADDrumnBass3/8', 'image/cover/ADDrumnBass3']);
        this.musics.push(['I\'m a Fighter', 'musics/ADDrumnBass3/9', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Finally Puzzle', 'musics/ADDrumnBass3/10', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Dawnscape', 'musics/ADDrumnBass3/11', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Central Nucleus', 'musics/ADDrumnBass3/12', 'image/cover/ADDrumnBass3']);
        this.musics.push(['So Far Gone', 'musics/ADDrumnBass3/13', 'image/cover/ADDrumnBass3']);
        this.musics.push(['physics', 'musics/ADDrumnBass3/14', 'image/cover/ADDrumnBass3']);
    }
    // update (dt) {}
}

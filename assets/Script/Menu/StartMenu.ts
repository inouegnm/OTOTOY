import Item from '../Util/Item';
import { dialogType, musicSetting } from '../Util/Setting';
import Dialog from '../Dialog/Dialog';

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartMenu extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    backgroundView: cc.Sprite = null;
    contentChild: cc.Node[] = new Array();
    dialog: Dialog = null;
    selectionArea: cc.Rect = null;
    musics: string[][] = new Array();
    currentBackgroundView: string = null;
    bgmTitle: string = null;
    procSelectedIdx: number = 6;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.backgroundView = this.node.children[1].children[0].getComponent(cc.Sprite);

        this.createSelectRect();

        // TODO: Get Resources From Network
        this.forDebug();
    }

    start() {
        let array = this.musics;
        this.currentBackgroundView = array[0][2];

        // onloadで読ませて保存だと初回instantiateがnullになること
        cc.loader.loadResDir('prefab', cc.Prefab, (err, prefab) => {
            if (err) {
                cc.error(err);
                return;
            }
            // 7以下の場合（あり得ない）は足りるように追加（後ほどあり得るかもしれないけど…）
            // while (array.length < 7) {
            //     let add = array[array.length - 2]
            //     array.push(add);
            // }
            let insDialog: cc.Node = cc.instantiate(prefab[0]);
            insDialog.setParent(this.node.parent);
            insDialog.addComponent(Dialog);
            array.forEach((musicinfo) => {
                let insItem: cc.Node = cc.instantiate(prefab[1]);
                insItem.setParent(this.content);
                cc.loader.loadRes('musics/' + musicinfo[1], cc.AudioClip, (err, clip: cc.AudioClip) => {
                    if (err) {
                        cc.error(err);
                        return;
                    }
                    insItem.getComponent(Item).setParam(musicinfo[0], clip, musicinfo[2]);
                });
                insItem.on(cc.Node.EventType.TOUCH_START, (event: cc.Event) => {
                    let node: cc.Node = event.target;
                    node.setScale(1.2, 1.2);
                }, insItem);
                insItem.on(cc.Node.EventType.TOUCH_END, (event: cc.Event) => {
                    let node: cc.Node = event.target;
                    musicSetting.path = musicinfo[1];
                    musicSetting.title = node.getComponent(Item).title;
                    musicSetting.clip = node.getComponent(Item).clip;
                    node.setScale(1, 1);

                    // 難易度選択ダイアログを出す
                    insDialog.getComponent(Dialog).showDialog(dialogType.difficulty);
                }, insItem);
                this.contentChild.push(insItem);
            });
            this.onTouchEnd()
        });
    }

    // 曖昧な位置にいたとき近くの選択肢に移動する
    onTouchEnd() {
        // contentの高さの絶対値から初期値分引いたもの
        let absY = this.content.position.y < 0 ? -this.content.position.y : this.content.position.y;
        // absYをItemの高さ(148→ボタンの高さ+間)で割った余り
        let distanceNear = absY % 148;
        let moveTo: number = this.content.position.y;

        // TODO:マイナスの時符号反転
        if (distanceNear < 37) { // 上にフォーカスする
            moveTo -= distanceNear - 74;
        } else if (distanceNear < 111) { // フォーカスを選択していたものに戻す
            moveTo += 74 - distanceNear;
        } else { // 下にフォーカスする
            moveTo += 222 - distanceNear;
        }


        // アニメーション
        let tween = new cc.Tween().target(this.content)
            .to(0.5, { position: new cc.Vec2(0, moveTo) }, { progress: null, easing: null })
            .start()
            .call(() => {
                this.onScrolled();
            })
    }

    onScrolled() {
        // 前に選択していたボタンのスケールを戻す
        this.contentChild[this.procSelectedIdx].children[1].setScale(1, 1);
        this.contentChild.forEach((item, idx) => {
            if (this.selectionArea.containsRect(item.getBoundingBoxToWorld())) {
                if (idx < this.procSelectedIdx) { // 上にスクロール
                    cc.log("上")
                } else if (idx > this.procSelectedIdx) { // 下にスクロール
                    cc.log("下")
                }
                this.procSelectedIdx = idx;

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
                    cc.audioEngine.playMusic(item.getComponent(Item).clip, false);
                    this.bgmTitle = item.getComponent(Item).title;
                }
            }
        });
    }

    createSelectRect() {
        this.selectionArea = this.node.children[1].children[2].getBoundingBoxToWorld();
    }

    // 現時点ではローカルに置いているが将来的にはクラウド管理がいい
    forDebug() {
        this.musics.push(['Protocol Omega', 'ADDrumnBass3/1', 'image/cover/ADDrumnBass']);
        this.musics.push(['Open your eyes you freak', 'ADDrumnBass3/2', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Black Future', 'ADDrumnBass3/3', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Formula', 'ADDrumnBass3/4', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Eruption', 'ADDrumnBass3/5', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Hacker', 'ADDrumnBass3/6', 'image/cover/ADDrumnBass3']);
        this.musics.push(['4_3', 'ADDrumnBass3/7', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Broken', 'ADDrumnBass3/8', 'image/cover/ADDrumnBass3']);
        this.musics.push(['I\'m a Fighter', 'ADDrumnBass3/9', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Finally Puzzle', 'ADDrumnBass3/10', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Dawnscape', 'ADDrumnBass3/11', 'image/cover/ADDrumnBass3']);
        this.musics.push(['Central Nucleus', 'ADDrumnBass3/12', 'image/cover/ADDrumnBass3']);
        this.musics.push(['So Far Gone', 'ADDrumnBass3/13', 'image/cover/ADDrumnBass3']);
        this.musics.push(['physics', 'ADDrumnBass3/14', 'image/cover/ADDrumnBass3']);
    }
    // update (dt) {}
}

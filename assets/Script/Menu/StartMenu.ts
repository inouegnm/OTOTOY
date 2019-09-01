import Item from '../Util/Item';
const { ccclass, property } = cc._decorator;

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

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.loader.loadRes('prefab/Item', cc.Prefab, (err, item) => {
            if (err) {
                cc.error(err);
                return;
            }
            this.itemPrefab = item;
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

        let firstMusic = this.contentChild[0];
        firstMusic.children[1].setScale(1.2, 1.2);

        let firstMusicItem = this.contentChild[0].getComponent(Item);
        // 選択対象が変わったときBGMを切り替える
        this.audioId = cc.audioEngine.playMusic(firstMusicItem.clip, false);
        this.bgmTitle = firstMusicItem.title;
        console.log(firstMusicItem);
        console.log(firstMusicItem.title);
        cc.loader.loadRes(firstMusicItem.backgroundImage, cc.SpriteFrame, (err, res) => {
            if (err) {
                cc.error(err);
                return;
            }
            this.backgroundView.spriteFrame = res;
        });
    }

    onClickMusicTitle(event: cc.Event) {
        let node: cc.Node = event.target;

        // 難易度選択ダイアログを出す
    }

    // 曖昧な位置にいたとき近くの選択肢に移動する
    onTouchEnd() {
        // 始点70*(n)
        // 中点70*(n+1)
        // 終点70*(n+2)
        let absY = this.content.position.y < 0 ? -this.content.position.y : this.content.position.y;
        let distanceNear = currentY % this.selectionArea.height;
        // 上にフォーカスする
        if (distanceNear < this.selectionArea.height / 3) {
            
        // フォーカスを選択していたものに戻す
        } else if (distanceNear < this.selectionArea.height / 3 * 2) {

        // 下にフォーカスする
        } else {

        }
        // this.content.position.lerp(cc.Vec2(),);
    }

    onScrolled(event: cc.Event) {
        this.contentChild.forEach(item => {
            if (this.selectionArea.containsRect(item.getBoundingBoxToWorld())) {
                item.children[1].setScale(1.2, 1.2);
                // 選択対象が一つ前に選択していた音楽のアルバムと違っているとき、背景画像を変える
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

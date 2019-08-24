import Item from "../Util/Item";
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

        var array = this.musics;
        var nodes: cc.Node[];
        array.forEach(musicinfo => {
            var item = cc.instantiate(this.itemPrefab);
            item.children[0].getComponent(cc.Label).string = musicinfo.title;
            item.parent = this.content;
            var audio = cc.audioEngine.preload(musicinfo.soundPath);
        });
    }

    // 現時点ではローカルに置いているが将来的にはクラウド管理がいい
    forDebug() {
        this.musics.push(new Item("Protocol Omega", "resources/musics/ADDrumnBass3/1.mp3"));
        this.musics.push(new Item("Open your eyes you freak", "resources/musics/ADDrumnBass3/2.mp3"));
        this.musics.push(new Item("Black Future", "resources/musics/ADDrumnBass3/3.mp3"));
    }
    // update (dt) {}
}

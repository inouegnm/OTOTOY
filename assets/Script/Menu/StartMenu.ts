// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Item from "./Item";
const { ccclass, property } = cc._decorator;

@ccclass
export default class StartMenu extends cc.Component {

    @property(cc.Node)
    content: cc.Node

    @property(cc.Prefab)
    itemPrefab: cc.Node

    musics: Item[]

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // TODO: Get Resources From Network

        this.forDebug();
        var array = this.musics;
        var nodes: cc.Node[];
        array.forEach(musicinfo => {
            this.itemPrefab
        });
        this.content.children
    }

    forDebug() {
        this.musics.push(new Item("test1"));
        this.musics.push(new Item("test2"));
        this.musics.push(new Item("test3"));
    }
    // update (dt) {}
}

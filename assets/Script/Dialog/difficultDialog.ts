// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class difficultDialog {

    dialogPrefab: cc.Prefab;

    constructor(title: string, soundPath: string, backgroundImage: string) {
        let ins = cc.instantiate(this.dialogPrefab);
    }

    onLoad() {
        cc.loader.loadRes('prefab/Dialog', cc.Prefab, (err, item) => {
            if (err) {
                cc.error(err);
                return;
            }
            this.dialogPrefab = item;
        });
    }
}

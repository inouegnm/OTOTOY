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

const STARTMENU = "StartMenu";
const GAMESCENE = "GameScene";

@ccclass
export default class SceneManager extends cc.Component {

    start() {
        // cc.director.preloadScene(STARTMENU, function () {
        //     cc.log('Next scene preloaded');
        // });
        cc.director.loadScene(STARTMENU);
    }

    // update (dt) {}
}

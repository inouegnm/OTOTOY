import * as Setting from './Util/Setting';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneManager extends cc.Component {

    start() {
        // cc.director.preloadScene(STARTMENU, function () {
        //     cc.log('Next scene preloaded');
        // });
        cc.director.loadScene(Setting.STARTMENU);
    }

    // update (dt) {}
}

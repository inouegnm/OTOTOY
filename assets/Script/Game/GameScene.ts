import * as Setting from '../Util/Setting';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    start() {
        cc.loader.loadRes('Scores/' + Setting.musicSelection.path, (err, jsonObj: cc.JsonAsset) => {
            console.log(jsonObj.json);
            console.log(JSON.parse(jsonObj))
        });
        cc.audioEngine.play(Setting.musicSelection.clip, false, 1);
    }
}

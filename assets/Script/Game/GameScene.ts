import * as Setting from '../Util/Setting';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    audioID: number;
    // scoreArray:[string, string, string] = new Array();

    start() {
        cc.loader.loadRes('Scores/' + Setting.musicSelection.path, (err, jsonAst: cc.JsonAsset) => {
            let jsonObj = jsonAst.json;
            console.log(jsonObj);
            console.log(JSON.parse(jsonObj))
        });
        this.audioID = cc.audioEngine.play(Setting.musicSelection.clip, false, 1);
    }

    update(dt) {
        cc.audioEngine.getCurrentTime(this.audioID);
    }
}

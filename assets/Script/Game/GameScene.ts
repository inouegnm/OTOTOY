import * as Setting from '../Util/Setting';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    start() {
        cc.loader.load('Scores/' + Setting.musicSelection.path + '.json', (err, jsonObj) => {
            console.log(jsonObj);
            console.log(JSON.parse(jsonObj))

        });
        cc.audioEngine.play(Setting.musicSelection.clip, false, 1);
    }
}

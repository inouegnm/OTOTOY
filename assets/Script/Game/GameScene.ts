import * as Setting from '../Util/Setting';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Node)
    countdownPanel: cc.Node = null;

    audioID: number;
    score: Setting.Note[] = new Array();

    // scoreArray:[string, string, string] = new Array()

    onLoad() {
        cc.loader.loadRes('Scores/' + Setting.musicSelection.path, (err, jsonAst: cc.JsonAsset) => {
            let jsonObj = jsonAst.json;
            this.score = jsonObj["score"][Setting.musicSelection.difficulty];
            console.log(this.score);
        });
        cc.loader.loadResDir('prefab', (err, prefab) => {
            let dialog: cc.Node = cc.instantiate(prefab[0]);
            this.score.forEach(note => {
                let n: cc.Node = cc.instantiate(prefab[2]);
                // i.setPosition(note["position"])

            });
            this.countdown();
        })

    }

    start() {
    }

    countdown() {
        let tween = new cc.Tween().target(this.countdownPanel)
            .call(() => {
                this.countdownPanel.getComponent(cc.Label).string = '3';
            })
            .delay(1)
            .call(() => {
                this.countdownPanel.getComponent(cc.Label).string = '2';
            })
            .delay(1)
            .call(() => {
                this.countdownPanel.getComponent(cc.Label).string = '1';
            })
            .delay(1)
            .call(() => {
                this.countdownPanel.getComponent(cc.Label).string = 'Start!';
                this.countdownPanel.active = false;
                this.audioID = cc.audioEngine.play(Setting.musicSelection.clip, false, 1);
            });
        tween.start();
    }

    update(dt: any) {
        cc.audioEngine.getCurrentTime(this.audioID);
    }
}

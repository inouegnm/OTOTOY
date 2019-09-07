import * as Setting from '../Util/Setting';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Node)
    countdownPanel: cc.Node = null;
    @property(cc.Node)
    scoreNode: cc.Node = null;

    audioID: number;
    score: Setting.Note[] = new Array();
    dialog: cc.Node = null;

    onLoad() {
        if (true) {
            Setting.musicSetting.difficulty = "Easy"
            Setting.musicSetting.path = "ADDrumnBass3/9"
        }

        cc.loader.loadRes('Scores/' + Setting.musicSetting.path, (err, jsonAst: cc.JsonAsset) => {
            let jsonObj = jsonAst.json;
            this.score = jsonObj["score"][Setting.musicSetting.difficulty];
            console.log(this.score);
        });
        cc.loader.loadResDir('prefab', (err, prefab) => {
            this.dialog = cc.instantiate(prefab[0]);
            this.score.forEach(note => {
                let n: cc.Node = cc.instantiate(prefab[2]);
                n.setParent(this.scoreNode);
                n.setPosition(new cc.Vec3(note["position"][0], note["position"][1], note["time"] * Setting.musicSetting.noteSpeed));
            });
            this.countdown();
        })
    }

    start() {
    }

    countdown() {
        console.log(this.scoreNode)
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
                this.audioID = cc.audioEngine.play(Setting.musicSetting.clip, false, 1);
            });
        tween.start();
    }
    update(dt: number) {
        // cc.audioEngine.getCurrentTime(this.audioID);

    }
}

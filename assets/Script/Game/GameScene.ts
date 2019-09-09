import * as Setting from '../Util/Setting';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Node)
    countdownPanel: cc.Node = null;
    @property(cc.Node)
    scoreNode: cc.Node = null;
    @property(cc.Node)
    judgeBar: cc.Node = null;

    audioID: number = null;
    score: Setting.Note[] = new Array();
    dialog: cc.Node = null;
    currentIndex: number = 0;

    noteSpeed: number = Setting.musicSetting.noteSpeed * 10;

    onLoad() {
        if (true) {
            Setting.musicSetting.difficulty = "Easy";
            Setting.musicSetting.path = "ADDrumnBass3/9";
            cc.loader.loadRes('musics/' + Setting.musicSetting.path, (err, clip) => {
                Setting.musicSetting.clip = clip;
            });
        }

        cc.loader.loadRes('Scores/' + Setting.musicSetting.path, (err, jsonAst: cc.JsonAsset) => {
            let jsonObj = jsonAst.json;
            // console.log(JSON.parse(jsonObj));
            this.score = jsonObj["score"][Setting.musicSetting.difficulty];
        });
        cc.loader.loadResDir('prefab', (err, prefab) => {
            this.dialog = cc.instantiate(prefab[0]);
            this.score.forEach(note => {
                note.time = note["time"];
                note.position = note["position"];

                let n: cc.Node = cc.instantiate(prefab[2]);
                n.setParent(this.scoreNode);

                // 近い位置に固まって生成される
                let y = note["time"] * this.noteSpeed;

                // 3Dにする場合[0]将来的に切り替えとかできたら面白そう
                // n.setPosition(new cc.Vec3(note["position"][0], note["position"][1], note["time"] * this.noteSpeed));
                n.setPosition(new cc.Vec2(note["position"][0], y));
            });
            this.countdown();
        });
    }

    start() {
        this.judgeBar.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.audioID != undefined || this.audioID != -1) {
                let delay = this.score[this.currentIndex].time - cc.audioEngine.getCurrentTime(this.audioID);
                if (delay < 0.05 && delay > -0.05) {
                    // perfect
                    console.log(delay);
                } else if (delay < 0.1 && delay > -0.1) {
                    // good
                    console.log(delay);
                } else if (delay < 0.2 && delay > -0.2) {
                    // bad
                    console.log(delay);
                } else {
                    console.log(delay);
                    return;
                }
                this.currentIndex++;
            }
        }, this.judgeBar.children[0]);
    }

    countdown() {
        // play直後だとaudioIDが正しく返されないため、ループで待つ
        let waitAudioEngine = () => {
            if (this.audioID != undefined || this.audioID != -1) {
                if (cc.audioEngine.getState(this.audioID) == cc.audioEngine.AudioState.PLAYING) {
                    let duration = cc.audioEngine.getDuration(this.audioID)

                    // 譜面の高さがここでしか計算できない
                    // onloadでノーツ生成時にやったほうがいい？
                    this.scoreNode.height = duration * this.noteSpeed;
                    this.scoreNode.setPosition(new cc.Vec2(0, this.scoreNode.height - 224));
                    this.scoreNode.active = true;

                    let tween = new cc.Tween().target(this.scoreNode)
                        .to(duration, { position: new cc.Vec2(0, -224) }, { progress: null, easing: null });
                    tween.start();
                    this.unschedule(waitAudioEngine);
                }
            }
        }
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
                this.schedule(waitAudioEngine, 0);
                cc.audioEngine.setFinishCallback(this.audioID, () => {
                    cc.director.loadScene(Setting.RESULTSCENE);
                });
            });
        tween.start();
    }

    update(dt: number) {
        console.log(this.scoreNode.position)
        // if (this.audioID != undefined || this.audioID != -1) {
        //     if (cc.audioEngine.getState(this.audioID) == cc.audioEngine.AudioState.PLAYING) {
        //         // console.log(cc.audioEngine.getCurrentTime(this.audioID));
        //     }
        // }
    }
}

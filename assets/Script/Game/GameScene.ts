import * as Setting from '../Util/Setting';

const { ccclass, property } = cc._decorator;

@ccclass
export class GameScene extends cc.Component {
    @property(cc.Label)
    private countdownPanel: cc.Label = undefined;
    @property(cc.Node)
    private scoreNode: cc.Node = undefined;
    @property(cc.Node)
    private judgeBar: cc.Node = undefined;

    private readonly noteSpeed: number = Setting.musicSetting.noteSpeed * 10;
    private readonly score: Setting.Note[] = [];

    private audioId: number = undefined;
    private dialog: cc.Node = undefined;
    private currentIndex: number = 0;


    public onLoad(): void {
        Setting.musicSetting.difficulty = "Easy";
        Setting.musicSetting.path = "ADDrumnBass3/9";

        cc.loader.loadRes("musics/" + Setting.musicSetting.path, (error, clip: cc.AudioClip) => {
            Setting.musicSetting.clip = clip;
        });
        cc.loader.loadRes("Scores/" + Setting.musicSetting.path, (error, jsonAsset: cc.JsonAsset) => {
            const json = jsonAsset.json;
            this.score.length = 0;
            this.score.push(json["score"][Setting.musicSetting.difficulty]);
        });

        cc.loader.loadResDir("prefab", (error, prefabs: cc.Prefab[]) => {
            this.dialog = cc.instantiate(prefabs[0]);
            this.score.forEach(note => {
                note.time = note["time"];
                note.position = note["position"];

                const node: cc.Node = cc.instantiate(prefabs[2]);
                node.setParent(this.scoreNode);

                // 近い位置に固まって生成される
                const positionY = note["time"] * this.noteSpeed;

                // 3Dにする場合[0]将来的に切り替えとかできたら面白そう
                // n.setPosition(new cc.Vec3(note["position"][0], note["position"][1], note["time"] * this.noteSpeed));
                node.setPosition(new cc.Vec2(note["position"][0], positionY));
            });

            this.countdown();
        });
    }

    public start(): void {
        this.judgeBar.on(
            cc.Node.EventType.TOUCH_START, () => {
                // TODO: 条件式変形したけど合ってるかは不明
                // if (this.audioId !== undefined || this.audioId != -1)
                if (!this.audioId || this.audioId === -1) {
                    return;
                }

                const delay = (this.score[this.currentIndex].time - cc.audioEngine.getCurrentTime(this.audioId));
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
            },
            this.judgeBar.children[0]
        );
    }

    public update(dt: number): void {
        console.log(this.scoreNode.position)
        // if (this.audioID != undefined || this.audioID != -1) {
        //     if (cc.audioEngine.getState(this.audioID) == cc.audioEngine.AudioState.PLAYING) {
        //         // console.log(cc.audioEngine.getCurrentTime(this.audioID));
        //     }
        // }
    }

    private countdown(): void {
        // play直後だとaudioIDが正しく返されないため、ループで待つ
        const waitAudioEngine = () => {
            // TODO: 条件式変形したけど合ってるかは不明
            // if (this.audioId !== undefined || this.audioId != -1)
            if (!this.audioId || this.audioId === -1) {
                return;
            }

            if (cc.audioEngine.getState(this.audioId) !== cc.audioEngine.AudioState.PLAYING) {
                return;
            }

            const duration = cc.audioEngine.getDuration(this.audioId)

            // 譜面の高さがここでしか計算できない
            // onloadでノーツ生成時にやったほうがいい？
            this.scoreNode.height = duration * this.noteSpeed;
            this.scoreNode.setPosition(new cc.Vec2(0, this.scoreNode.height - 224));
            this.scoreNode.active = true;

            const tween = new cc.Tween()
                .target(this.scoreNode)
                .to(
                    duration,
                    ({ position: new cc.Vec2(0, -224) }),
                    ({ progress: undefined, easing: undefined })
                );
            tween.start();

            this.unschedule(waitAudioEngine);
        }

        const tween = new cc.Tween().target(this.countdownPanel)
            .call(() => this.countdownPanel.string = "3")
            .delay(1)
            .call(() => this.countdownPanel.string = "2")
            .delay(1)
            .call(() => this.countdownPanel.string = "1")
            .delay(1)
            .call(() => {
                this.countdownPanel.string = "Start!";
                this.countdownPanel.node.active = false;

                this.audioId = cc.audioEngine.play(Setting.musicSetting.clip, false, 1);
                this.schedule(waitAudioEngine, 0);
                cc.audioEngine.setFinishCallback(this.audioId, () => cc.director.loadScene(Setting.RESULTSCENE));
            });
        tween.start();
    }
}

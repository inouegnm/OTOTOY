export default class Setting {

}
export enum dialogType {
    difficulty = 0,
    setting = 1,
    pause = 2,
}
export class SelectedMusic {
    public title: string = null;
    public path: string = null;
    public clip: cc.AudioClip = null;
    public difficulty: string = null;
}

export var musicSelection: SelectedMusic = new SelectedMusic();
export const STARTMENU = "StartMenu";
export const GAMESCENE = "GameScene";

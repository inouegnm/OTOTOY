export default class Setting {
}

export enum dialogType {
    difficulty = 0,
    setting = 1,
    pause = 2,
}

export class MusicSetting {
    title: string = null;
    path: string = null;
    clip: cc.AudioClip = null;
    difficulty: string = null;
    noteSpeed: number = 5;
}

export class Note {
    time: number;
    position: number | number[];
}

export class Score {
    score: { [key: string]: Note[] } = {};
    result: number = 0;
}

export var musicSetting: MusicSetting = new MusicSetting();
export const STARTMENU: string = "StartMenu";
export const GAMESCENE: string = "GameScene";
export const RESULTSCENE: string = "ResultScene";

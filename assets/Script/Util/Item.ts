export default class Item {
    title: string
    soundPath: string
    backgroundImage: cc.Sprite

    constructor(title: string, soundPath: string, backgroundImage?: cc.Sprite) {
        this.title = title;
        this.soundPath = soundPath;
        this.backgroundImage = backgroundImage;
    }
}

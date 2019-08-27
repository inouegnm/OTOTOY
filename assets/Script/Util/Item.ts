export default class Item {
    title: string
    soundPath: string
    backgroundImage: string

    constructor(title: string, soundPath: string, backgroundImage: string) {
        this.title = title;
        this.soundPath = soundPath;
        this.backgroundImage = backgroundImage;
    }
}

class MediaObject {
    media_object;
    constructor(media_object) {
        this.media_object = media_object;
        this.media_object.className = "media_object";
    }
    getMediaObject() {
        return this.media_object;
    }
}
class ImageObject extends MediaObject {
    constructor(image_object) {
        if (typeof image_object === "string") {
            const image = document.createElement("img");
            image.src = image_object;
            super(image);
        }
        else {
            super(image_object);
        }
    }
}
class Editor {
    area;
    constructor(area) {
        this.area = area;
    }
    addPanel(panel) {
        this.area.appendChild(panel.getPanel());
    }
    addFileExplorer(file_explorer) {
        this.area.appendChild(file_explorer.getPanel());
    }
    addToolbar(toolbar) {
        this.area.appendChild(toolbar.getToolbar());
    }
}

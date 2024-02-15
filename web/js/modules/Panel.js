class Panel extends Draggable {
    toolbar;
    panel;
    drop_area;
    media_container;
    constructor() {
        const panel = document.createElement("div");
        const toolbar = new Toolbar(Draggable.MouseButton.RIGHT);
        super(toolbar.getToolbar(), panel, Draggable.MouseButton.LEFT);
        this.panel = panel;
        this.toolbar = toolbar;
        this.panel.className = "panel";
        this.panel.appendChild(this.toolbar.getToolbar());
        this.media_container = document.createElement("div");
        this.media_container.className = "media_container";
        this.panel.appendChild(this.media_container);
        this.drop_area = document.createElement("div");
        this.drop_area.hidden = true;
        this.drop_area.className = "drop_area";
        this.panel.appendChild(this.drop_area);
        let add_tool = new Tool("./media/plus-small.png", "Add Item");
        add_tool.OnClick = () => {
            this.drop_area.hidden ? this.drop_area.hidden = false : this.drop_area.hidden = true;
        };
        this.toolbar.addTool(add_tool);
        this.toolbar.addTool(new Tool("./media/color.png", "Change Color"));
        this.toolbar.addTool(new Tool("./media/plus-small.png", "Add Item"));
    }
    setPosition(x, y) {
        this.panel.style.left = x + "px";
        this.panel.style.top = y + "px";
    }
    addMediaObject(media) {
        this.media_container.appendChild(media.getMediaObject());
    }
    getPanel() {
        return this.panel;
    }
    close() {
        //this.clear();
        this.panel.remove();
        this.toolbar.getToolbar().remove();
        this.panel = null;
        this.toolbar = null;
    }
}

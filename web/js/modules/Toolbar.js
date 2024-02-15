class Toolbar extends Draggable {
    toolbar;
    constructor(drag_key = Draggable.MouseButton.LEFT) {
        const toolbar = document.createElement("div");
        super(toolbar, toolbar, drag_key);
        toolbar.className = "toolbar";
        this.toolbar = toolbar;
    }
    addTool(tool) {
        this.toolbar.appendChild(tool.getTool());
    }
    getToolbar() {
        return this.toolbar;
    }
    setWidth(width) {
        this.toolbar.style.width = width + "px";
    }
    setHeight(height) {
        this.toolbar.style.height = height + "px";
    }
}

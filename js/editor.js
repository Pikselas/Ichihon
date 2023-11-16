class Draggable {
    drag_element;
    drag_handler;
    drag_start;
    drag_end;
    constructor(capture_element, target_element) {
        this.drag_element = target_element;
        this.drag_start = this.onDragStart.bind(this);
        this.drag_end = this.onDragEnd.bind(this);
        capture_element.addEventListener("mousedown", this.drag_start);
        capture_element.addEventListener("mouseup", this.drag_end);
    }
    onDragStart(event) {
        this.drag_handler = this.onDrag.bind(this, event.layerX, event.layerY);
        this.drag_element.addEventListener("mousemove", this.drag_handler);
    }
    onDrag(offset_x, offset_y, event) {
        this.drag_element.style.left = (event.pageX - offset_x) - 10 + "px";
        this.drag_element.style.top = (event.pageY - offset_y) - 10 + "px";
    }
    onDragEnd() {
        this.drag_element.removeEventListener("mousemove", this.drag_handler);
        this.drag_handler = null;
    }
    clear() {
        this.drag_element.removeEventListener("mousemove", this.drag_handler);
        this.drag_element.removeEventListener("mousedown", this.drag_start);
        this.drag_element.removeEventListener("mouseup", this.drag_end);
    }
}
class Tool {
    tool;
    constructor(src, name) {
        this.tool = document.createElement("img");
        this.tool.src = src;
        this.tool.title = name;
        this.tool.className = "tool";
    }
    setName(title) {
        this.tool.title = title;
    }
    getTool() {
        return this.tool;
    }
    get OnClick() {
        return this.tool.onclick;
    }
}
class Toolbar {
    toolbar;
    constructor() {
        const toolbar = document.createElement("div");
        toolbar.className = "toolbar";
        this.toolbar = toolbar;
    }
    addTool(tool) {
        this.toolbar.appendChild(tool.getTool());
    }
    getToolbar() {
        return this.toolbar;
    }
}
class Panel extends Draggable {
    panel;
    toolbar;
    constructor() {
        const panel = document.createElement("div");
        const toolbar = new Toolbar();
        super(toolbar.getToolbar(), panel);
        this.panel = panel;
        this.toolbar = toolbar;
        this.panel.className = "panel";
        this.panel.appendChild(this.toolbar.getToolbar());
        this.toolbar.addTool(new Tool("./media/plus-small.png", "Add Item"));
        this.toolbar.addTool(new Tool("./media/plus-small.png", "Remove Item"));
        this.toolbar.addTool(new Tool("./media/plus-small.png", "Add Item"));
        //this.toolbar.addTool(new Tool("./media/plus-small.png","Remove Item"));
    }
    setPosition(x, y) {
        this.panel.style.left = x + "px";
        this.panel.style.top = y + "px";
    }
    getPanel() {
        return this.panel;
    }
    close() {
        this.clear();
        this.panel.remove();
        this.toolbar.getToolbar().remove();
        this.panel = null;
        this.toolbar = null;
    }
}
class Editor {
    area;
    constructor(area) {
        this.area = area;
    }
    add(panel) {
        this.area.appendChild(panel.getPanel());
    }
}

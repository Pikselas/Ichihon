class Draggable {
    drag_element;
    drag_handler;
    drag_start;
    drag_end;
    base_pos_x;
    base_pos_y;
    static MouseButton = {
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2
    };
    action_key;
    constructor(capture_element, target_element, action_key = Draggable.MouseButton.LEFT) {
        this.action_key = action_key;
        this.drag_element = target_element;
        this.drag_start = this.onDragStart.bind(this);
        this.drag_end = this.onDragEnd.bind(this);
        capture_element.addEventListener("mousedown", this.drag_start);
        document.body.addEventListener("mouseup", this.drag_end);
    }
    onDragStart(event) {
        if (event.button != this.action_key)
            return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.base_pos_x = this.drag_element.offsetLeft;
        this.base_pos_y = this.drag_element.offsetTop;
        this.drag_handler = this.onDrag.bind(this, event.pageX, event.pageY);
        document.body.addEventListener("mousemove", this.drag_handler);
    }
    onDrag(offset_x, offset_y, event) {
        this.drag_element.style.left = this.base_pos_x + (event.pageX - offset_x) + "px";
        this.drag_element.style.top = this.base_pos_y + (event.pageY - offset_y) + "px";
    }
    onDragEnd() {
        document.body.removeEventListener("mousemove", this.drag_handler);
        this.drag_handler = null;
    }
    clear() {
        document.body.removeEventListener("mousemove", this.drag_handler);
        this.drag_element.removeEventListener("mousedown", this.drag_start);
        document.body.removeEventListener("mouseup", this.drag_end);
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
class Toolbar extends Draggable {
    toolbar;
    constructor() {
        const toolbar = document.createElement("div");
        super(toolbar, toolbar, Draggable.MouseButton.LEFT);
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
        super(toolbar.getToolbar(), panel, Draggable.MouseButton.MIDDLE);
        this.panel = panel;
        this.toolbar = toolbar;
        this.panel.className = "panel";
        this.panel.appendChild(this.toolbar.getToolbar());
        this.toolbar.addTool(new Tool("./media/plus-small.png", "Add Item"));
        this.toolbar.addTool(new Tool("./media/color.png", "Change Color"));
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
        //this.clear();
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

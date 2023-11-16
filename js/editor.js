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
        this.drag_element.style.left = (event.pageX - offset_x) + "px";
        this.drag_element.style.top = (event.pageY - offset_y) + "px";
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
class Panel extends Draggable {
    panel;
    toolbar;
    constructor() {
        const panel = document.createElement("div");
        const toolbar = document.createElement("div");
        super(toolbar, panel);
        this.panel = panel;
        this.toolbar = toolbar;
        this.panel.className = "panel";
        this.toolbar.className = "toolbar";
        this.panel.appendChild(this.toolbar);
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
        this.toolbar.remove();
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

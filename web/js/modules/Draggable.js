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
        let parent = this.drag_element.parentNode;
        // parent.removeChild(this.drag_element);
        // parent.appendChild(this.drag_element);
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

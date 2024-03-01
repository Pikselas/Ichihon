
let node_1 = null;
let node_2 = null;
let node_3 = null;

function SetUpEditor(html_area : HTMLElement)
{
    const editor = new Editor(html_area);
    let drop_area = new DropArea(html_area);
    drop_area.DragOverHandler = (ev: DragEvent)=>
    {
        ev.preventDefault();
        let current_drag_panel = DraggAble.GetCurrentDraggable();
        if (current_drag_panel != null)
        {
            current_drag_panel.dragTo(html_area.scrollLeft + ev.x, html_area.scrollTop +  ev.y);
        }
    }

    drop_area.DropHandler = (ev: DragEvent)=>
    {
        let current_drag_panel = DraggAble.GetCurrentDraggable();
        if (current_drag_panel != null && !(current_drag_panel.getTarget() instanceof EditorViewPanel))
        {
            current_drag_panel.resetPosition();
        }
    }

    let ex =  new FileExplorer(new FileLister("/get_file_list","D:"));
    let pan_1 = new ImageCollectionPanel();
    let pan_2 = new ImageCollectionPanel();
    
    node_1 = new NodeConnector(ex);
    node_2 = new NodeConnector(pan_1);
    node_3 = new NodeConnector(pan_2);

    new DraggAble(ex);
    new DraggAble(pan_1);
    new DraggAble(pan_2);

    editor.addPanel(ex);
    editor.addPanel(pan_1);
    editor.addPanel(pan_2);

    editor.bindNodeConnector(ex, node_1);
    editor.bindNodeConnector(pan_1, node_2);
    editor.bindNodeConnector(pan_2, node_3);

}
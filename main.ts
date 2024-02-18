
let ACTIVE_LINK_OBSERVER: PanelObserver = null;
let GLOBAL_LINK_MANAGER: ObservableLinksManager = null;


function SetUpEditor(html_area : HTMLElement)
{
    const editor = new Editor(html_area);
    GLOBAL_LINK_MANAGER = new ObservableLinksManager(html_area);
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

    let node_1 = new NodeConnector();
    let node_2 = new NodeConnector();
    let node_3 = new NodeConnector();

    let ex =  new FileExplorer(new FileLister("/get_file_list","D:"));
    let ex2 =  new FileExplorer(new FileLister("/get_file_list","D:"));
    let ex3 =  new FileExplorer(new FileLister("/get_file_list","D:"));

    
    new DraggAble(ex);
    new DraggAble(ex2);
    new DraggAble(ex3);

    editor.addPanel(ex);
    editor.addPanel(ex2);
    editor.addPanel(ex3);

    editor.bindNodeConnector(ex, node_1);
    editor.bindNodeConnector(ex2, node_2);
    editor.bindNodeConnector(ex3, node_3);
}
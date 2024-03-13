function SetUpEditor(html_area : HTMLElement)
{
    html_area.appendChild(LinkLine.link_line_svg);
    const editor = new Editor(html_area);

    let toolbar = new Toolbar();
    toolbar.setWidth(100);
    toolbar.setHeight(400);
    toolbar.getPanel().classList.add("editor_toolbar");

    let tool_photo_collections = new Tool("./media/photo-collections.png","Create Image Collection");
    tool_photo_collections.getTool().classList.add("tool_image_collection");

    tool_photo_collections.OnClick = ()=>
    {
        let panel = new ImageCollectionPanel();
        new DraggAble(panel);
        editor.addPanel(panel);
        editor.bindNodeConnector(panel, new NodeConnector(panel));

        panel.setPosition(html_area.scrollLeft, html_area.scrollTop);
    }

    let tool_file_explorer = new Tool("./media/explore-files.png","Explore Files");
    tool_file_explorer.getTool().classList.add("tool_explore_files");

    tool_file_explorer.OnClick = ()=>
    {
        let panel = new FileExplorer(new FileLister("/get_file_list","D:"));
        new DraggAble(panel);
        editor.addPanel(panel);
        editor.bindNodeConnector(panel, new NodeConnector(panel));
        panel.setPosition(html_area.scrollLeft , html_area.scrollTop);
    }

    toolbar.addTool(tool_photo_collections);
    toolbar.addTool(tool_file_explorer);

    editor.addPanel(toolbar);

    let toolbar_draggable = new DraggAble(toolbar);
    let drop_area = new DropArea(html_area);
    
    drop_area.DragOverHandler = (ev: DragEvent)=>
    {
        ev.preventDefault();
        let current_drag_panel = DraggAble.GetCurrentDraggable();
        if (current_drag_panel != null && current_drag_panel != toolbar_draggable)
        {
            current_drag_panel.dragTo(html_area.scrollLeft + ev.x, html_area.scrollTop +  ev.y);
        }
        else if (current_drag_panel == toolbar_draggable)
        {
            current_drag_panel.dragTo(ev.x,ev.y);
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

}
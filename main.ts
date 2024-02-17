
let ACTIVE_LINK_OBSERVER: PanelObserver = null;
let GLOBAL_LINK_MANAGER: ObservableLinksManager = null;


class NodeEl extends Panel
{
    constructor()
    {
        super();
        this.panel.style.width = "10px";
        this.panel.style.height = "10px";
        this.panel.style.backgroundColor = "red";
        this.panel.style.position = "absolute";
        this.panel.style.left = "100px";
        this.panel.style.top = "100px";
        this.panel.style.borderTopLeftRadius = "50%";
        this.panel.style.borderBottomLeftRadius = "50%";
        this.panel.style.borderTopRightRadius = "25%";
        this.panel.style.borderBottomRightRadius = "25%";
    }
}

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

    // const fileExplorer = new FileExplorer(new FileLister("/get_file_list","D:"));
    // const image_panel = new ImageCollectionPanel();

    // new DraggAble(fileExplorer);
    // new DraggAble(image_panel);

    // let link = new LinkLine(fileExplorer.getPanel() , image_panel.getPanel() , html_area);

    // editor.addPanel(fileExplorer);
    // editor.addPanel(image_panel);

    // html_area.appendChild(link.getLinkLine());


    let node_1 = new NodeEl();
    let node_2 = new NodeEl();
    
    new DraggAble(node_1);
    new DraggAble(node_2);

    let l = new LinkLine(node_1.getPanel() , node_2.getPanel() , html_area);

    editor.addPanel(node_1);
    editor.addPanel(node_2);

    html_area.appendChild(l.getLinkLine());

}
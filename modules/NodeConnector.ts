
class NodeObject extends Panel
{
    public node_connector: NodeConnector = null;
    constructor()
    {
        super();

        this.panel.className = "connector_node";
    }
}

class NodeConnector
{
    private drop_area: DropArea = null;

    private temp_link_line: LinkLine = null;
    private temp_node: NodeObject = null;

    private draggable: DraggAble = null;
    private node: NodeObject = null;

    private link_lines: Array<LinkLine> = new Array<LinkLine>();

    constructor()
    {
        this.node = new NodeObject();
        this.setup_node();
    }

    private drop_handler(ev: DragEvent)
    {
        ev.preventDefault();
        let current_drag_panel = DraggAble.GetCurrentDraggable();
        if (current_drag_panel != null && current_drag_panel.getTarget() instanceof NodeObject)
        {

            ev.preventDefault();
            ev.stopPropagation();

            let node = current_drag_panel.getTarget() as NodeObject;

            node.node_connector.temp_link_line.remove();
            node.getPanel().remove();

            node.node_connector.node = node.node_connector.temp_node;
            node.node_connector.temp_node = null;
            node.node_connector.temp_link_line = null;

            console.log(this.node.getPanel());

            let link_line = new LinkLine(this.node.getPanel(), node.node_connector.node.getPanel(), this.node.getPanel().parentElement);

            this.link_lines.push(link_line);
            node.node_connector.link_lines.push(link_line);

            this.node.getPanel().parentElement.appendChild(link_line.getLinkLine());
            
        }
    }

    private drag_start_handler(ev: DragEvent)
    {
        this.drop_area.clear();
        this.drop_area = null;

        this.node.node_connector = this;

        this.node.getPanel().style.zIndex = "-1";
        this.temp_node = new NodeObject();

        this.temp_node.getPanel().style.left = this.node.getPanel().offsetLeft + "px";
        this.temp_node.getPanel().style.top = this.node.getPanel().offsetTop + "px";

        this.node.getPanel().parentElement.appendChild(this.temp_node.getPanel());

        this.temp_link_line = new LinkLine(this.node.getPanel(), this.temp_node.getPanel(), this.node.getPanel().parentElement);

        this.node.getPanel().parentElement.appendChild(this.temp_link_line.getLinkLine());

        console.log(this.link_lines.length);

        this.link_lines.forEach((link_line)=>
        {
            let l1 = link_line.getLinkable1();
            let l2 = link_line.getLinkable2();

            if(l1 == this.node.getPanel())
            {
                link_line.setLinkable1(this.temp_node.getPanel());
            }
            else if(l2 == this.node.getPanel())
            {
                link_line.setLinkable2(this.temp_node.getPanel());
            }
        });
    }

    private drag_end_handler(ev: DragEvent)
    {
        this.node.getPanel().style.zIndex = "0";
        if(this.temp_node != null)
        {
            this.draggable.resetPosition();
            this.drop_area = new DropArea(this.node.getPanel());

            this.link_lines.forEach((link_line)=>
            {
                let l1 = link_line.getLinkable1();
                let l2 = link_line.getLinkable2();

                if(l1 == this.temp_node.getPanel())
                {
                    link_line.setLinkable1(this.node.getPanel());
                }
                else if(l2 == this.temp_node.getPanel())
                {
                    link_line.setLinkable2(this.node.getPanel());
                }
            });

            this.temp_link_line.remove();
            this.temp_node.getPanel().remove();

            this.temp_node = null;
            this.temp_link_line = null;
        }
        else
        {
            this.setup_node();
        }
    }

    private setup_node()
    {
        this.draggable = new DraggAble(this.node);
        this.drop_area = new DropArea(this.node.getPanel());

        this.node.getPanel().addEventListener("dragstart", this.drag_start_handler.bind(this));
        this.node.getPanel().addEventListener("dragend", this.drag_end_handler.bind(this));

        this.drop_area.DropHandler = this.drop_handler.bind(this);
    }

    public getNode(): Panel
    {
        return this.node;
    }
}
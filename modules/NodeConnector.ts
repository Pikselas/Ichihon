
interface NodeIConnectable
{
    node_connector: NodeConnector;
    OnConnect(connector:NodeIConnectable): void
    OnChangeDetected(change: any): void
}

class NodeObject extends Panel
{
    public node_connector: NodeConnector = null;
    constructor()
    {
        super();

        this.panel.className = "connector_node";
    }
}

type NodeConnectionObject = { observer: NodeConnector , link_line: LinkLine };

class NodeConnector
{
    private drop_area: DropArea = null;

    private temp_link_line: LinkLine = null;
    private temp_node: NodeObject = null;

    private draggable: DraggAble = null;
    private node: NodeObject = null;

    private connections: Array<NodeConnectionObject> = new Array<NodeConnectionObject>();

    private connector_object: NodeIConnectable;

    constructor(connector: NodeIConnectable)
    {
        this.connector_object = connector;
        this.node = new NodeObject();
        this.setup_node();

        this.connector_object.node_connector = this;
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

            let link_line = new LinkLine(this.node.getPanel(), node.node_connector.node.getPanel(), this.node.getPanel().parentElement);

            this.connections.push({ observer:node.node_connector, link_line: link_line });
            node.node_connector.connections.push({ observer:this , link_line:link_line });

            this.node.getPanel().parentElement.appendChild(link_line.getLinkLine());

            this.connector_object.OnConnect(node.node_connector.connector_object);
            node.node_connector.connector_object.OnConnect(this.connector_object);
            
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

        this.connections.forEach((connection)=>
        {
            let l1 = connection.link_line.getLinkable1();
            let l2 = connection.link_line.getLinkable2();

            if(l1 == this.node.getPanel())
            {
                connection.link_line.setLinkable1(this.temp_node.getPanel());
            }
            else if(l2 == this.node.getPanel())
            {
                connection.link_line.setLinkable2(this.temp_node.getPanel());
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

            this.connections.forEach((connection)=>
            {
                let l1 = connection.link_line.getLinkable1();
                let l2 = connection.link_line.getLinkable2();

                if(l1 == this.temp_node.getPanel())
                {
                    connection.link_line.setLinkable1(this.node.getPanel());
                }
                else if(l2 == this.temp_node.getPanel())
                {
                    connection.link_line.setLinkable2(this.node.getPanel());
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

    public getConnections(): Array<NodeConnectionObject>
    {
        return this.connections;
    }

    public closeConnection(connection: NodeConnectionObject)
    {
        let indx = this.connections.indexOf(connection);
        
        this.connections.splice(indx , 1);

        indx = connection.observer.connections.findIndex((con)=>
        {
            return con.observer == this;
        });
        connection.observer.connections.splice(indx,1);

        connection.link_line.remove();
    }

    public reflectChange(change: any)
    {
        this.connections.forEach((connection)=>
        {
            connection.observer.connector_object.OnChangeDetected(change);
        });
    }
}

function CreateConnectionStatusPanel(connection_object: NodeConnector)
{
    let panel = document.createElement("div");
    panel.className = "connection_status_panel";
    let tool_bar = document.createElement("div");
    tool_bar.className = "tool_bar";
    let close_img = document.createElement("img");

    close_img.src = "media/multiply.png";
    tool_bar.appendChild(close_img);

    let connection_panel = document.createElement("div");
    connection_panel.className = "connection_panel";

    close_img.onclick = ()=>
    {
        panel.remove();
    }

    connection_object.getConnections().forEach((connection,indx)=>
    {
        let link_panel = document.createElement("div");
        link_panel.className = "connection";
        let link_name = document.createElement("i");
        link_name.innerHTML = "Link:" + indx;

        let close_link = document.createElement("img");
        close_link.src = "media/remove.png";

        close_link.onclick = ()=>
        {
            connection_object.closeConnection(connection);
        }

        link_panel.onmouseenter = ()=>
        {
            connection.link_line.setColor("red");
        };

        link_panel.onmouseleave = ()=>
        {
            connection.link_line.setColor("rgb(2, 250, 233)");
        };

        link_panel.appendChild(link_name);
        link_panel.appendChild(close_link);
        connection_panel.appendChild(link_panel);
    });

    panel.appendChild(tool_bar);
    panel.appendChild(connection_panel);
    return panel;

}
enum NODE_CONNECTION_CHANGE 
{
    FILE_SELECTION,
    COLLECTION_SCROLL
}

type FILE_SELECTION_CHANGE = { TYPE: NODE_CONNECTION_CHANGE.FILE_SELECTION, CHANGE: Array<string> };
type COLLECTION_CHANGE = { TYPE: NODE_CONNECTION_CHANGE.COLLECTION_SCROLL, CHANGE: { index: number, length:number ,object: ImageObject } };

type CONNECTION_CHANGE = FILE_SELECTION_CHANGE | COLLECTION_CHANGE;

interface NodeIConnectable
{
    node_connector: NodeConnector;
    last_change_event_by: NodeIConnectable;
    OnConnect(connector:NodeIConnectable): void
    OnChangeDetected(change: CONNECTION_CHANGE): void
}

class NodeObject
{
    public node_connector: NodeConnector = null;
    private panel: HTMLDivElement = null;
    constructor()
    {
        this.panel = document.createElement("div");
        this.panel.className = "connector_node";
    }
    public getPanel(): HTMLDivElement
    {
        return this.panel;
    }
    public setPosition(x: number, y: number): void
   {
      this.panel.style.left = x - 5 + "px";
      this.panel.style.top = y - 5 + "px";
   }
}

type NodeConnectionObject = { observer: NodeConnector , link_line: LinkLine };

class NodeConnector
{
    private drop_area: DropArea = null;

    private temp_link_line: LinkLine = null;
    private temp_node: NodeObject = null;

    private node: NodeObject = null;

    private connections: Array<NodeConnectionObject> = new Array<NodeConnectionObject>();

    private connector_object: NodeIConnectable;

    private static active_node_object: NodeObject = null;

    constructor(connector: NodeIConnectable)
    {
        this.connector_object = connector;
        this.node = new NodeObject();
        this.drop_area = new DropArea(this.node.getPanel());
        this.node.getPanel().draggable = true;

        this.node.getPanel().addEventListener("dragstart", this.drag_start_handler.bind(this));
        this.node.getPanel().addEventListener("dragend", this.drag_end_handler.bind(this));

        this.drop_area.DropHandler = this.drop_handler.bind(this);

        this.connector_object.node_connector = this;
    }

    private drop_handler(ev: DragEvent)
    {
        ev.preventDefault();
        let node = NodeConnector.active_node_object;
        if (node != null)
        {
            ev.preventDefault();
            this.connectWith(node.node_connector);
        }
    }

    private drag_start_handler(ev: DragEvent)
    {
        ev.dataTransfer.setDragImage(new Image() , 0 , 0);
        this.temp_node = new NodeObject();
        this.temp_node.node_connector = this;
        this.temp_node.getPanel().style.zIndex = "-1";

        this.temp_node.getPanel().style.left = this.node.getPanel().offsetLeft + "px";
        this.temp_node.getPanel().style.top = this.node.getPanel().offsetTop + "px";

        this.node.getPanel().parentElement.appendChild(this.temp_node.getPanel());

        NodeConnector.active_node_object = this.temp_node;

        this.temp_link_line = new LinkLine(this.node.getPanel(), this.temp_node.getPanel());
    }

    private drag_end_handler(ev: DragEvent)
    {
        NodeConnector.active_node_object = null;
        
        this.temp_node.getPanel().remove();
        this.temp_node = null;

        this.temp_link_line.remove();
        this.temp_link_line = null;
    }

    public static GetActiveNodeObject(): NodeObject
    {
        return NodeConnector.active_node_object;
    }

    public getNode(): NodeObject
    {
        return this.node;
    }

    public connectWith(connector: NodeConnector)
    {
        let link_line = new LinkLine(this.node.getPanel(), connector.node.getPanel());

        this.connections.push({ observer:connector, link_line: link_line });
        connector.connections.push({ observer:this , link_line:link_line });

        this.connector_object.OnConnect(connector.connector_object);
        connector.connector_object.OnConnect(this.connector_object);
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

    public remove()
    {
        while(this.connections.length > 0)
        {
            this.closeConnection(this.connections[0]);
        }
        this.node.getPanel().remove();
    }

    public reflectChange(change: CONNECTION_CHANGE)
    {
        this.connections.forEach((connection)=>
        {
            if(connection.observer.connector_object != this.connector_object.last_change_event_by)
            {
                connection.observer.connector_object.OnChangeDetected(change);
                connection.observer.connector_object.last_change_event_by = this.connector_object;
            }
            else
            {
                console.log("FOUND" , connection.observer.connector_object);
            }
        });
        this.connector_object.last_change_event_by = null;
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
        panel.style.scale = "0";
        setTimeout(()=>{panel.remove()},200);
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
            link_panel.remove();
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

class Panel
{
   protected panel: HTMLDivElement;
   constructor()
   {
      this.panel = document.createElement("div");
   }
   protected addPanel(panel: Panel): void
   {
      this.panel.appendChild(panel.getPanel());
   }
   public setPosition(x: number, y: number): void
   {
      this.panel.style.left = x + "px";
      this.panel.style.top = y + "px";
   }
   public setWidth(width: number): void
   {
      this.panel.style.width = width + "px";
   }
   public setHeight(height: number): void
   {
      this.panel.style.height = height + "px";
   }
   public getPanel(): HTMLDivElement
   {
      return this.panel;
   }
}

class EditorViewPanel extends Panel 
{
   public mutation_observer: MutationObserver;
}

class ImageCollectionPanel extends EditorViewPanel implements NodeIConnectable
{
   private toolbar: Toolbar;
   private media_container: HTMLDivElement;

   private media_objects: MediaObject[] = [];

   node_connector: NodeConnector;

   constructor()
   {
      super();  

      this.node_connector = new NodeConnector(this);

      this.panel.className = "panel";

      this.toolbar = new Toolbar();
      this.addPanel(this.toolbar);
      
      this.media_container = document.createElement("div");
      this.media_container.className = "media_container";
      this.panel.appendChild(this.media_container);

      this.media_container.onscroll = () =>
      {
         let most_visible_media_index = Math.round(this.media_container.scrollTop / this.media_container.clientHeight);

         if (this.node_connector != null)
         {
            this.node_connector.reflectChange({ "scrolled_to" : this.media_objects[most_visible_media_index] });
         }
      }

      let connection_status_tool = new Tool("./media/connect-small.png","Connection Status");

      connection_status_tool.OnClick = ()=>
      {
         let connection_status_panel = CreateConnectionStatusPanel(this.node_connector);
         connection_status_panel.style.scale = "0";
         this.panel.appendChild(connection_status_panel);
         setTimeout(()=>{connection_status_panel.style.scale = "1"},10);
      }

      let close_tool = new Tool("./media/close-small.png","Close");

      close_tool.OnClick = ()=>
      {
         this.node_connector.remove();
         this.panel.style.scale  = "0";
         setTimeout(()=>{this.panel.remove()},200);
      }

      this.toolbar.addTool(connection_status_tool);
      this.toolbar.addTool(close_tool);
   }
   public addMediaObject(media: MediaObject): void
   {
      this.media_objects.push(media);
      this.media_container.appendChild(media.getMediaObject());
   }
   
   public OnConnect(connector: NodeIConnectable): void 
   {
      console.log(connector);
   }

   public OnChangeDetected(change: any): void 
   {
      console.log(change);
   }
}
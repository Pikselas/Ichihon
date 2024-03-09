
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

      let add_tool = new Tool("./media/plus-small.png","Add Item");
      let link_tool = new Tool("./media/connect-small.png","Connect with another panel");

      this.toolbar.addTool(add_tool);
      this.toolbar.addTool(link_tool);
      this.toolbar.addTool(new Tool("./media/color.png","Change Color"));
      this.toolbar.addTool(new Tool("./media/plus-small.png","Add Item"));
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
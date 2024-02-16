class Panel extends Draggable implements PanelObserver
{
   private toolbar: Toolbar;
   private panel: HTMLDivElement;
   private drop_area: HTMLDivElement;
   private media_container: HTMLDivElement;

   constructor()
   {
      const panel = document.createElement("div");
      const toolbar = new Toolbar(Draggable.MouseButton.RIGHT);
      super(toolbar.getToolbar(),panel , Draggable.MouseButton.LEFT);
      
      this.panel = panel;
      this.toolbar = toolbar;
      this.panel.className = "panel";
      this.panel.appendChild(this.toolbar.getToolbar());
      
      this.media_container = document.createElement("div");
      this.media_container.className = "media_container";
      this.panel.appendChild(this.media_container);

      this.drop_area = document.createElement("div");
      this.drop_area.hidden = true;
      this.drop_area.className = "drop_area";
      this.panel.appendChild(this.drop_area);

      let add_tool = new Tool("./media/plus-small.png","Add Item");
      add_tool.OnClick = () => 
      {
         this.drop_area.hidden ? this.drop_area.hidden = false : this.drop_area.hidden = true;
      };

      let link_tool = new Tool("./media/connect-small.png","Connect with another panel");
      link_tool.OnClick = () => 
      {
         ACTIVE_LINK_OBSERVER = this;
      };

      this.toolbar.addTool(add_tool);
      this.toolbar.addTool(link_tool);
      this.toolbar.addTool(new Tool("./media/color.png","Change Color"));
      this.toolbar.addTool(new Tool("./media/plus-small.png","Add Item"));
   }
   public setPosition(x: number, y: number): void
   {
      this.panel.style.left = x + "px";
      this.panel.style.top = y + "px";
   }
   public addMediaObject(media: MediaObject): void
   {
      this.media_container.appendChild(media.getMediaObject());
   }
   public getPanel(): HTMLDivElement
   {
      return this.panel;
   }
   public close(): void
   {
      //this.clear();
      this.panel.remove();
      this.toolbar.getToolbar().remove();

      this.panel = null;
      this.toolbar = null;
   }

   public onChangeDetected(change: ChangeData): void
   {
      if(change.type == CHANGE_file_selected)
      {
         change.data.forEach((file: string)=>
         {
            let media = new ImageObject("/get_file/" + file);
            this.addMediaObject(media);
         });
      }
   }
}
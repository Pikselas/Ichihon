class Toolbar extends Draggable
{
   private toolbar: HTMLDivElement;
   constructor(drag_key: number = Draggable.MouseButton.LEFT)
   {
      const toolbar = document.createElement("div");
      super(toolbar,toolbar , drag_key);
      toolbar.className = "toolbar";
      this.toolbar = toolbar;
   }
   public addTool(tool: Tool): void
   {
      this.toolbar.appendChild(tool.getTool());
   }
   public getToolbar(): HTMLDivElement
   {
      return this.toolbar;
   }
   public setWidth(width: number): void
   {
      this.toolbar.style.width = width + "px";
   }
   public setHeight(height: number): void
   {
      this.toolbar.style.height = height + "px";
   }

}

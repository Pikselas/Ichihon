
class Draggable
{
   private drag_element: HTMLElement;
   private drag_handler: any;
   private drag_start: any;
   private drag_end: any;
   constructor (capture_element: HTMLElement , target_element: HTMLElement)
   {
      this.drag_element = target_element;
      this.drag_start = this.onDragStart.bind(this);
      this.drag_end = this.onDragEnd.bind(this);
      
      capture_element.addEventListener("mousedown", this.drag_start);
      capture_element.addEventListener("mouseup", this.drag_end);
   }
   private onDragStart(event: any): void
   {
      this.drag_handler = this.onDrag.bind(this,event.layerX, event.layerY);
      this.drag_element.addEventListener("mousemove", this.drag_handler);
   }
   private onDrag(offset_x:number , offset_y:number, event:MouseEvent): void
   {
     this.drag_element.style.left = (event.pageX - offset_x) - 10 + "px";
     this.drag_element.style.top = (event.pageY - offset_y) - 10 + "px";
   }
   private onDragEnd(): void
   {
      this.drag_element.removeEventListener("mousemove", this.drag_handler);
      this.drag_handler = null;
   }
   public clear(): void
   {
      this.drag_element.removeEventListener("mousemove", this.drag_handler);
      this.drag_element.removeEventListener("mousedown", this.drag_start);
      this.drag_element.removeEventListener("mouseup", this.drag_end);
   }
}

class Tool
{
   private tool: HTMLImageElement;
   constructor(src: string , name: string)
   {
      this.tool = document.createElement("img");
      this.tool.src = src;
      this.tool.title = name;
      this.tool.className = "tool";
   }
   public setName(title: string): void
   {
      this.tool.title = title;
   }
   public getTool (): HTMLElement
   {
      return this.tool;
   }
   get OnClick(): any
   {
      return this.tool.onclick;
   }
}

class Toolbar
{
   private toolbar: HTMLDivElement;
   constructor()
   {
      const toolbar = document.createElement("div");
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

}

class Panel extends Draggable
{
   private panel: HTMLDivElement;
   private toolbar: Toolbar
   constructor()
   {
      const panel = document.createElement("div");
      const toolbar = new Toolbar();
      super(toolbar.getToolbar(),panel);
      this.panel = panel;
      this.toolbar = toolbar;
      this.panel.className = "panel";
      this.panel.appendChild(this.toolbar.getToolbar());

      this.toolbar.addTool(new Tool("./media/plus-small.png","Add Item"));
      this.toolbar.addTool(new Tool("./media/plus-small.png","Remove Item"));
      this.toolbar.addTool(new Tool("./media/plus-small.png","Add Item"));
      //this.toolbar.addTool(new Tool("./media/plus-small.png","Remove Item"));
   }
   public setPosition(x: number, y: number): void
   {
      this.panel.style.left = x + "px";
      this.panel.style.top = y + "px";
   }
   public getPanel(): HTMLDivElement
   {
      return this.panel;
   }
   public close(): void
   {
      this.clear();
      this.panel.remove();
      this.toolbar.getToolbar().remove();

      this.panel = null;
      this.toolbar = null;
   }
}

class Editor
{
 private area: HTMLElement;
 constructor(area: HTMLElement)
 {
   this.area = area;
 }
 public add(panel: Panel): void
 {
   this.area.appendChild(panel.getPanel());
 } 
}
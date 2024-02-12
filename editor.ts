
class MediaObject
{
   private media_object: HTMLElement;
   protected constructor(media_object: HTMLElement)
   {
      this.media_object = media_object;
      this.media_object.className = "media_object";
   }
   public getMediaObject(): HTMLElement
   {
      return this.media_object;
   }
}

class ImageObject extends MediaObject
{
   constructor(image_object: HTMLImageElement | string)
   {
      if(typeof image_object === "string")
      {
         const image = document.createElement("img");
         image.src = image_object;
         super(image);
      }
      else
      {
         super(image_object);
      }
   }
}

class Draggable
{
   private drag_element: HTMLElement;
   private drag_handler: any;
   
   private drag_start: any;
   private drag_end: any;
  
   private base_pos_x: number;
   private base_pos_y: number;

   public static MouseButton = 
   {
      LEFT: 0,
      MIDDLE: 1,
      RIGHT: 2
   };

   private action_key: number;
   constructor (capture_element: HTMLElement , target_element: HTMLElement , action_key:number = Draggable.MouseButton.LEFT)
   {
      this.action_key = action_key;
      this.drag_element = target_element;
      this.drag_start = this.onDragStart.bind(this);
      this.drag_end = this.onDragEnd.bind(this);

      capture_element.addEventListener("mousedown", this.drag_start);
      document.body.addEventListener("mouseup", this.drag_end);
   }
   private onDragStart(event: MouseEvent): void
   {
      if(event.button != this.action_key)
         return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.base_pos_x = this.drag_element.offsetLeft;
      this.base_pos_y = this.drag_element.offsetTop; 
      this.drag_handler = this.onDrag.bind(this,event.pageX ,event.pageY );
      document.body.addEventListener("mousemove", this.drag_handler);
   }
   private onDrag(offset_x:number , offset_y:number, event:MouseEvent): void
   {
     this.drag_element.style.left = this.base_pos_x + (event.pageX - offset_x) + "px";
     this.drag_element.style.top = this.base_pos_y + (event.pageY - offset_y) + "px";
   }
   private onDragEnd(): void
   {
      document.body.removeEventListener("mousemove", this.drag_handler);
      this.drag_handler = null;
   }
   public clear(): void
   {
      document.body.removeEventListener("mousemove", this.drag_handler);
      this.drag_element.removeEventListener("mousedown", this.drag_start);
      document.body.removeEventListener("mouseup", this.drag_end);
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
   set OnClick(func: any)
   {
      this.tool.onclick = func;
   }
}

class Toolbar extends Draggable
{
   private toolbar: HTMLDivElement;
   constructor()
   {
      const toolbar = document.createElement("div");
      super(toolbar,toolbar , Draggable.MouseButton.LEFT);
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
   private toolbar: Toolbar;
   private panel: HTMLDivElement;
   private drop_area: HTMLDivElement;
   private media_container: HTMLDivElement;

   constructor()
   {
      const panel = document.createElement("div");
      const toolbar = new Toolbar();
      super(toolbar.getToolbar(),panel , Draggable.MouseButton.RIGHT);
      
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

      this.toolbar.addTool(add_tool);
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
}

class FileExplorer extends Draggable
{
    private file_list_provider: any;
    private browsing_panel: HTMLElement;
    private file_select_mode: any;
    private selected_files: any;

    constructor(accept = "file" , accept_func = (item) => {} , accept_type = "single")
    {
        let panel = document.createElement("div");
        super(panel,panel);
        //this.file_list_provider = new FileBrowserBackendInteracter(path);
        this.browsing_panel = panel;
        this.browsing_panel.className = "FileBrowserWindow";
        this.file_select_mode = {"type" : accept , "func" : accept_func , "count" : accept_type};
        
        let RotatingSection = document.createElement("div");
        RotatingSection.className = "Rotor";
        RotatingSection.appendChild(document.createElement("div"));
        RotatingSection.appendChild(document.createElement("div"));
        this.browsing_panel.appendChild(RotatingSection);

        let MainPanel = document.createElement("div");
        MainPanel.className = "MainPanel";
        let ToolsSection = document.createElement("div");
        ToolsSection.className = "Tools";
        let UpDirButton = document.createElement("img");
        UpDirButton.src = "./media/up-arrow.png";
        //UpDirButton.onclick = ()=>{ this.#FileBrowser.gotoParentDir(); this.fetchItems(); };
        ToolsSection.appendChild(UpDirButton);
        if(accept == "dir" || accept_type == "multiple")
        {
            let SelectButton = document.createElement("img");
            SelectButton.src = "./media/check-mark-small.png";

            if(accept == "dir" && accept_type == "multiple")
            {
                let addButton = document.createElement("img");
                addButton.src = "../media/plus-small.png";
                //addButton.onclick = () => { this.SelectedItems[this.#FileBrowser.CurrentDirPath] = this.#FileBrowser.CurrentDirName };
                ToolsSection.appendChild(document.createTextNode("\u00A0\u00A0"));
                ToolsSection.appendChild(addButton);
            }
            
            if(accept_type == "single")
            {
              //SelectButton.onclick = () => { accept_func(this.#FileBrowser.CurrentDirPath); };
            }
            else if(accept_type == "multiple")
            {
                this.selected_files = {};
                SelectButton.onclick = () => { accept_func(Object.keys(this.selected_files)); };
                let SelectedContainer = document.createElement("img");
                SelectedContainer.src ="./media/collection-small.png";

                let SelectedPanel = null;

                SelectedContainer.onclick = () => {
                    if(SelectedPanel != null)
                    {
                       SelectedPanel.parentElement.removeChild(SelectedPanel);
                       SelectedPanel = null;
                    }
                    else
                    {
                        SelectedPanel = document.createElement("div");
                        SelectedPanel.className = "SelectedPanel";
                        Object.keys(this.selected_files).forEach((itm)=>{
                            let dv = document.createElement("div");
                            dv.className = "Item";
                            dv.innerHTML = "&nbsp;&nbsp;" + this.selected_files[itm];
                            SelectedPanel.appendChild(dv);
                            let CloseIco = document.createElement("img");
                            CloseIco.src = "../media/remove.png";
                            dv.appendChild(CloseIco);
                            dv.onclick = () => {
                                delete this.selected_files[itm];
                                setTimeout(()=>{SelectedPanel.removeChild(dv)},10);
                            }
                        });
                        this.browsing_panel.appendChild(SelectedPanel);
                    }
                };

                ToolsSection.appendChild(document.createTextNode("\u00A0\u00A0"));
                ToolsSection.appendChild(SelectedContainer);
            }

            ToolsSection.appendChild(document.createTextNode("\u00A0\u00A0"));
            ToolsSection.appendChild(SelectButton);
        }
        MainPanel.appendChild(ToolsSection);
        this.browsing_panel.appendChild(MainPanel);

        /*this.#ItemsPanel = document.createElement("div");
        this.#ItemsPanel.className = "ItemSection";*/
        //MainPanel.appendChild(this.#ItemsPanel);

        this.fetchItems();

    }
    private makeFilePanel(name)
    {
        let panel = document.createElement("div");
        panel.title = name;
        panel.className = "Item File";
        panel.appendChild(document.createElement("div"));
        panel.children[0].innerHTML = name;
        if(this.file_select_mode["type"] == "file")
        {
            /*panel.onclick = () =>{  this.file_select_mode["count"] == "single"
                                            ? 
                                    this.file_select_mode["func"](this.#FileBrowser.CurrentDirPath + '/' + name)
                                            :
                                    this.SelectedItems[this.#FileBrowser.CurrentDirPath + '/' + name] = name
                                 };*/
        }
        return panel
    }
    private makeFolderPanel(name)
    {
        let panel = document.createElement("div");
        panel.title = name;
        panel.className = "Item Folder";
        panel.appendChild(document.createElement("div"));
        panel.children[0].innerHTML = name;
        panel.onclick = ()=>{
            //this.#FileBrowser.gotoSubDir(name);
            this.fetchItems();
        }
        return panel;
    }
    fetchItems()
    {
       /* this.#FileBrowser.getItems().then((items)=>{
            this.#ItemsPanel.innerHTML = '';
            let TimeInterVal = 20;
            items.forEach((arr)=>{
                let panel = arr["IsDir"] ? this.#makeFolderPanel(arr["Name"]) : this.#makeFilePanel(arr["Name"]);
                panel.style.opacity = 0;
                panel.style.transform = "scale(0)";
                this.#ItemsPanel.appendChild(panel);
                setTimeout(()=>{panel.style.opacity = 1 ; panel.style.transform = "scale(1)";} , TimeInterVal);
                TimeInterVal += 20;
            });
        });*/
    }
    public getPanel(): HTMLElement
    {
        return this.browsing_panel;
    }
}

class Editor
{
 private area: HTMLElement;
 constructor(area: HTMLElement)
 {
   this.area = area;
 }
 public addPanel(panel: Panel): void
 {
   this.area.appendChild(panel.getPanel());
 } 
 public addFileExplorer(file_explorer: FileExplorer): void
 {
   this.area.appendChild(file_explorer.getPanel());
 }
}
class FileExplorer extends Draggable
{
    private file_list_provider: any;
    private browsing_panel: HTMLElement;
    private items_container: HTMLElement;
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

        this.items_container = document.createElement("div");
        this.items_container.className = "ItemSection";
        MainPanel.appendChild(this.items_container);

        this.fetchItems();

    }
    public addFilePanel(name: string)
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
        this.items_container.appendChild(panel);
    }
    public addFolderPanel(name: string)
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
         this.items_container.appendChild(panel);
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
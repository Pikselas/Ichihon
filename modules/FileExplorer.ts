class FileExplorer extends Draggable
{
    private file_list_provider: FileLister;
    private browsing_panel: HTMLElement;
    private items_container: HTMLElement;
    private selected_files: any;

    constructor(file_lister: FileLister)
    {
        let panel = document.createElement("div");
        super(panel,panel);
        this.file_list_provider = file_lister
        this.browsing_panel = panel;
        this.browsing_panel.className = "FileBrowserWindow";

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
        UpDirButton.onclick = ()=>{ this.file_list_provider.gotoParentDir(); this.fetchItems(); };
        ToolsSection.appendChild(UpDirButton);
        
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
            this.file_list_provider.gotoSubDir(name);
            this.fetchItems();
        }
         this.items_container.appendChild(panel);
    }
    async fetchItems()
    {
        let items = await this.file_list_provider.listItems();
        this.items_container.innerHTML = '';
        items.forEach((item)=>
        {
            item.type == "file" ? this.addFilePanel(item.name) : this.addFolderPanel(item.name);
        });
    }
    public getPanel(): HTMLElement
    {
        return this.browsing_panel;
    }
}
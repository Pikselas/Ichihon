class FileExplorer extends Draggable
{
    private file_list_provider: FileLister;
    private browsing_panel: HTMLElement;
    private items_container: HTMLElement;
    private selection_button: HTMLImageElement;

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
        UpDirButton.title = "Parent Directory";

        let ConfirmButton = document.createElement("img");
        ConfirmButton.src = "./media/confirm-mark.png";
        ConfirmButton.title = "Confirm Selection";

        let SelectionButton = document.createElement("img");
        
        SelectionButton.src = "./media/select-all.png";
        SelectionButton.title = "Select All";
        SelectionButton["is_selected"] = false;

        SelectionButton.addEventListener("click", ()=>
        {
            let selections = document.querySelectorAll("input[name=file_explorer_select_box]");

            if(SelectionButton["is_selected"])
            {
                selections.forEach((select_box: HTMLInputElement)=>
                {
                    select_box.checked = false;
                });
                SelectionButton["is_selected"] = false;
                SelectionButton.title = "Select All";
                SelectionButton.src = "./media/select-all.png";
            }
            else
            {
                selections.forEach((select_box: HTMLInputElement)=>
                {
                    select_box.checked = true;
                });
                SelectionButton["is_selected"] = true;
                SelectionButton.title = "Select None";
                SelectionButton.src = "./media/select-none.png";
            }
        });
        
        this.selection_button = SelectionButton;

        ToolsSection.appendChild(UpDirButton);
        ToolsSection.appendChild(ConfirmButton);
        ToolsSection.appendChild(SelectionButton);
        
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

        let select_box = document.createElement("input");
        select_box.type = "checkbox";
        select_box.name = "file_explorer_select_box";

        panel.appendChild(select_box);

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
        this.selection_button.src = "./media/select-all.png";
        this.selection_button["is_selected"] = false;
        this.selection_button.title = "Select All";
    }
    public getPanel(): HTMLElement
    {
        return this.browsing_panel;
    }
}
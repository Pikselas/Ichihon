class FileExplorer extends Draggable implements PanelObservable
{
    private file_list_provider: FileLister;
    private browsing_panel: HTMLElement;
    private items_container: HTMLElement;
    private selection_button: HTMLImageElement;

    private observers: PanelObserver[] = [];

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

        ConfirmButton.onclick = ()=>
        {
            let selections = document.querySelectorAll("input[name=file_explorer_select_box]:checked");
            let selected_files: string[] = [];
            selections.forEach((select_box: HTMLInputElement)=>
            {
                selected_files.push(this.file_list_provider.getCurrentDir() + '/' + select_box.parentElement.title);
            });
            this.notifyObservers({type: CHANGE_file_selected, data: selected_files});
        }

        let SelectionButton = document.createElement("img");
        
        SelectionButton.src = "./media/select-all.png";
        SelectionButton.title = "Select All";
        SelectionButton["is_selected"] = false;

        SelectionButton.addEventListener("click" , ()=>{ this.toggleSelectionButton() } );
        
        this.selection_button = SelectionButton;

        let link_button = document.createElement("img");
        link_button.src = "./media/connect-medium.png";
        link_button.title = "Connect to this panel";
        link_button.onclick = ()=>
        { 
            if(ACTIVE_LINK_OBSERVER != null)
            {
                GLOBAL_LINK_MANAGER.Connect(ACTIVE_LINK_OBSERVER , this);
            }
        }

        ToolsSection.appendChild(UpDirButton);
        ToolsSection.appendChild(ConfirmButton);
        ToolsSection.appendChild(SelectionButton);
        ToolsSection.appendChild(link_button);
        
        MainPanel.appendChild(ToolsSection);
        this.browsing_panel.appendChild(MainPanel);

        this.items_container = document.createElement("div");
        this.items_container.className = "ItemSection";
        MainPanel.appendChild(this.items_container);

        this.fetchItems();

    }

    private toggleSelectionButton()
    {
        let selections = this.browsing_panel.querySelectorAll("input[name=file_explorer_select_box]");

        if(this.selection_button["is_selected"])
        {
            selections.forEach((select_box: HTMLInputElement)=>
            {
                select_box.checked = false;
            });
            this.selection_button["is_selected"] = false;
            this.selection_button.title = "Select All";
            this.selection_button.src = "./media/select-all.png";
        }
        else
        {
            selections.forEach((select_box: HTMLInputElement)=>
            {
                select_box.checked = true;
            });
            this.selection_button["is_selected"] = true;
            this.selection_button.title = "Select None";
            this.selection_button.src = "./media/select-none.png";
        }

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
        this.selection_button["is_selected"] ? this.toggleSelectionButton() : null;
    }
    public getPanel(): HTMLElement
    {
        return this.browsing_panel;
    }

    public addObserver(observer: PanelObserver)
    {
        this.observers.push(observer);
    }

    public removeObserver(observer: PanelObserver)
    {
        let index = this.observers.indexOf(observer);
        if(index != -1)
        {
            this.observers.splice(index,1);
        }
    }

    private notifyObservers(data: ChangeData)
    {
        this.observers.forEach((observer)=>
        {
            observer.onChangeDetected(data);
        });
    }
}
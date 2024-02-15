class FileExplorer extends Draggable {
    file_list_provider;
    browsing_panel;
    items_container;
    selected_files;
    constructor(file_lister) {
        let panel = document.createElement("div");
        super(panel, panel);
        this.file_list_provider = file_lister;
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
        //UpDirButton.onclick = ()=>{ this.#FileBrowser.gotoParentDir(); this.fetchItems(); };
        ToolsSection.appendChild(UpDirButton);
        MainPanel.appendChild(ToolsSection);
        this.browsing_panel.appendChild(MainPanel);
        this.items_container = document.createElement("div");
        this.items_container.className = "ItemSection";
        MainPanel.appendChild(this.items_container);
        this.fetchItems();
    }
    addFilePanel(name) {
        let panel = document.createElement("div");
        panel.title = name;
        panel.className = "Item File";
        panel.appendChild(document.createElement("div"));
        panel.children[0].innerHTML = name;
        this.items_container.appendChild(panel);
    }
    addFolderPanel(name) {
        let panel = document.createElement("div");
        panel.title = name;
        panel.className = "Item Folder";
        panel.appendChild(document.createElement("div"));
        panel.children[0].innerHTML = name;
        panel.onclick = () => {
            console.log("Clicked on " + name);
            this.file_list_provider.gotoSubDir(name);
            this.fetchItems();
        };
        this.items_container.appendChild(panel);
    }
    async fetchItems() {
        let items = await this.file_list_provider.listItems();
        this.items_container.innerHTML = '';
        let TimeInterVal = 20;
        items.forEach((item) => {
            item.type == "file" ? this.addFilePanel(item.name) : this.addFolderPanel(item.name);
        });
    }
    getPanel() {
        return this.browsing_panel;
    }
}

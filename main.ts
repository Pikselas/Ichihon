
let ACTIVE_LINK_OBSERVER: PanelObserver = null;
let GLOBAL_LINK_MANAGER: ObservableLinksManager = null;

function SetUpEditor(html_area : HTMLElement)
{
    const editor = new Editor(html_area);
    GLOBAL_LINK_MANAGER = new ObservableLinksManager(html_area);
    
    const panel = new Panel();
    const fileExplorer = new FileExplorer(new FileLister("/get_file_list","D:"));
    const fileExplorer2 = new FileExplorer(new FileLister("/get_file_list","D:"));

    editor.addPanel(panel);
    editor.addFileExplorer(fileExplorer);
    editor.addFileExplorer(fileExplorer2);
}
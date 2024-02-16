
function SetUpEditor(html_area : HTMLElement)
{
    const editor = new Editor(html_area);
    
    
    const panel = new Panel();
    const fileExplorer = new FileExplorer(new FileLister("/get_file_list","D:"));
    const link = new LinkLine(panel.getPanel(),fileExplorer.getPanel());

    fileExplorer.addObserver(panel);

    editor.addPanel(panel);
    editor.addFileExplorer(fileExplorer);

    document.body.appendChild(link.getLinkLine());
}
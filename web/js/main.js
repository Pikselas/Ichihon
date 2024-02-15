function SetUpEditor(html_area) {
    const editor = new Editor(html_area);
    const panel = new Panel();
    panel.setPosition(350, 250);
    const media1 = new ImageObject("///D:/CoderWallp/19132949_p0.jpg");
    const media2 = new ImageObject("///D:/CoderWallp/13534647_p0.jpg");
    panel.addMediaObject(media1);
    panel.addMediaObject(media2);
    //editor.addPanel(panel);
    let fileExplorer1 = new FileExplorer(new FileLister("/get_file_list/D:"));
    //let fileExplorer2 = new FileExplorer();
    fileExplorer1.addFilePanel("file_!.png");
    editor.addFileExplorer(fileExplorer1);
    // editor.addFileExplorer(fileExplorer2);
    // let tool_bar = new Toolbar();
    // editor.addToolbar(tool_bar);
    // tool_bar.addTool(new Tool("./media/plus-small.png" , "Add Panel"));
    // tool_bar.setWidth(100);
    // tool_bar.setHeight(450);
    // let link1 = new LinkLine(panel.getPanel(), fileExplorer1.getPanel());
    // let link2 = new LinkLine(panel.getPanel(), fileExplorer2.getPanel()); 
    // document.body.appendChild(link1.getLinkLine());
    // document.body.appendChild(link2.getLinkLine());
}

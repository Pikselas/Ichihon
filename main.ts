function SetUpEditor(html_area : HTMLElement)
{
    const editor = new Editor(html_area);
    const panel = new Panel();
    
    panel.setPosition(350 , 250);
    
    const media1 = new ImageObject("///D:/CoderWallp/19132949_p0.jpg");
    const media2 = new ImageObject("///D:/CoderWallp/13534647_p0.jpg");

    panel.addMediaObject(media1);
    panel.addMediaObject(media2);

    editor.addPanel(panel);

    editor.addFileExplorer(new FileExplorer());
}

class obs implements PanelObserver
{
    onChangeDetected(change: ChangeData): void
    {
        console.log(change);
    }
}

function SetUpEditor(html_area : HTMLElement)
{
    const editor = new Editor(html_area);
    const panel = new Panel();
    
    panel.setPosition(350 , 250);
    
    const media1 = new ImageObject("///D:/CoderWallp/19132949_p0.jpg");
    const media2 = new ImageObject("///D:/CoderWallp/13534647_p0.jpg");

    panel.addMediaObject(media1);
    panel.addMediaObject(media2);

    //editor.addPanel(panel);

    let fileExplorer1 = new FileExplorer(new FileLister("/get_file_list","D:"));
    //let fileExplorer2 = new FileExplorer();

    fileExplorer1.addFilePanel("file_!.png");

    editor.addFileExplorer(fileExplorer1);


    fileExplorer1.addObserver(new obs());

}
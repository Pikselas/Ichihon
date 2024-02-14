class LinkLine
{
    private link_line: SVGLineElement;
    private link_line_svg: SVGElement;

    private linkable1: HTMLElement;
    private linkable2: HTMLElement;

    private observer: MutationObserver;
    constructor(linkable1: HTMLElement, linkable2: HTMLElement)
    {

        this.linkable1 = linkable1;
        this.linkable2 = linkable2;

        this.link_line_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        this.link_line_svg.setAttribute("style" , "position: absolute;z-index:-1;top:0;left:0;");
        
        //this.link_line_svg.setAttribute("width" , "100vw");
        //this.link_line_svg.setAttribute("height" , "100vh");

        this.link_line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        this.link_line.setAttribute("x1" , this.linkable1.getBoundingClientRect().left.toString());
        this.link_line.setAttribute("y1" , this.linkable1.getBoundingClientRect().top.toString());

        this.link_line.setAttribute("x2" , this.linkable2.getBoundingClientRect().left.toString());
        this.link_line.setAttribute("y2" , this.linkable2.getBoundingClientRect().top.toString());

        this.link_line.setAttribute("style" , "stroke:rgb(255,0,0);stroke-width:2");

        this.link_line_svg.appendChild(this.link_line);

       this.observer = new MutationObserver((mutations) => 
       {
              mutations.forEach((mutation) => 
              {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style')
                {
                     this.updateLinkLine();
                }
              });
       });

       this.observer.observe(linkable1 , { attributes: true });
       this.observer.observe(linkable2 , { attributes: true });
    }

    private updateLinkLine()
    {
        this.link_line_svg.setAttribute("width" , document.documentElement.scrollWidth.toString());
        this.link_line_svg.setAttribute("height" , document.documentElement.scrollHeight.toString());

        console.log(document.documentElement.scrollLeft ,  this.linkable1.getBoundingClientRect().left , document.documentElement.scrollTop + this.linkable1.getBoundingClientRect().top);

        this.link_line.setAttribute("x1" , (document.documentElement.scrollLeft +  this.linkable1.getBoundingClientRect().left).toString());
        this.link_line.setAttribute("y1" , (document.documentElement.scrollTop + this.linkable1.getBoundingClientRect().top).toString());

        this.link_line.setAttribute("x2" , (document.documentElement.scrollLeft + this.linkable2.getBoundingClientRect().left).toString());
        this.link_line.setAttribute("y2" , (document.documentElement.scrollTop + this.linkable2.getBoundingClientRect().top).toString());
    }

    public getLinkLine()
    {
        return this.link_line_svg;
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

    editor.addPanel(panel);

    let fileExplorer1 = new FileExplorer();
    let fileExplorer2 = new FileExplorer();

    editor.addFileExplorer(fileExplorer1);
    editor.addFileExplorer(fileExplorer2);

    let tool_bar = new Toolbar();
    editor.addToolbar(tool_bar);

    tool_bar.addTool(new Tool("./media/plus-small.png" , "Add Panel"));

    tool_bar.setWidth(100);
    tool_bar.setHeight(450);

    let link1 = new LinkLine(panel.getPanel(), fileExplorer1.getPanel());
    let link2 = new LinkLine(panel.getPanel(), fileExplorer2.getPanel()); 

    document.body.appendChild(link1.getLinkLine());
    document.body.appendChild(link2.getLinkLine());

}
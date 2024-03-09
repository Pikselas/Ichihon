class LinkLine
{
    public static link_line_svg: SVGElement = LinkLine.InitializeSVG();

    private static InitializeSVG()
    {
        let link_line_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        link_line_svg.setAttribute("style" , "position: absolute;z-index:-1;top:0;left:0;");
        return link_line_svg;
    }

    private link_line: SVGLineElement;

    private linkable1: HTMLElement;
    private linkable2: HTMLElement;

    private parent_element: HTMLElement;

    private observer: MutationObserver;

    constructor(linkable1: HTMLElement, linkable2: HTMLElement , parent_element: HTMLElement)
    {

        this.linkable1 = linkable1;
        this.linkable2 = linkable2;

        this.parent_element = parent_element;
        this.link_line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        this.link_line.setAttribute("style" , "stroke:rgb(2, 250, 233);stroke-width:2");

        LinkLine.link_line_svg.appendChild(this.link_line);

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

       this.updateLinkLine();
    }

    private updateLinkLine()
    {

        if(LinkLine.link_line_svg.parentElement != null)
        {
            let html_area = LinkLine.link_line_svg.parentElement;
            LinkLine.link_line_svg.setAttribute("width" , html_area.scrollWidth.toString());
            LinkLine.link_line_svg.setAttribute("height" , html_area.scrollHeight.toString());
        }

        this.link_line.setAttribute("x1" , (this.parent_element.scrollLeft +  this.linkable1.getBoundingClientRect().left + this.linkable1.clientWidth / 2).toString());
        this.link_line.setAttribute("y1" , (this.parent_element.scrollTop + this.linkable1.getBoundingClientRect().top + this.linkable1.clientHeight / 2).toString());

        this.link_line.setAttribute("x2" , (this.parent_element.scrollLeft + this.linkable2.getBoundingClientRect().left + this.linkable2.clientWidth / 2).toString());
        this.link_line.setAttribute("y2" , (this.parent_element.scrollTop + this.linkable2.getBoundingClientRect().top + this.linkable2.clientHeight / 2).toString());
    }

    private start_observing()
    {
        this.observer.observe(this.linkable1 , { attributes: true });
        this.observer.observe(this.linkable2 , { attributes: true });
        this.updateLinkLine();
    }

    public setLinkable1(linkable: HTMLElement)
    {
        this.observer.disconnect();
        this.linkable1 = linkable;
        this.start_observing();
    }

    public setLinkable2(linkable: HTMLElement)
    {
        this.observer.disconnect();
        this.linkable2 = linkable;
        this.start_observing();
    }

    public getLinkable1()
    {
        return this.linkable1;
    }

    public getLinkable2()
    {
        return this.linkable2;
    }

    public remove()
    {
        this.observer.disconnect();
        this.link_line.remove();
    }

    public setColor(color: string)
    {
        this.link_line.setAttribute("style" , "stroke:" + color + ";stroke-width:2");
    }
}
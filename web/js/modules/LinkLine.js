class LinkLine {
    link_line;
    link_line_svg;
    linkable1;
    linkable2;
    observer;
    constructor(linkable1, linkable2) {
        this.linkable1 = linkable1;
        this.linkable2 = linkable2;
        this.link_line_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.link_line_svg.setAttribute("style", "position: absolute;z-index:-1;top:0;left:0;");
        this.link_line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.link_line.setAttribute("x1", this.linkable1.getBoundingClientRect().left.toString());
        this.link_line.setAttribute("y1", this.linkable1.getBoundingClientRect().top.toString());
        this.link_line.setAttribute("x2", this.linkable2.getBoundingClientRect().left.toString());
        this.link_line.setAttribute("y2", this.linkable2.getBoundingClientRect().top.toString());
        this.link_line.setAttribute("style", "stroke:rgb(2, 250, 233);stroke-width:2");
        this.link_line_svg.appendChild(this.link_line);
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    this.updateLinkLine();
                }
            });
        });
        this.observer.observe(linkable1, { attributes: true });
        this.observer.observe(linkable2, { attributes: true });
    }
    updateLinkLine() {
        this.link_line_svg.setAttribute("width", document.documentElement.scrollWidth.toString());
        this.link_line_svg.setAttribute("height", document.documentElement.scrollHeight.toString());
        // console.log(document.documentElement.scrollLeft ,  this.linkable1.getBoundingClientRect().left , document.documentElement.scrollTop + this.linkable1.getBoundingClientRect().top);
        console.log(this.linkable1.clientHeight);
        this.link_line.setAttribute("x1", (document.documentElement.scrollLeft + this.linkable1.getBoundingClientRect().left + this.linkable1.clientWidth / 2).toString());
        this.link_line.setAttribute("y1", (document.documentElement.scrollTop + this.linkable1.getBoundingClientRect().top + this.linkable1.clientHeight / 2).toString());
        this.link_line.setAttribute("x2", (document.documentElement.scrollLeft + this.linkable2.getBoundingClientRect().left + this.linkable2.clientWidth / 2).toString());
        this.link_line.setAttribute("y2", (document.documentElement.scrollTop + this.linkable2.getBoundingClientRect().top + this.linkable2.clientHeight / 2).toString());
    }
    getLinkLine() {
        return this.link_line_svg;
    }
}

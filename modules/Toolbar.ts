class Toolbar extends Panel
{
   constructor()
   {
      super();
      this.panel.className = "toolbar";
   }
   public addTool(tool: Tool): void
   {
      this.panel.appendChild(tool.getTool());
   }
}

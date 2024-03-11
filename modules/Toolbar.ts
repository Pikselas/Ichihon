class Toolbar extends EditorViewPanel
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

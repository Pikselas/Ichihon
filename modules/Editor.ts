
class MediaObject
{
   private media_object: HTMLElement;
   protected constructor(media_object: HTMLElement)
   {
      this.media_object = media_object;
      this.media_object.className = "media_object";
   }
   public getMediaObject(): HTMLElement
   {
      return this.media_object;
   }
}

class ImageObject extends MediaObject
{
   constructor(image_object: HTMLImageElement | string)
   {
      if(typeof image_object === "string")
      {
         const image = document.createElement("img");
         image.src = image_object;
         super(image);
      }
      else
      {
         super(image_object);
      }
   }
}

class Editor
{
 private area: HTMLElement;
 constructor(area: HTMLElement)
 {
   this.area = area;
 }
 public addPanel(panel: Panel): void
 {
   this.area.appendChild(panel.getPanel());
 } 
 public addFileExplorer(file_explorer: FileExplorer): void
 {
   this.area.appendChild(file_explorer.getPanel());
 }
 public addToolbar(toolbar: Toolbar): void
 {
   this.area.appendChild(toolbar.getToolbar());
 }
}
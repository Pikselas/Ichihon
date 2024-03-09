
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
 public bindNodeConnector(panel: EditorViewPanel , node_connector: NodeConnector): void
 {
   node_connector.getNode().setPosition(panel.getPanel().offsetLeft - 15, panel.getPanel().offsetTop - 15);

   let observer = new MutationObserver((mutations)=>
   {
      for (let mutation of mutations)
      {
         if (mutation.type == 'attributes')
         {
            node_connector.getNode().setPosition(panel.getPanel().offsetLeft - 15, panel.getPanel().offsetTop - 15);
         }
      }
   });

   observer.observe(panel.getPanel(), { attributes: true });

   panel.mutation_observer = observer;

   this.area.appendChild(node_connector.getNode().getPanel());
 }
}
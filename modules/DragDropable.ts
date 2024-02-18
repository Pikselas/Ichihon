/*class Draggable
{
   private drag_element: HTMLElement;
   private drag_handler: any;
   
   private drag_start: any;
   private drag_end: any;
  
   private base_pos_x: number;
   private base_pos_y: number;

   public static MouseButton = 
   {
      LEFT: 0,
      MIDDLE: 1,
      RIGHT: 2
   };

   private action_key: number;
   constructor (capture_element: HTMLElement , target_element: HTMLElement , action_key:number = Draggable.MouseButton.LEFT)
   {
      this.action_key = action_key;
      this.drag_element = target_element;
      this.drag_start = this.onDragStart.bind(this);
      this.drag_end = this.onDragEnd.bind(this);

      this.base_pos_x = 0;
      this.base_pos_y = 0;

      target_element.draggable = true;

      capture_element.addEventListener("dragstart", this.drag_start);
      capture_element.addEventListener("mouseleave", ()=>{
         //this.onDragEnd();
      });
      //document.body.addEventListener("mouseup", this.drag_end);

      target_element.addEventListener("drag" , (event: DragEvent)=>
      {
         //event.preventDefault();
         //console.log("dragging" , event);
         target_element.style.top = event.clientY + "px";
         target_element.style.left = event.clientX + "px";
      });

   }
   private onDragStart(event: MouseEvent): void
   {
     if(event.button != this.action_key)
         return;
      event.preventDefault();*/
      /*event.stopImmediatePropagation();
      console.log("drag start");
      this.base_pos_x = this.drag_element.offsetLeft;
      this.base_pos_y = this.drag_element.offsetTop; 
      this.drag_handler = this.onDrag.bind(this,event.pageX ,event.pageY );
      //document.body.addEventListener("mousemove", this.drag_handler);
      

      //let parent = this.drag_element.parentNode;
      // parent.removeChild(this.drag_element);
      // parent.appendChild(this.drag_element);

   }
   private onDrag(offset_x:number , offset_y:number, event:MouseEvent): void
   {
      console.log("dragging" , (event.pageX - offset_x));
     this.drag_element.style.left = this.base_pos_x + (event.pageX - offset_x) + "px";
     this.drag_element.style.top = this.base_pos_y + (event.pageY - offset_y) + "px";
   }
   private onDragEnd(): void
   {
      document.body.removeEventListener("mousemove", this.drag_handler);
      this.drag_handler = null;
   }
   public clear(): void
   {
      document.body.removeEventListener("mousemove", this.drag_handler);
      this.drag_element.removeEventListener("mousedown", this.drag_start);
      document.body.removeEventListener("mouseup", this.drag_end);
   }
}*/

class DraggAble
{
   private static current_draggable: DraggAble = null;

   private target: Panel;
   private capture_pos_x: number;
   private capture_pos_y: number;

   private drag_star_x: number;
   private drag_start_y: number;

   constructor (target: Panel)
   {
      this.target = target;
      this.target.getPanel().draggable = true;

      target.getPanel().addEventListener("dragstart", (event: DragEvent)=>
      {  
         DraggAble.current_draggable = this;

         this.capture_pos_x = event.offsetX;
         this.capture_pos_y = event.offsetY;

         this.drag_star_x = event.clientX;
         this.drag_start_y = event.clientY;

         event.dataTransfer.setDragImage(new Image(), 0, 0);
      });

      // target.getPanel().addEventListener("drag", (event: DragEvent)=>
      // {
         
      // });
   }

   public dragTo(x: number, y: number): void
   {
      this.target.setPosition(x - this.capture_pos_x, y - this.capture_pos_y);
   }

   public resetPosition(): void
   {
      this.target.setPosition(this.drag_star_x - this.capture_pos_x, this.drag_start_y - this.capture_pos_y);
   }

   public getTarget(): Panel
   {
      return this.target;
   }

   public static GetCurrentDraggable(): DraggAble
   {
      return DraggAble.current_draggable;
   }
}

class DropArea
{
   public DropHandler: (event: DragEvent) => void = (event: DragEvent) => {}; 
   public DragOverHandler: (event: DragEvent) => void = (event: DragEvent) => {};

   private target_element: HTMLElement;
   
   private drag_handler: any;
   private drop_handler: any;

   constructor (target_element: HTMLElement)
   {
      this.target_element = target_element;
      
      this.drag_handler = (ev: DragEvent )=>
      {
         this.DragOverHandler(ev);
      }

      this.drop_handler = (ev: DragEvent )=>
      {
         this.DropHandler(ev);
      }

      target_element.addEventListener("dragover", this.drag_handler);
      target_element.addEventListener("drop", this.drop_handler);
   }

   public clear(): void
   {
      this.target_element.removeEventListener("dragover", this.drag_handler);
      this.target_element.removeEventListener("drop", this.drop_handler);

      this.drag_handler = null;
      this.drop_handler = null;

      this.DropHandler = null;
      this.DragOverHandler = null;
   }
}
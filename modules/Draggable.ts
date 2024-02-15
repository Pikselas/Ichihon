class Draggable
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

      capture_element.addEventListener("mousedown", this.drag_start);
      document.body.addEventListener("mouseup", this.drag_end);
   }
   private onDragStart(event: MouseEvent): void
   {
      if(event.button != this.action_key)
         return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.base_pos_x = this.drag_element.offsetLeft;
      this.base_pos_y = this.drag_element.offsetTop; 
      this.drag_handler = this.onDrag.bind(this,event.pageX ,event.pageY );
      document.body.addEventListener("mousemove", this.drag_handler);

      let parent = this.drag_element.parentNode;
      // parent.removeChild(this.drag_element);
      // parent.appendChild(this.drag_element);

   }
   private onDrag(offset_x:number , offset_y:number, event:MouseEvent): void
   {
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
}

type file_selection_type = "file_selected";
type ChangeType = file_selection_type;
type ChangeData = { type: ChangeType , data: any };

const CHANGE_file_selected: file_selection_type = "file_selected";

interface PanelObserver 
{
  onChangeDetected( change: ChangeData ): void;
}

interface PanelObservable
{
  addObserver(observer: PanelObserver): void;
  removeObserver(observer: PanelObserver): void;
}

type file_selection_type = "file_selected";
type ChangeType = file_selection_type;
type ChangeData = { type: ChangeType , data: any };

const CHANGE_file_selected: file_selection_type = "file_selected";

interface PanelObserver 
{
  onChangeDetected( change: ChangeData ): void;
  getPanel(): HTMLElement;
}

interface PanelObservable
{
  addObserver(observer: PanelObserver): void;
  removeObserver(observer: PanelObserver): void;
  getPanel(): HTMLElement;
}

class ObservableLinksManager
{
  private link_lines: LinkLine[] = [];
  private display_area: HTMLElement;
  constructor(display_area: HTMLElement)
  {
    this.display_area = display_area;
  }
  public Connect(observer: PanelObserver, observable: PanelObservable)
  {
    observable.addObserver(observer);
    let link_line = new LinkLine(observer.getPanel(), observable.getPanel());
    this.link_lines.push(link_line);
    this.display_area.appendChild(link_line.getLinkLine());
  }
}
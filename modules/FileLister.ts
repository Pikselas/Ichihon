
class FileLister
{
    private base_path: string;
    private current_path: string;
    constructor(base_path: string)
    {
        this.base_path = base_path;
        this.current_path = '';
    }

    public async listItems() : Promise<{name: string, type: "file" | "dir" }[]>
    {
        let res = await fetch(this.base_path + this.current_path);
        let data = await res.json();
        return data;
    }

    public gotoSubDir(name: string)
    {
        this.current_path += '/' + name;
    }

    public gotoParentDir()
    {
        let path = this.current_path.split('/');
        path.pop();
        this.current_path = path.join('/');
    }

    public getCurrentDir()
    {
        return this.base_path;
    }
}
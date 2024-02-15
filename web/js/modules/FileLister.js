class FileLister {
    base_path;
    current_path;
    constructor(base_path) {
        this.base_path = base_path;
        this.current_path = '';
    }
    async listItems() {
        let res = await fetch(this.base_path + this.current_path);
        let data = await res.json();
        return data;
    }
    gotoSubDir(name) {
        this.current_path += '/' + name;
    }
    gotoParentDir() {
        let path = this.current_path.split('/');
        path.pop();
        this.current_path = path.join('/');
    }
    getCurrentDir() {
        return this.base_path;
    }
}

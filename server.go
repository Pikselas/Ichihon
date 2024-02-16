package main

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
)

func path(method string, pattern string) string {
	return method + " " + pattern
}

type FileType = string

const (
	FileTypeFile FileType = "file"
	FileTypeDir  FileType = "dir"
)

type FileList struct {
	Name string   `json:"name"`
	Type FileType `json:"type"`
}

func GetFileList(Path string) []FileList {
	Items, _ := filepath.Glob(Path + "/*")
	fileList := make([]FileList, len(Items))

	for index, it := range Items {
		fi, _ := os.Stat(it)
		fileList[index] = FileList{
			Name: filepath.Base(it),
			Type: func() FileType {
				if fi.IsDir() {
					return FileTypeDir
				}
				return FileTypeFile
			}(),
		}
	}
	return fileList
}

func main() {

	http.HandleFunc(
		path(http.MethodGet, "/editor"),
		func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "web/editor.html")
		})

	http.HandleFunc(
		path(http.MethodGet, "/get_file_list/{path...}"),
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(GetFileList(r.PathValue("path")))
		})

	http.HandleFunc(
		path(http.MethodGet, "/get_file/{path...}"),
		func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, r.PathValue("path"))
		})

	http.HandleFunc(
		path(http.MethodGet, "/{path...}"),
		func(w http.ResponseWriter, r *http.Request) {
			http.ServeFile(w, r, "web/"+r.PathValue("path"))
		})

	http.ListenAndServe(":8080", nil)
}

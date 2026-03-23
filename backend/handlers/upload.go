package handlers

import (
	"fmt"
	"io"
	"livefeeds/backend/config"
	"livefeeds/backend/constants"
	"livefeeds/backend/models"
	"livefeeds/backend/utils"
	"log"
	"net/http"
	"os"
	"strings"
)

func (h *Hub) HandleUpload(w http.ResponseWriter, r *http.Request) {

	r.Body = http.MaxBytesReader(w, r.Body, config.MaxUploadSize)
	parseFileError := r.ParseMultipartForm(config.MaxUploadSize)
	if parseFileError != nil {
		http.Error(w, constants.ErrorFileTooLarge, http.StatusBadRequest)
		return
	}

	file, handler, fileReadError := r.FormFile("image")

	if fileReadError != nil {
		http.Error(w, constants.ErrorFileRead, http.StatusBadRequest)
		return
	}

	defer file.Close()

	title := r.FormValue("title")
	tagsValue := r.FormValue("tags")

	tags := []string{}
	if tagsValue != "" {
		tags = strings.Split(tagsValue, ",")
	}

	dirErr := os.MkdirAll(config.UploadFolder, os.ModePerm)

	if dirErr != nil {
		http.Error(w, constants.ErrorCreateFolder, http.StatusInternalServerError)
		return
	}
	localPath := fmt.Sprintf("%s/%s", config.UploadFolder, handler.Filename)
	createdFile, fileCreateError := os.Create(localPath)

	if fileCreateError != nil {
		http.Error(w, constants.ErrorFileCreate, http.StatusInternalServerError)
		return
	}
	defer createdFile.Close()

	_, copyError := io.Copy(createdFile, file)
	if copyError != nil {
		http.Error(w, constants.ErrorFileCopy, http.StatusInternalServerError)
		return
	}

	normalizeErr := utils.NormalizeImage(localPath)
	if normalizeErr != nil {
		log.Println("normalise failed:", normalizeErr)
	}

	imageURL := fmt.Sprintf("%s/%s/%s", config.BackendURL, config.UploadFolder, handler.Filename)
	newImage := models.Image{Title: title, Tags: tags, URL: imageURL, ID: handler.Filename}
	UpdateImageList(newImage)
	h.Broadcast(newImage)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

}

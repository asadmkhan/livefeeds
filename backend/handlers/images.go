package handlers

import (
	"encoding/json"
	"livefeeds/backend/config"
	"livefeeds/backend/constants"
	"livefeeds/backend/data"
	"livefeeds/backend/models"
	"net/http"
)

var ImageList = []models.Image{}

func init() {

	ImageList = append(ImageList, data.SeedImages...)

}

func GetImageList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", config.CacheMaxAge)
	encErr := json.NewEncoder(w).Encode(ImageList)

	if encErr != nil {
		http.Error(w, constants.ErrorEncodeImage, http.StatusInternalServerError)
	}
}

func UpdateImageList(image models.Image) {
	ImageList = append(ImageList, image)
}

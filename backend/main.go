package main

import (
	"livefeeds/backend/config"
	"livefeeds/backend/constants"
	"livefeeds/backend/handlers"
	"log"
	"net/http"
)

func main() {
	log.Println("Server is running on ", config.BackendURL)
	apiRouter := http.NewServeMux()

	apiRouter.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, apiError := w.Write([]byte(constants.MessageServerRunning))
		if apiError != nil {
			log.Println("Error writing response:", apiError)
		}
	})

	hub := handlers.CreateHub()
	apiRouter.HandleFunc("/api/images", handlers.GetImageList)
	apiRouter.HandleFunc("/api/uploads", hub.HandleUpload)
	apiRouter.HandleFunc("/api/websocket", hub.HandleConnection)
	apiRouter.Handle(
		"/"+config.UploadFolder+"/",
		http.StripPrefix("/"+config.UploadFolder+"/",
			http.FileServer(http.Dir(config.UploadFolder))))

	handler := corsMiddleware(apiRouter)
	if listenError := http.ListenAndServe(config.Port, handler); listenError != nil {
		log.Fatal("Error starting server:", listenError)
	}

}

func corsMiddleware(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", config.AllowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})

}

package handlers

import (
	"net/http"

	"github.com/gorilla/websocket"
	"livefeeds/backend/constants"
	"livefeeds/backend/models"
)

type Hub struct {
	connections map[*websocket.Conn]bool
	upgrader    websocket.Upgrader
}

func CreateHub() *Hub {

	return &Hub{
		connections: make(map[*websocket.Conn]bool),
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}
}

func (h *Hub) HandleConnection(w http.ResponseWriter, r *http.Request) {

	connRes, connErr := h.upgrader.Upgrade(w, r, nil)

	if connErr != nil {

		http.Error(w, constants.ErrorWSConnect, http.StatusBadRequest)
		return
	}

	h.connections[connRes] = true
	defer delete(h.connections, connRes)

	for {
		_, _, msgErr := connRes.ReadMessage()

		if msgErr != nil {
			break
		}

	}

}

func (h *Hub) Broadcast(image models.Image) {

	for connection := range h.connections {

		connErr := connection.WriteJSON(image)

		if connErr != nil {
			delete(h.connections, connection)
		}
	}
}

import { useEffect, useState } from "react";
import type { Image } from "../types";
import {
  ERROR_IMAGES_LOAD_FAILURE,
  ERROR_WS_FAILURE,
} from "../constants/messages";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const wsUrl = import.meta.env.VITE_WS_URL;

export function useImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/images`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(ERROR_IMAGES_LOAD_FAILURE);
        }
        return response.json();
      })
      .then((rd) => {
        setImages(rd);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const websocket = new WebSocket(`${wsUrl}/api/websocket`);
    websocket.onopen = () => setError(null);
    websocket.onerror = () => setError(ERROR_WS_FAILURE);
    websocket.onmessage = (event) => {
      const newImage = JSON.parse(event.data);
      setImages((prv) => [...prv, newImage]);
    };
    return () => websocket.close();
  }, []);

  return { images, error };
}

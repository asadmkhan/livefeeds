# LiveFeeds

A small Instagram-like image feed app. Users can upload images and anyone connected will see them appear live in the feed without refreshing.

---

## Tech Stack

**Backend:** Go + gorilla/websocket
I had no prior experience with Go before this project. I picked it up for this assignment because I like learning new things and it seemed like a solid choice for a statically typed backend. There's definitely still a lot for me to learn about it.

**Frontend:** React + TypeScript + Tailwind CSS + Vite
React made sense for a project this size , it's lightweight and gets you moving fast. I've used Tailwind before so it was the quickest way to put together a decent UI. Icons are from lucide-react. Tests written with Vitest and React Testing Library.

---

## Running Locally

### Requirements

- Go 1.26+
- Node.js 20+

### Backend

```bash
cd backend
go mod download
go run main.go
```

Server runs on `http://localhost:8010`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs on `http://localhost:3010`

### Running Tests

```bash
cd frontend
npm test
```

---

## Running With Docker

Make sure Docker Desktop is running, then from the root folder:

```bash
docker compose up --build
```

- Frontend: `http://localhost:3010`
- Backend: `http://localhost:8010`

Uploaded images are stored in `backend/UploadedImages/` and mounted as a volume so they survive container rebuilds.

---

## Architecture

The backend is a simple Go HTTP server with three main things going on:

**REST endpoints** : serve the initial image list and accept uploads. For the seed images I used https://picsum.photos/ as the image source.

**WebSocket Hub** : I came from a C# background where we used SignalR with a hub pattern, so I went with the same idea here. The Hub keeps track of all active WebSocket connections and broadcasts new images to everyone when an upload happens.

**File storage** : uploaded images go straight to disk in the `UploadedImages/` folder. The backend serves them as static files.

The frontend fetches the initial image list on load, then opens a WebSocket connection to receive live updates. Filtering and sorting all happen on the frontend side.

---

## Flow of Application

When a user opens the app:

1. Frontend fetches the image list from `/api/images`
2. A WebSocket connection opens to `/api/websocket`
3. When someone uploads an image the backend saves it to disk,
   adds it to the in-memory list, and broadcasts it to all
   connected clients over WebSocket
4. Every connected browser receives the new image and adds it
   to the feed without any page refresh

---

## Design Decisions

- **Hub pattern for WebSocket** : familiar from SignalR in C#, made sense to apply the same concept here
- **Tailwind CSS** : quick to work with, good for getting a clean UI without writing a lot of custom CSS
- **No database** : the assignment said local storage was fine so I kept it simple with in-memory image list and files on disk
- **Frontend filtering** : since the dataset is small, filtering by tags and search happens on the frontend without extra API calls
- **Basic caching** : added Cache-Control header to GET /api/images so the browser caches the image list for 15 seconds between refreshes
- **Image normalisation** : uploaded images are resized to a max width of 1200px using golang.org/x/image

---

## Codebase Overview

The app is split into backend and frontend folders. On the backend
I tried to keep things separated, handlers deal with HTTP
requests, models for data and error messages all
live in one constants file rather than being hardcoded everywhere.
On the frontend the same idea, data fetching in `useImages.ts`,
filter and sort logic handled in `filterImages.ts`, and each component
like `Feed.tsx`, `Filter.tsx` and `Upload.tsx` performs its own function.
I also added a constants file on the frontend side for error messages
so both sides follow the same pattern. Having said that more segregation could
have been done but it would take more time.

---

## What I'd Add With More Time

- Persist uploaded image metadata to disk so the list survives server restarts
- Better UI : there are a few rough edges I'd clean up given more time
- Proper CSS organisation : right now styles are inline Tailwind classes, I'd move towards a more structured approach
- More unit tests covering the Go handlers

---

## API

**Base URL:** `http://localhost:8010`

---

### GET /api/images

Returns all images currently in the feed.

```json
[
  {
    "ID": "photo.png",
    "Title": "some title",
    "URL": "http://localhost:8010/UploadedImages/photo.png",
    "Tags": ["tag1", "tag2"]
  }
]
```

---

### POST /api/uploads

Upload a new image. Send as `multipart/form-data` with these fields:

- `image` : the image file, max 10MB
- `title` : image title
- `tags` : comma separated e.g. `nature,travel,city`

Returns `201` on success. The uploaded image gets broadcast to all connected WebSocket clients automatically.

---

### WS /api/websocket

Open a WebSocket connection to receive new images in real time. Each message is a single image object in the same shape as the GET response above.

Connect with: `ws://localhost:8010/api/websocket`

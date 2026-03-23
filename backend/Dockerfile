FROM golang:1.26.1-alpine

WORKDIR /livefeeds

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o livefeeds-server .

RUN mkdir -p UploadedImages

EXPOSE 8010

CMD ["./livefeeds-server"]
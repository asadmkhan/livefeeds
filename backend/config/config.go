package config

const (
	Port          = ":8010"
	UploadFolder  = "UploadedImages"
	BackendURL    = "http://localhost:8010"
	MaxUploadSize = 10 << 20
	AllowedOrigin = "*"
	CacheMaxAge   = "max-age=15, must-revalidate"
	ImageMaxWidth = 1200
)

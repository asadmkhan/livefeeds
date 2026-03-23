package data

import "livefeeds/backend/models"

var SeedImages = []models.Image{

	{
		ID: "16", Title: "Sea View",
		URL:  "https://picsum.photos/id/16/800/450",
		Tags: []string{"nature", "water", "ocean", "mountains"},
	},
	{
		ID: "20", Title: "Workspace",
		URL:  "https://picsum.photos/id/20/800/450",
		Tags: []string{"stationary", "work"},
	},
	{
		ID: "84", Title: "City Bridge",
		URL:  "https://picsum.photos/id/84/800/450",
		Tags: []string{"bridge", "city", "sky"},
	},
	{
		ID: "77", Title: "Ocean View",
		URL:  "https://picsum.photos/id/77/800/450",
		Tags: []string{"ocean", "nature", "water", "travel"},
	},
	{
		ID: "110", Title: "Village View",
		URL:  "https://picsum.photos/id/110/800/450",
		Tags: []string{"nature", "village", "fields"},
	},
}

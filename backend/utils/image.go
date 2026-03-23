package utils

import (
	"image"
	"image/jpeg"
	_ "image/png"
	"os"

	"livefeeds/backend/config"

	"golang.org/x/image/draw"
)

func NormalizeImage(filePath string) error {

	imgFile, fileErr := os.Open(filePath)
	if fileErr != nil {
		return fileErr
	}

	src, _, decodeErr := image.Decode(imgFile)
	imgFile.Close()
	if decodeErr != nil {
		return decodeErr
	}

	bounds := src.Bounds()
	if bounds.Dx() <= config.ImageMaxWidth {
		return nil
	}

	ratio := float64(config.ImageMaxWidth) / float64(bounds.Dx())
	newHeight := int(float64(bounds.Dy()) * ratio)

	dst := image.NewRGBA(image.Rect(0, 0, config.ImageMaxWidth, newHeight))
	draw.BiLinear.Scale(dst, dst.Bounds(), src, src.Bounds(), draw.Over, nil)

	outFile, outErr := os.Create(filePath)
	if outErr != nil {
		return outErr
	}
	defer outFile.Close()

	return jpeg.Encode(outFile, dst, &jpeg.Options{Quality: 85})
}

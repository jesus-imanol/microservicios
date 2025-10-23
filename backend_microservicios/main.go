package main

import (
	"backend_microservicios/src/post_couples/infrastructure/adapters"
	"backend_microservicios/src/post_couples/infrastructure/dependencies"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	r := gin.Default()

	// Configuración de CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Authorization"},
		MaxAge:           12 * time.Hour,
	}))

	ps, err := adapters.NewMySQL()
	if err != nil {
		panic(err)
	}
	dependencies.InitPostCouplesDependencies(ps, r)

	if err := r.Run(":3000"); err != nil {
		panic(err)
	}
}

package main

import (
	"log"
	"tms-vrp-engine/internal/handlers"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	api := r.Group("/api/v1")
	{
		api.POST("/optimize", handlers.RunVRPOptimization)
		api.GET("/ws", handlers.WebsocketHandler)
	}

	log.Println("Starting TMS Engine Backend on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}

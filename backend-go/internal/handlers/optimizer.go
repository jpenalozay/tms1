package handlers

import (
	"encoding/json"
	"net/http"
	"io"

	"github.com/gin-gonic/gin"
	"github.com/streadway/amqp"
)

// RunVRPOptimization initiates the asynchronous Vehicle Routing Problem solving via RabbitMQ.
func RunVRPOptimization(c *gin.Context) {
	// Extract tenant info from JWT middleware (simulated)
	tenantID := "tenant-123"

	// Parse incoming payload (orders & vehicles constraints)
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// 1. Connect to RabbitMQ
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to message queue"})
		return
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open a channel"})
		return
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"vrp_optimization_tasks", // name
		true,                     // durable
		false,                    // delete when unused
		false,                    // exclusive
		false,                    // no-wait
		nil,                      // arguments
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to declare a queue"})
		return
	}

	// 2. Wrap payload with Metadata
	taskPayload := map[string]interface{}{
		"tenantId": tenantID,
		"params":   string(body),
	}
	
	taskBytes, _ := json.Marshal(taskPayload)

	// 3. Publish to queue for C++/Python worker to consume
	err = ch.Publish(
		"",     // exchange
		q.Name, // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        taskBytes,
		})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to publish a message"})
		return
	}

	// 4. Return HTTP 202 Accepted instant response (Async processing)
	c.JSON(http.StatusAccepted, gin.H{
		"status": "Accepted",
		"message": "Optimization started successfully. Listen to WebSocket/SSE for the results.",
		"jobId": "job-async-789",
	})
}

// WebsocketHandler simulates the SSE/WebSocket endpoint to notify the frontend when VRP completes.
func WebsocketHandler(c *gin.Context) {
	// Upgrade logic would go here.
	// For simulation: wait for RabbitMQ callback from Python/C++ Microservice, 
	// parse solution -> construct Polylines -> Write JSON message to client.
}

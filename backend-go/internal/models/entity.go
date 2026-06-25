package models

import (
	"time"
	"gorm.io/gorm"
)

// Depot represents a distribution center.
type Depot struct {
	gorm.Model
	TenantID    string `gorm:"index;not null"`
	Name        string `gorm:"type:varchar(100);not null"`
	Address     string `gorm:"type:text;not null"`
	Lat         float64 `gorm:"not null"`
	Lng         float64 `gorm:"not null"`
	WindowStart string `gorm:"type:varchar(5)"` // HH:MM
	WindowEnd   string `gorm:"type:varchar(5)"` // HH:MM
}

// Vehicle represents the physical fleet.
type Vehicle struct {
	gorm.Model
	TenantID           string `gorm:"index;not null"`
	DepotID            uint   `gorm:"index;not null"`
	Plate              string `gorm:"type:varchar(20);uniqueIndex:idx_tenant_plate"`
	Type               string `gorm:"type:varchar(50)"`
	MaxWeightKg        float64
	MaxVolumeM3        float64
	FuelEfficiencyKmPl float64
	CostPerKm          float64
	FixedCostDaily     float64
	Status             string `gorm:"type:varchar(20);default:'OK'"`
	Tags               string `gorm:"type:text"` // JSON Array representation
}

// Driver represents mobile operators.
type Driver struct {
	gorm.Model
	TenantID      string `gorm:"index;not null"`
	VehicleID     *uint  `gorm:"index"`
	DNI           string `gorm:"type:varchar(20);uniqueIndex"`
	FullName      string `gorm:"type:varchar(100);not null"`
	Phone         string `gorm:"type:varchar(20)"`
	PINHash       string `gorm:"type:varchar(255)"`
	LicenseNumber string `gorm:"type:varchar(50)"`
	LicenseExpiry time.Time
	Status        string `gorm:"type:varchar(20);default:'Available'"`
}

// Route represents AI-generated travel plans.
type Route struct {
	gorm.Model
	TenantID         string `gorm:"index;not null"`
	VehicleID        uint   `gorm:"index;not null"`
	DriverID         uint   `gorm:"index;not null"`
	ScheduledDate    time.Time
	EstimatedDistKm  float64
	EstimatedTimeMin float64
	Status           string `gorm:"type:varchar(20);default:'Draft'"`
	Orders           []Order `gorm:"foreignKey:RouteID"`
}

// Order represents atomic logistic missions.
type Order struct {
	gorm.Model
	TenantID                string `gorm:"index;not null"`
	RouteID                 *uint  `gorm:"index"`
	TrackingCode            string `gorm:"type:varchar(50);uniqueIndex"`
	CustomerName            string `gorm:"type:varchar(100)"`
	CustomerPhone           string `gorm:"type:varchar(20)"`
	OriginLat               *float64
	OriginLng               *float64
	DestLat                 float64 `gorm:"not null"`
	DestLng                 float64 `gorm:"not null"`
	WeightKg                float64
	VolumeM3                float64
	EstimatedServiceTimeMin float64
	WindowStart             string `gorm:"type:varchar(5)"`
	WindowEnd               string `gorm:"type:varchar(5)"`
	Tags                    string `gorm:"type:text"` // JSON Array
	RouteSequence           int
	Status                  string `gorm:"type:varchar(20);default:'Pending'"`
	Priority                int    `gorm:"default:3"`
	PoDSignatureS3URL       *string
	PoDPhotoS3URL           *string
	RejectionReason         *string
}

// AuditLog for Event Sourcing implementations.
type AuditLog struct {
	gorm.Model
	TenantID   string `gorm:"index;not null"`
	UserID     string `gorm:"index;not null"`
	EntityName string
	EntityID   uint
	Action     string
	OldState   string `gorm:"type:jsonb"`
	NewState   string `gorm:"type:jsonb"`
}

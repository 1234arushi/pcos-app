package model

import "time"

// users are doctors
type User struct {
	UserID    uint64     `json:"user_id" gorm:"column:user_id;primaryKey;autoIncrement"`
	Name      string     `json:"name" gorm:"column:name;type:varchar(255)"`
	Email     string     `json:"email" gorm:"column:email;type:varchar(255)"`
	Password  string     `json:"password" gorm:"column:password;type:varchar(255)"`
	CreatedAt *time.Time `json:"created_at,omitempty" gorm:"column:created_at;type:timestamp;default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"column:updated_at;type:timestamp;default:CURRENT_TIMESTAMP"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" gorm:"column:deleted_at;index"`
}

func (User) TableName() string {
	return "users"
}

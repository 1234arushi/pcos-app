package model

import "time"

type Patient struct {
	PatientID uint64     `json:"patient_id" gorm:"column:patient_id;primaryKey;autoIncrement"`
	Name      *string    `json:"name" gorm:"column:name;type:varchar(255)"`
	Age       *int       `json:"age" gorm:"column:age"`
	Phone     *string    `json:"phone" gorm:"column:phone;type:varchar(20)"`
	Gender    *string    `json:"gender" gorm:"column:gender;type:varchar(10)"`
	Email     *string    `json:"email" gorm:"column:email;type:varchar(255)"`
	FkUserID  *uint64    `json:"fk_user_id" gorm:"column:fk_user_id"`
	UserObj   *User      `json:"-" gorm:"foreignKey:FkUserID;references:UserID"`
	CreatedAt *time.Time `json:"created_at,omitempty" gorm:"column:created_at;type:timestamp;default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"column:updated_at;type:timestamp;default:CURRENT_TIMESTAMP"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" gorm:"column:deleted_at;index"`
}

func (Patient) TableName() string {
	return "patients"
}

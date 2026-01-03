package model

import (
	"time"

	"gorm.io/datatypes"
)

type PcosAnalysis struct {
	ID          uint64         `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	FkPatientID *uint64        `json:"fk_patient_id" gorm:"column:fk_patient_id"`
	RiskLabel   *string        `json:"risk_label" gorm:"column:risk_label;type:varchar(30)"`
	InputJson   datatypes.JSON `json:"input_json" gorm:"column:input_json;type:jsonb"`
	Probability *float64       `json:"probability" gorm:"column:probability"`
	FkUserID    *uint64        `json:"fk_user_id" gorm:"column:fk_user_id"`
	UserObj     *User          `json:"-" gorm:"foreignKey:FkUserID;references:UserID"`
	//PatientObj  *Patient       `json:"-" gorm:"foreignKey:FkPatientID;references:PatientID"`
	CreatedAt *time.Time `json:"created_at,omitempty" gorm:"column:created_at;type:timestamp;default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"column:updated_at;type:timestamp;default:CURRENT_TIMESTAMP"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" gorm:"column:deleted_at;index"`
}

func (PcosAnalysis) TableName() string {
	return "pcos_analysis"
}

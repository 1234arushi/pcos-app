package process

type PatientRequest struct {
	PatientID uint64  `json:"patient_id"`
	Name      *string `json:"name"`
	Age       *int    `json:"age"`
	Phone     *string `json:"phone"`
	Gender    *string `json:"gender"`
	Email     *string `json:"email"`
}

type ListPatientReq struct {
	UserID uint64 `json:"user_id"`
}

package process

type PatientRequest struct {
	Name     *string `json:"name"`
	Age      *int    `json:"age"`
	Phone    *string `json:"phone"`
	Gender   *string `json:"gender"`
	Email    *string `json:"email"`
	FkUserID uint64  `json:"fk_user_id"`
}

type ListPatientReq struct {
	UserID uint64 `json:"user_id"`
}

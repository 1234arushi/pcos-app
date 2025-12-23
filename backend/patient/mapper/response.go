package mapper

type PatientResp struct {
	Name          *string  `json:"name,omitempty"`
	Age           *int     `json:"age,omitempty"`
	MenstrualDays *int     `json:"menstrual_days,omitempty"`
	Weight        *float64 `json:"weight,omitempty"`
	Waist         *float64 `json:"waist,omitempty"`
	BMI           *float64 `json:"bmi,omitempty"`
	SkinDarkening *int     `json:"skin_darkening,omitempty"`
	HairGrowth    *int     `json:"hair_growth,omitempty"`
	WeightGain    *int     `json:"weight_gain,omitempty"`
	CycleType     *int     `json:"cycle_type,omitempty"`
	FastFood      *float64 `json:"fast_food,omitempty"`
	Pimples       *int     `json:"pimples,omitempty"`
	HairLoss      *int     `json:"hair_loss,omitempty"`
	MarriageYears *float64 `json:"marriage_yrs,omitempty"`
}

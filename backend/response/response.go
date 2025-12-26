package response

type APIResponse struct {
	Success bool        `json:"success"`
	Msg     string      `json:"msg"`
	Data    interface{} `json:"data,omitempty"` //if data is empty then it will not include in response only
}

func Success(msg string, data interface{}) APIResponse {
	return APIResponse{
		Success: true,
		Msg:     msg,
		Data:    data,
	}
}

func Failure(msg string) APIResponse {
	return APIResponse{
		Success: false,
		Msg:     msg,
	}
}

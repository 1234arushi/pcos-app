package database

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	conn *gorm.DB
)

func GetConn() *gorm.DB {
	return conn
}
func InitDB() (err error) {

	err = godotenv.Load()
	if err != nil {
		return fmt.Errorf("error loading .env file : %v", err)
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"),
		os.Getenv("DB_NAME"))
	for i := 0; i < 10; i++ {
		conn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			fmt.Println("Connected to database")
			break
		}
		fmt.Println("Database not ready yet — retrying...", i+1)
		time.Sleep(2 * time.Second)
	}
	if err != nil {
		return fmt.Errorf("could not connect to DB after retries: %v", err)
	}

	return nil

}

FROM golang:1.24
#start with a linux image that already has Go 1.22 installed

WORKDIR /app

COPY go.mod go.sum ./
#copies these files from your laptop to Docker ( ./ )
RUN go mod download
#download all go dependencies

COPY . .

RUN go build -o server
#builds your Go app and creates a binary named -> 'server'

EXPOSE 8080
# this tells docker that my app will listen on port 8080 inside container

CMD ["./server"]
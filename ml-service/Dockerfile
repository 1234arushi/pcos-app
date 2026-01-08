FROM python:3.11-slim 
# this tells the docker to start with base imsage that already
# has python 3.11 installed and slim means lighter version of python,so smaller image->faster builds + faster deployment

WORKDIR /app
#every command runs inside /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
#this installs all the libraries in txt file and it also states that don't store download cache --keep image small

COPY . .
#now we copy rest of folders and files in ml-service

EXPOSE 8005
#this application listens on port 8005

CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8005"]
#this is the command Docker runs when the container starts
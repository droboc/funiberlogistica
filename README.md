

1) backend Docker 
	

cd backendApp
docker build -t backend .
docker run -p 5000:5000 backend


	
2) frontend Docker

docker build -t frontend .
docker run -p 80:80 frontend

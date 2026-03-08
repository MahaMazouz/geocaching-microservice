pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'develop',
                url: 'https://github.com/MahaMazouz/geocaching-microservice.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t geocaching-microservice .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 9000:9000 geocaching-microservice'
            }
        }

    }
}
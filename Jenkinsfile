def lastCommitInfo = ""
def skippingText = ""
def commitContainsSkip = 0
String[] releaseBranches = ["master", "pre/rc", "develop"]

pipeline {
    agent any

    environment {
        shouldBuild = "true"
    }

    stages {

        stage('init') {
            steps {
                script {
                    lastCommitInfo = sh(script: "git log -1 --pretty=medium", returnStdout: true).trim()
                    commitContainsSkip = sh(script: "git log -1 | grep '.*\\[skip ci\\].*'", returnStatus: true)

                    if (commitContainsSkip == 0) {
                        skippingText = "Skipping commit."
                        env.shouldBuild = "false"
                        currentBuild.result = "NOT_BUILT"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { env.shouldBuild != "false" }
            }
            steps {
                sh 'docker build -t geocaching-microservice .'
            }
        }

        stage('Run Container') {
            when {
                expression { env.shouldBuild != "false" }
            }
            steps {
                sh 'docker rm -f geocaching-app || true'
                sh 'docker run -d --name geocaching-app -p 9000:9000 geocaching-microservice'
            }
        }

        stage('Git release') {
            environment {
                HOME = '.'
            }
            when {
                expression {
                    return env.shouldBuild != "false" && releaseBranches.contains(env.BRANCH_NAME)
                }
            }
            steps {
                withCredentials([string(credentialsId: 'GH_TOKEN', variable: 'GH_TOKEN')]) {
                    sh 'npm run release'
                }
            }
        }

        stage ('Releasing Docker Image'){
            when{
                expression{
                    return env.shouldBuild != "false"
                }
            }
            steps{
                script{
                    if(releaseBranches.contains(env.BRANCH_NAME)){
                        slackSend color: "#2222FF", message: "Releasing Image to DockerHub :whale:"
                        withCredentials([string(credentialsId: 'GH_TOKEN', variable: 'GH_TOKEN')]){
                            env.tag = sh (returnStdout: true, script: "make retrivetag organization=${microservice_organization} repository=${microservice_repository}")
                            sh 'make makefile deliver_image_to_dockerhub NAME="${dockerhub_organization}/${dockerhub_repository}" organization=${microservice_organization} repository=${microservice_repository}'
                        }
                        slackSend color: "good", message: "Image released \n Tag : ${env.tag}"
                    }

                }
            }
        }
    }
}
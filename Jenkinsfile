pipeline {
    agent any

    stages {

         stage('init') {
            steps{
                script{
                    lastCommitInfo = sh(script: "git log -1 --pretty=medium", returnStdout: true).trim()
                    commitContainsSkip = sh(script: "git log -1 | grep '.\\[skip ci\\].'", returnStatus: true)
                    if(commitContainsSkip == 0) {
                        skippingText = "Skipping commit."
                        env.shouldBuild = false
                        currentBuild.result = "NOT_BUILT"
                    }
                }
                }
                }



        stage('Build Docker Image') {
            steps {
                sh 'docker build -t geocaching-microservice .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker rm -f geocaching-app || true'
                sh 'docker run -d --name geocaching-app -p 9000:9000 geocaching-microservice'
            }
        }

        stage('Git release'){
            agent{
                docker {image 'timbru31/node-alpine-git'}
            }
            environment {
                 HOME = '.'
            }
            when{
                expression{
                    return env.shouldBuild != "false"
                }
            }
            steps{
                script{
                    if(releaseBranches.contains(env.BRANCH_NAME)){
                        withCredentials([string(credentialsId: 'GH_TOKEN', variable: 'GH_TOKEN')]){
                            sh 'npm run release'
                        }
                    }
                }
            }
        }


    }
}
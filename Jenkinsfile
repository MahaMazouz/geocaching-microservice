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

        stage('SonarQube analysis') {
    agent {
        docker {
            image 'sonarsource/sonar-scanner-cli:4.6'
            args '-u root:root'
        }
    }
    when {
        expression {
            return env.shouldBuild != "false" &&
                   env.BRANCH_NAME != 'master' &&
                   env.BRANCH_NAME != 'pre/rc'
        }
    }
    steps {
        withSonarQubeEnv('SonarQube') {
            sh 'sonar-scanner'
        }
    }
}

        stage('Quality gate') {
            when {
                expression {
                    return env.shouldBuild != "false" &&
                           env.BRANCH_NAME != 'master' &&
                           env.BRANCH_NAME != 'pre/rc'
                }
            }
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Git release') {
            environment {
                HOME = '.'
            }
            when {
                expression {
                    return env.shouldBuild != "false" &&
                           releaseBranches.contains(env.BRANCH_NAME)
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GH_TOKEN')]) {
                    sh 'npm run release'
                }
            }
        }

        stage('Releasing Docker Image') {
            when {
                expression {
                    return env.shouldBuild != "false"
                }
            }
            steps {
                script {
                    if (releaseBranches.contains(env.BRANCH_NAME)) {
                        slackSend color: "#2222FF", message: "Releasing Image to DockerHub :whale:"
                        withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GH_TOKEN')]) {
                            env.tag = sh(
                                returnStdout: true,
                                script: "make retrivetag organization=${microservice_organization} repository=${microservice_repository}"
                            ).trim()

                            sh 'make makefile deliver_image_to_dockerhub NAME="${dockerhub_organization}/${dockerhub_repository}" organization=${microservice_organization} repository=${microservice_repository}'
                        }
                        slackSend color: "good", message: "Image released \\n Tag : ${env.tag}"
                    }
                }
            }
        }
    }
}


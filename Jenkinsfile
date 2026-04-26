pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE_BACKEND = "mohitkumarsuthar/shopping-backend"
        DOCKER_IMAGE_FRONTEND = "mohitkumarsuthar/shopping-frontend"
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        
        stage('Git Checkout') {
            steps {
                git branch: 'main',
                credentialsId: 'github-cred',
                url: 'https://github.com/mohitkumarsuthar/shopping-App-deployment-architechture.git'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=shopping-app \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://10.1.0.41:9000
                    '''
                }
            }
        }
        
        stage('Docker Build Backend') {
            steps {
                sh '''
                    cd your_own_shopping_store/Backend
                    docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} .
                '''
            }
        }
        
        stage('Docker Build Frontend') {
            steps {
                sh '''
                    cd your_own_shopping_store/Frontend
                    docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} .
                '''
            }
        }
        
        stage('Trivy Scan Backend') {
            steps {
                sh 'trivy image ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}'
            }
        }
        
        stage('Trivy Scan Frontend') {
            steps {
                sh 'trivy image ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}'
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
                        docker push ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                        docker push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                    '''
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                sh '''
                    # Backend
                    docker stop shopping-backend || true
                    docker rm shopping-backend || true
                    docker run -d \
                        --name shopping-backend \
                        -p 5000:5000 \
                        ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                    
                    # Frontend
                    docker stop shopping-frontend || true
                    docker rm shopping-frontend || true
                    docker run -d \
                        --name shopping-frontend \
                        -p 80:80 \
                        ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline Successful! App is Live!'
        }
        failure {
            echo '❌ Pipeline Failed!'
        }
    }
}

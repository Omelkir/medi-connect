pipeline {
    agent { label 'agentjenkins' }
    
    // Ajout d'un paramètre pour contrôler l'exécution de l'analyse SonarQube +
    parameters {
        booleanParam(
            name: 'RUN_SONAR_SCAN', 
            defaultValue: false, 
            description: 'Exécuter l’analyse SonarQube ?'
        )
    }
    
    environment {
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner' // Outil défini dans Jenkins
        SONAR_HOST_URL = 'http://jenkins.frequencem.com:9000/' // URL du serveur SonarQube
        //SONAR_TOKEN = credentials('sonar-token') // Jeton stocké dans Jenkins
        SONAR_TOKEN = 'sqa_3810b08a587e0497010293bbafa7729395aa7f3a'
    }
    
    options {
        skipDefaultCheckout(true)
    }
    
    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }
        
        // Le stage SonarQube Analysis s'exécute uniquement si le paramètre RUN_SONAR_SCAN est à true.
        stage('SonarQube Analysis') {
            when {
                expression { params.RUN_SONAR_SCAN }
            }
            steps {
                script {
                    withSonarQubeEnv('SonarQube') { // Assure-toi que ce nom est bien défini dans Jenkins
                        sh 'docker run --rm -e SONAR_TOKEN="${SONAR_TOKEN}" -v "$(pwd):/usr/src" sonarsource/sonar-scanner-cli'
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'cp /home/.config/MediConnect/.env .'
                    sh 'docker build -t frequencesantec/MediConnect:latest .'
                }
            }
        }
        
        stage('PUSH DOCKER IMAGE') {
            steps {
                echo '🔧 Building the Docker image...'
                script {
                    sh 'docker login'
                    sh 'docker push frequencesantec/MediConnect:${Version}'
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                echo '🚀 Running the Docker container...'
                script {     
                    sh 'docker stack deploy -c docker-compose.yml DEV-MediConnect'
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}

void checkoutRepository(String branch, String repository, String credentials) {
    checkout([
        $class: 'GitSCM',
        branches: [[name: "*/${branch}"]],
        doGenerateSubmoduleConfigurations: false,
        extensions: [[$class: 'RelativeTargetDirectory',
        relativeTargetDir: "${repository}"]],
        userRemoteConfigs: [[
        url: "git@github.com:JumiaMDS/${repository}.git",
        credentialsId:"${credentials}"
        ]]
    ])
}

void getCommitHash(String repository) {
    env.COMMIT_HASH = sh (
        script: "cd ${repository} && git rev-parse --short HEAD",
        returnStdout: true
    ).trim()
    echo "Commit hash is ${env.COMMIT_HASH}"
}

void kubernetesDeploy(String project, String env, String application, String chart) {
    echo 'Checking out charts...'
    checkoutRepository('master', 'charts', '11c90820-6b3c-4bc5-aab3-67f8b550f30b')

    echo "Deploying ${project} in ${env}..."
    getCommitHash(application)
    sh "cd charts && helm upgrade --install ${env}-${project}-${application} ${chart} --values=values/${env}-${project}-${application}.yaml --set image.tag=${env}-$COMMIT_HASH"
}

node {
    stage('Build') {
        if (action in ["BuildAndDeployStaging"]) {
            echo 'Checking out One configuration...'
            checkoutRepository('staging', 'configsone', '3ac58edd-bba3-47b2-9f7b-87eafd5c458c')

            echo 'Checking out Niobe lastest code...'
            checkoutRepository('master', 'niobe', 'b08cddab-b668-416c-a65a-7141fe0d4d7b')

            echo 'Load staging One configuration...'
            sh 'cp -f configsone/niobe.json niobe/parameters.json'

            echo 'Building...'
            getCommitHash('niobe')
            dir('niobe') {
                sh 'npm install'
                sh 'bower install'
                sh 'gulp'
                sh 'polymer build'
                sh 'gulp revision'
                sh 'docker build -t niobe . -f Dockerfile'
            }
            sh "docker tag niobe:latest 151812620214.dkr.ecr.eu-west-1.amazonaws.com/niobe:staging-${env.COMMIT_HASH}"
            sh '$(aws ecr get-login --no-include-email --region eu-west-1)'
            sh "docker push 151812620214.dkr.ecr.eu-west-1.amazonaws.com/niobe:staging-${env.COMMIT_HASH}"

            echo 'Deploying One in staging...'
            kubernetesDeploy('one', 'staging', 'niobe', 'nginx')
        }
    }
}

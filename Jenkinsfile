@Library('jenkins')
import jumia.mds.util.Jenkins

def tools = new jumia.mds.util.Jenkins()

node {
    stage('Staging') {
        if (action in ["BuildAndDeployStaging"]) {
            echo 'Checking out Niobe lastest code...'
            tools.checkoutRepository('development', 'niobe', 'b08cddab-b668-416c-a65a-7141fe0d4d7b')

            echo 'Checking out One configuration...'
            tools.checkoutRepository('staging', 'configsone', '3ac58edd-bba3-47b2-9f7b-87eafd5c458c')

            echo 'Checking out charts...'
            tools.checkoutRepository('master', 'charts', '11c90820-6b3c-4bc5-aab3-67f8b550f30b')

            echo 'Load staging One configuration...'
            sh 'cp -f configsone/niobe.json niobe/parameters.json'
            sh 'cp -f configsone/niobe.json charts/nginx/parameters.json'

            echo 'Building...'
            buildTag = tools.getCommitHash('niobe')
            dir('niobe') {
                sh 'npm install'
                sh 'bower install'
                sh 'gulp'
                sh 'polymer build'
                sh 'gulp update-cache-version'
                sh 'gulp revision'
                sh 'docker build -t niobe . -f Dockerfile'
            }
            tools.pushImageToECR('niobe', buildTag, 'staging-')

            echo 'Deploying One in staging...'
            tools.kubernetesDeploy('one', 'staging', 'niobe', 'nginx', 'staging-' + buildTag)

            echo 'Cleaning...'
            sh 'rm -f niobe/parameters.json'
            sh 'rm -f charts/nginx/parameters.json'
        }
    }

    stage('Production') {
        if (action in ["BuildAndDeployProduction"]) {
            echo 'Checking out Niobe lastest code...'
            tools.checkoutRepository('development', 'niobe', 'b08cddab-b668-416c-a65a-7141fe0d4d7b')

            echo 'Checking out One configuration...'
            tools.checkoutRepository('production', 'configsone', '3ac58edd-bba3-47b2-9f7b-87eafd5c458c')

            echo 'Checking out charts...'
            tools.checkoutRepository('master', 'charts', '11c90820-6b3c-4bc5-aab3-67f8b550f30b')

            echo 'Load production One configuration...'
            sh 'cp -f configsone/niobe.json niobe/parameters.json'
            sh 'cp -f configsone/niobe.json charts/nginx/parameters.json'

            echo 'Building...'
            buildTag = tools.getCommitHash('niobe')
            dir('niobe') {
                sh 'npm install'
                sh 'bower install'
                sh 'gulp'
                sh 'polymer build'
                sh 'gulp update-cache-version'
                sh 'gulp revision'
                sh 'docker build -t niobe . -f Dockerfile'
            }
            tools.pushImageToECR('niobe', buildTag, 'production-')

            echo 'Deploying One in production...'
            tools.kubernetesDeploy('one', 'production', 'niobe', 'nginx', 'production-' + buildTag)

            echo 'Cleaning...'
            sh 'rm -f niobe/parameters.json'
            sh 'rm -f charts/nginx/parameters.json'
        }
    }
}

@NonCPS
def showChangeLogs() {
  def changeLogSets = currentBuild.rawBuild.changeSets
  def committerBuf = new StringBuilder()
  def filesBuf  = new StringBuilder()
  def filesArry = []
  echo "changeLogSets.size() = ${ changeLogSets.size() }"
  for (changeLogSet in changeLogSets) {
    for (entry in changeLogSet.items) {
      committerBuf.append "${ entry.comment.replaceAll(/\n/, ' ') } ${entry.author}\n"
      for (file in new ArrayList(entry.affectedFiles)) {
        filesBuf.append "  ${file.editType.name} ${file.path}"
        filesArry << "${file.path}".toString()
      }
    }
  }
  return ['committer':committerBuf.toString(), 'fileStatus':filesBuf.toString(), 'files': filesArry]
}
@NonCPS
def checkFileUpdate(def changeLogs, def checkFiles) {
  def filesBuf = new StringBuilder()
  for(log in changeLogs['files']) {
    if (checkFiles.contains(log)) {
      filesBuf.append("${ log }\n")
    }
  }
  return filesBuf.toString()
}
node {
  // プッシュ対象のブランチに合わせてenv.PROFILEを設定
  if (env.PROFILE == null) {
    switch(env.BRANCH_NAME) {
      // TODO mater-devopsは不要になったら削除
      case 'master-devops':
        if (!env.PROFILE) {
          env.PROFILE = 'dev'
        }
        // masterは納品物なのでワークスペースを完全にクリアする
        deleteDir()
        sh 'ls -la'
        break
      case 'master':
        if (!env.PROFILE) {
          env.PROFILE = 'dev'
        }
        // masterは納品物なのでワークスペースを完全にクリアする
        deleteDir()
        sh 'ls -la'
        break
      default:
        env.PROFILE = 'sub'
        break
    }
  }
  // ********************* Checkout Stage *********************
  stage('Checkout') {
    checkout scm
    sh 'git clean -xdf'
    sh 'git reset --hard'
  }
  def BUILD_CONF = readYaml(file: 'buildconf.yml')
  // NEXUSのURLを指定。ADOPはFQDN以降の、末尾が"/jenkins","/nexus"との違いがあり、置換する
  NEXUS_UPLOAD_URL_FORMAT = "${JENKINS_URL}#nexus-search;checksum~".replaceFirst("jenkins", "nexus")
  def props = readProperties file: 'gradle.properties'
  def messageName = "${props["sysname"]}"
  def htmlName = "index.html"
  try {
    def jobEnv = [
      "JAVA_HOME=${ tool BUILD_CONF.jenkins.tool.java }",
      "PATH+GRADLE=${ tool BUILD_CONF.jenkins.tool.gradle }/bin:${ tool BUILD_CONF.jenkins.tool.java }/bin:${ tool BUILD_CONF.jenkins.tool.node }/bin"
    ]
    withEnv(jobEnv) {
      // ビルド実行環境の情報を表示する
      sh 'java -version && javac -version'
      sh 'node -v && npm -v'
    }
    // env.PROFILEに、'master'を含む場合はデプロイ対象。他はデプロイ対象外
    if (env.DEPLOY == null) {
      env.DEPLOY = 'false'
      if (['dev'].contains(env.PROFILE)) {
        env.DEPLOY = 'true'
      }
    }
    echo "BRANCH_NAME=${ env.BRANCH_NAME } PROFILE=${ env.PROFILE } DEPLOY=${ env.DEPLOY }"
    // ビルドパラメータのチェック
    if (env.PROFILE != null) {
      if (
        !(env.BRANCH_NAME.contains('feature') && env.PROFILE == 'sub') &&
        !(env.BRANCH_NAME.contains('master') &&
        (env.PROFILE == 'sub') ||(env.PROFILE == 'dev') || (env.PROFILE == 'test') || (env.PROFILE == 'staging') ||
        (env.PROFILE == 'pt') || (env.PROFILE == 'prod'))
      ) {
        def parmwarning = """\
          |BAD: ${messageName}(${env.BRANCH_NAME}:${env.PROFILE})に指定したビルドパラメータの組合せが不正です。 :imp:
          |Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})
        """.stripMargin()
        slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'danger', message: parmwarning, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: parmwarning, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        currentBuild.result = 'FAILURE'
        error "パラメータの組み合わせが不正です！"
      }
    }
    def gitlog = ''
    def changeLogs = showChangeLogs()
    if (changeLogs['committer'].length() != 0) {
      gitlog = changeLogs['committer']
    } else {
      // jenkinsのchangeLogsがゼロの場合があるのでその場合はコマンドで最終コミットを出力する
      sh 'mkdir -p build/jenkins'
      sh 'git log --no-color --first-parent -n 1 | grep -v "^Date.*" | grep -v "^commit.*" > build/jenkins/git.log'
      gitlog = readFile('build/jenkins/git.log')
    }
    def gitlabUrl = sh(returnStdout: true, script: 'git config remote.origin.url | sed -e "s/\\.git$//g"').trim()
    def commitId = sh(returnStdout: true, script: 'git log -n 1 | grep -e "^commit" | awk \'{print $2}\'').trim()
    def gitlabCommitUrl = "${ gitlabUrl }/commit/${ commitId }"
    if (!BUILD_CONF.jenkins.crosscheck.files.isEmpty()) {
      stage('CrossCheck') {
        if (BUILD_CONF.jenkins.crosscheck.profile.contains(env.PROFILE) && env.DEPLOY == 'false') {
          def updateFile = checkFileUpdate(changeLogs, BUILD_CONF.jenkins.crosscheck.files)
          if (!updateFile.isEmpty()) {
          def fileUpdateMsg = """\
            |WARN: ${ BUILD_CONF.jenkins.slack.title }(${ env.BRANCH_NAME }:${ env.PROFILE }) クロスチェック対象ファイルが更新されました。 :builderr:
            |<${ gitlabCommitUrl }|変更内容を２名以上で確認>して :sumi: を付けて下さい。
            |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
            |```
            |${ updateFile }
            |```
          """.stripMargin()
          slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'warning', message: fileUpdateMsg, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          }
        } else {
          echo 'no check.'
        }
      }
    }
    def success = """\
      |FINISH: ${ BUILD_CONF.jenkins.slack.title }(${ env.BRANCH_NAME }:${ env.PROFILE })のビルドが成功しました。:grinning:
      |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
      |```
      |${ gitlog }
      |```
    """.stripMargin()
    def deployAndBuildSuccess = """\
      |FINISH: ${ BUILD_CONF.jenkins.slack.title }(${ env.BRANCH_NAME }:${ env.PROFILE })のビルド/デプロイが成功しました。:grinning: :truck:
      |${ BUILD_CONF.jenkins.doc.releasenote } の内容を確認して下さい。
      |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
      |```
      |${ gitlog }
      |```
    """.stripMargin()
    def warning = """\
      |WARNING: ${ BUILD_CONF.jenkins.slack.title }(${ env.BRANCH_NAME }:${ env.PROFILE })のビルドが不安定です。:joy:
      |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
      |```
      |${ gitlog }
      |```
    """.stripMargin()
    def error = """\
      |BAD: ${ BUILD_CONF.jenkins.slack.title }(${ env.BRANCH_NAME }:${ env.PROFILE })のビルドが失敗しました。 :builderr:
      |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
      |```
      |${ gitlog }
      |```
    """.stripMargin()
    def deployError = """\
      |BAD: ${ BUILD_CONF.jenkins.slack.title }(${ env.BRANCH_NAME }:${ env.PROFILE })のデプロイが失敗しました。 :builderr:
      |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
      |```
      |${ gitlog }
      |```
    """.stripMargin()
    def publishError = """\
      |FINISH: ${ BUILD_CONF.jenkins.slack.title }(${env.BRANCH_NAME}:${env.PROFILE})のパブリッシュが失敗しました。:imp:
      |Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})
      |```
      |${gitlog}
      |```
    """.stripMargin()
    // ********************* Build Stage *********************
    stage("Build") {
      try {
        withEnv(jobEnv) {
          wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
            sh BUILD_CONF.jenkins.action.chmodgradlew.command
            sh BUILD_CONF.jenkins.action.build.command
          }
          archiveArtifacts artifacts: BUILD_CONF.jenkins.artifacts.filesSHA1, fingerprint: true
        }
      } catch (Exception ex) {
        slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'danger', message: error, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: error, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        currentBuild.result = 'FAILURE'
        throw ex
      }
    }
    // デプロイフラグ無しで、subの場合
    // ********************* UnitTest Stage *********************
    if (env.PROFILE == 'sub' && env.DEPLOY == 'false' && BUILD_CONF.jenkins.action.test.active) {
      try {
        stage('UnitTest') {
          withEnv(jobEnv) {
            wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
              sh BUILD_CONF.jenkins.action.test.command
            }
          }
        }
      } catch (Exception ex) {
        slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'danger', message: error, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: error, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        currentBuild.result = 'FAILURE'
        throw ex
      } finally {
        junit allowEmptyResults: true, testResults: '**/build/test-results/test/*.xml'
      }
    }
    // subで、featureブランチの場合
    // ********************* CodeAnalysis Stage *********************
    if (env.PROFILE == 'sub' && env.BRANCH_NAME.contains('feature')) {
      stage('CodeAnalysis') {
        // CRLFチェック
        try {
          sh 'mkdir -p build'
          sh 'find . -type d \\( -name "build" -o -name ".git" -o -name ".gradle" -o -name "node_modules" \\) -prune -o \
              -type f -name "*" ! -name "*.bat" ! -name "*.MF" ! -name "*.SF" \
              | xargs nkf --guess | grep "(CRLF)" > build/crlfcheck.txt'
          archiveArtifacts artifacts: 'build/crlfcheck.txt', fingerprint: true
        } catch (Exception ex) {
          sh "cat build/crlfcheck.txt"
          echo 'ファイルにCRLFが含まれていません'
        }
        def crlfcheck = readFile('build/crlfcheck.txt')
        if (crlfcheck.length() != 0) {
          currentBuild.result = 'UNSTABLE'
          echo 'ファイルにCRLFが含まれています！'
          echo crlfcheck
          def crlfwarning = """\
            |BAD: ${ BUILD_CONF.jenkins.slack.title }(${ env.BRANCH_NAME }:${ env.PROFILE })に改行コードCRLFが含まれています。 :builderr:
            |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
            |```
            |${ crlfcheck }
            |```
          """.stripMargin()
          slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: crlfwarning, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        }
        // BOMチェック
        try {
          sh 'find . -type d \\( -name "build" -o -name ".git" -o -name ".gradle" -o -name "node_modules" \\) -prune -o \
            -type f -name "*" ! -name "*.bat" ! -name "*.MF" ! -name "*.SF" \
            | xargs nkf --guess | grep "UTF-8 (BOM)" > build/bomCheck.txt'
          archiveArtifacts artifacts: 'build/bomCheck.txt', fingerprint: true
        } catch (Exception ex) {
          sh "cat build/bomCheck.txt"
          echo 'ファイルにUTF-8 (BOM)が含まれていません'
        }
        def bomCheck = readFile('build/bomCheck.txt')
        if (bomCheck.length() != 0) {
          currentBuild.result = 'UNSTABLE'
          echo 'ファイルにUTF-8 (BOM)が含まれています！'
          echo bomCheck
          def bomwarning = """\
            |BAD: ${ BUILD_CONF.jenkins.slack.title }(${ env.BRANCH_NAME }:${ env.PROFILE })に改行コード（UTF-8 (BOM)）が含まれています。 :imp:
            |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
            |```
            |${ bomCheck }
            |```
          """.stripMargin()
          slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: bomwarning, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        }
        // キャレットチェック
        if (BUILD_CONF.jenkins.action.left_most.active) {
          try {
            sh 'find . -type d -name "node_modules" -prune -o -type f -name "package.json" | xargs cat | grep -E "\\"\\^[0-9]*\\.[0-9]*\\.[0-9]*\\"" > build/leftmost.txt'
            archiveArtifacts artifacts: 'build/leftmost.txt', fingerprint: true
          } catch (Exception ex) {
            echo 'キャレット表記は含まれてません'
          }
          def leftmost = readFile('build/leftmost.txt')
          if (leftmost.length() != 0) {
            currentBuild.result = 'UNSTABLE'
            echo 'package.jsonにキャレット表記が含まれています！'
            echo leftmost
            def leftmostwarning = """\
              |BAD: ${ messageName }(${ env.BRANCH_NAME }:${ env.PROFILE })にpackage.jsonにセマンティックバージョニング(キャレット表記)が含まれています。 :builderr:
              |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
              |```
              |${leftmost}
              |```
            """.stripMargin()
            slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: leftmostwarning, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          }
        }
        // S-JISチェック
        try {
          sh 'find . -type d \\( -name "build" -o -name ".git" -o -name ".gradle" -o -name "node_modules" \\) -prune -o \
            -type f -name "*" ! -name "*.bat" ! -name "*.MF" ! -name "*.SF" \
            | xargs nkf --guess | grep "Shift_JIS" > build/sjischeck.txt'
          archiveArtifacts artifacts: 'build/sjischeck.txt', fingerprint: true
        } catch (Exception ex) {
          // grepでヒットしなければリターンコード１として、例外処理を実行
          sh "cat build/sjischeck.txt"
          echo 'ファイルにShift_JISが含まれていません'
        }
        def sjischeck = readFile('build/sjischeck.txt')
        if (sjischeck.length() != 0) {
          currentBuild.result = 'UNSTABLE'
          echo 'ファイルにShift_JISが含まれています！'
          echo sjischeck
          def sjiswarning = """\
            |BAD: ${messageName}(${env.BRANCH_NAME}:${env.PROFILE})に改行コード（Shift_JIS）が含まれています。 :imp:
            |Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})
            |```
            |${sjischeck}
            |```
            """.stripMargin()
          slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: sjiswarning, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        }
        if (BUILD_CONF.jenkins.action.report.active) {
          step([$class: 'CheckStylePublisher',
            pattern: '**/build/reports/checkstyle/*.xml',
            unstableTotalAll: '0',
            usePreviousBuildAsReference: true])
          step([$class: 'FindBugsPublisher',
            canComputeNew: false,
            unstableTotalAll: '0',
            defaultEncoding: '',
            excludePattern: '', healthy: '',
            includePattern: '', pattern: '**/build/reports/findbugs/*.xml', unHealthy: ''])
        }
        // SonarQube
        if (['sub'].contains(env.PROFILE) && BUILD_CONF.jenkins.action.sonar.active) {
          withEnv(jobEnv) {
            sh BUILD_CONF.jenkins.action.sonar.command
          }
        }
      }
    }
    // ********************* Publish, Deploy Stage *********************
    // nexusへのアップロード先URLを通知するメッセージ
    def sha1Code = readFile("${WORKSPACE}/" + BUILD_CONF.jenkins.artifacts.base + "/${props['pomArtifactId']}_${props['pomVersion']}_${env.PROFILE}.${props['extension']}.SHA-1")
    nexusUrl = String.format('nexusにアップロードしているビルド生成物のURL\n%1s%2s', NEXUS_UPLOAD_URL_FORMAT, sha1Code)
    nexusMessage = "${messageName}(${env.PROFILE}) ${nexusUrl}"
    // デプロイフラグ有りで、subの場合
    if (env.PROFILE == 'sub' && env.DEPLOY == 'true') {
      stage("Publish") {
        try {
          withEnv(jobEnv) {
            wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
              sh BUILD_CONF.jenkins.action.publishSnapshot.command
            }
          }
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'good', message: nexusMessage, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        } catch (Exception ex) {
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'danger', message: publishError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: publishError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          currentBuild.result = 'FAILURE'
          throw ex
        }
      }
      stage("Deploy") {
        try {
          sh "ansible-playbook -i ./deploy/ansible/sub ./deploy/ansible/sub.yml --extra-vars \"classifier=${env.PROFILE} project_name=${props["pomArtifactId"]}\""
          webappUrl = String.format('web appのURL\n%1s', "${props["${env.PROFILE}.webapp.url"]}/${htmlName}")
          webMessage = "${messageName}(${env.PROFILE}) ${webappUrl}"
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'good', message: webMessage, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        } catch (Exception ex) {
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'danger', message: deployError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: deployError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          currentBuild.result = 'FAILURE'
          throw ex
        }
      }
    // デプロイフラグ有りで、NexusのReleasesリポジトリに登録する場合
    } else if ((env.PROFILE == 'test') || (env.PROFILE == 'staging') || (env.PROFILE == 'pt') ||
    (env.PROFILE == 'prod') && env.DEPLOY == 'true') {
      stage("Publish") {
        try {
          withEnv(jobEnv) {
            wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
              sh BUILD_CONF.jenkins.action.publishRelease.command
            }
          }
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'good', message: nexusMessage, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        } catch (Exception ex) {
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'danger', message: publishError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: publishError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          currentBuild.result = 'FAILURE'
          throw ex
        }
      }
    } else if (env.PROFILE == 'dev' && env.DEPLOY == 'true') {
      stage("Publish") {
        try {
          withEnv(jobEnv) {
            wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
              sh BUILD_CONF.jenkins.action.publishSnapshot.command
            }
          }
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'good', message: nexusMessage, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        } catch (Exception ex) {
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'danger', message: publishError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: publishError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          currentBuild.result = 'FAILURE'
          throw ex
        }
      }
      stage("Deploy") {
        try {
          sh "ansible-playbook -i ./deploy/ansible/dev ./deploy/ansible/dev.yml --extra-vars \"classifier=${env.PROFILE} project_name=${props["pomArtifactId"]}\""
          webappUrl = String.format('web appのURL\n%1s', "${props["${env.PROFILE}.webapp.url"]}/${htmlName}")
          webMessage = "${messageName}(${env.PROFILE}) ${webappUrl}"
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'good', message: webMessage, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
        } catch (Exception ex) {
          slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'danger', message: deployError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: deployError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
          currentBuild.result = 'FAILURE'
          throw ex
        }
      }
    }
    if (env.GIT_ROOT != null) {
      currentBuild.description = "${ env.GIT_ROOT }/${ env.BRANCH_NAME }/${ env.PROFILE }"
    }
    // ジョブの実行結果通知
    echo "RESULT: ${currentBuild.result}"
    echo "env.DEPLOY: ${env.DEPLOY}"
    // ジョブが不安定、または成功の場合
    if (currentBuild.result == 'UNSTABLE') {
      slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'warning', message: warning, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
      slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'warning', message: warning, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
    // ジョブのデプロイまで成功した場合
    } else if (env.DEPLOY == 'true') {
      slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'good', message: deployAndBuildSuccess, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
    // ジョブのビルドまで成功した場合
    } else {
      slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'good', message: success, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
    }
  } catch (Throwable throwable) {
    if (!['FAILURE', 'UNSTABLE'].contains(currentBuild.result)) {
      def fatalError = """\
        |FINISH: ${ BUILD_CONF.jenkins.slack.title }で致命的なエラーが発生しました。:builderr:
        |Job '${ env.JOB_NAME } [${ env.BUILD_NUMBER }]' (${ env.BUILD_URL })
      """.stripMargin()
      slackSend channel: BUILD_CONF.jenkins.slack.channel.jenkins, color: 'danger', message: fatalError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
      slackSend channel: BUILD_CONF.jenkins.slack.channel.developer, color: 'danger', message: fatalError, teamDomain: BUILD_CONF.jenkins.slack.team, tokenCredentialId: 'slack'
    }
    throw throwable
  }
}

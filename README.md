# Welcome to your CDK TypeScript project

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build`   compile typescript to js
- `npm run watch`   watch for changes and compile
- `npm run test`    perform the jest unit tests
- `cdk deploy`      deploy this stack to your default AWS account/region
- `cdk diff`        compare deployed stack with current state
- `cdk synth`       emits the synthesized CloudFormation template

## 使い方

ホストゾーン作成の兼ね合いで、全スタックを一度にデプロイできない。ホストゾーンを作るスタックと、その他スタックを別々にデプロイする。

### 手順

- ドメインを取得する
- cdk.jsonの"domain"を取得したドメインに書き換える
- ホストゾーンを作るためスタックをデプロイする

```bash
cdk deploy <cdk.jsonのappName><cdk.jsonのenv>Domain
```

- お名前.comなどでドメインを取ったなら、ネームサーバーを変更する
- スタックを全てデプロイする

```bash
cdk deploy --all
```

import { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
    useDotenv: true,
    service: 'bahdan-pantsialeyeu-cart-service',
    frameworkVersion: '3',
    plugins: [],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        profile: 'tmp',
        region: 'eu-central-1',
        iam: {
            role: {
                permissionsBoundary: 'arn:aws:iam::${aws:accountId}:policy/eo_role_boundary',
            },
        },
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    functions: {
      main: {
          handler: 'dist/src/main.handler',
          events: [
              {
                  http: {
                      method: 'ANY',
                      path: '/'
                  }
              },
              {
                  http: {
                      method: 'ANY',
                      path: '{proxy+}'
                  }
              }
          ]
      }
    },
    package: { individually: true },
};

module.exports = serverlessConfiguration;

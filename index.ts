import ec2 = require('aws-cdk-lib/aws-ec2');
import ecs = require('aws-cdk-lib/aws-ecs');
import ecs_patterns = require('aws-cdk-lib/aws-ecs-patterns');
import cdk = require('aws-cdk-lib');
//import { ImagePullPrincipalType } from 'aws-cdk-lib/aws-codebuild';
//import * as ecr from 'aws-cdk-lib/aws-ecr';
//import * as iam from '@aws-cdk/aws-iam';
import * as iam from 'aws-cdk-lib/aws-iam';
//import * as Role from 'aws-cdk-lib/aws-iam';
//import { iam, Role } from '@aws-cdk/aws-iam';
//import { Construct } from "constructs";


class BonjourFargate extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC and Fargate Cluster
    // NOTE: Limit AZs to avoid reaching resource quotas
    const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    //const ecsTaskExecutionRole = new iam.Role("ecsTaskExecutionRole");
    //const repo = ecr.Repository.fromRepositoryName(this, 'fargateimage', '459602490943.dkr.ecr.us-west-1.amazonaws.com/amazon-ecs-sample');
    //// Instantiate Fargate Service with just cluster and image
    //new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
    //  cluster,
    //  taskImageOptions: {
    //    image: ecs.EcrImage.fromEcrRepository(repo, 'latest'),
    //  },
    //});

    // Instantiate Fargate Service with just cluster and image


      const role = new iam.Role(this, 'TaskExecutionRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });
    
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'));
    

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("459602490943.dkr.ecr.us-west-1.amazonaws.com/amazon-ecs-sample:latest"),
        executionRole: role,
        taskRole: role,
      },
    });

  }
}

const app = new cdk.App();

new BonjourFargate(app, 'Bonjour');

app.synth();
// deploy.js

const { exec } = require('child_process');

// Define the environment variables
const envVariables = {
  MONGO_URL: 'mongodb://myuser:Password123!@ec2-18-222-126-152.us-east-2.compute.amazonaws.com:27017/nearshoring-test',
  JWT_SECRET: '3a4a61bf-9f5d-4b3d-9c0f-07c75d9f04c2e8f09e2b3a50e82c5d07d5a728a63b1635c2ad43d5e2294d7f0b',
  PORT: '5000',
  FRONT_END_URL: 'http://localhost:3000',
};

// Construct the command to set environment variables and run the project
const runCommand = MONGO_URL=${envVariables.MONGO_URL} JWT_SECRET=${envVariables.JWT_SECRET} PORT=${envVariables.PORT} FRONT_END_URL=${envVariables.FRONT_END_URL} npm start;

// Execute the command
exec(runCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(Error during deployment: ${error.message});
    return;
  }

  if (stderr) {
    console.error(stderr: ${stderr});
    return;
  }

  console.log(stdout: ${stdout});
});
/*
   Copyright 2010-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
   This file is licensed under the Apache License, Version 2.0 (the "License").
   You may not use this file except in compliance with the License. A copy of
   the License is located at
    http://aws.amazon.com/apache2.0/
   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied. See the License for the
   specific language governing permissions and limitations under the License.
*/

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config/aws.json');

// Create EC2 service object
var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

var params = {
  DryRun: false
};

// call EC2 to retrieve policy for selected bucket
ec2.describeInstances(params, function (err, data) {
  if (err) {
    console.log("Error", err.stack);
  } else {
    console.log("Success", JSON.stringify(data));

var param ={"key":"Name",
             "Value":"SDK Sample"
             };


    data.Reservations.forEach(function (element) {
      element.Instances.forEach(function (instance) {
        console.log(instance.Tags);
        var nameTags = instance.Tags.filter(function (tag) {
          return tag.Key==param.key && tag.Value == param.Value;
        });

        if (nameTags.length > 0) {
          console.log('instnace with tag found')
        }
        else {
          console.log(' tag not found')
        }

      })


    });

  }
});
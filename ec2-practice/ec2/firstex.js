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
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

//var params = {};
var params = {
   KeyName: 'primary-key1'
};
// Create the instance
ec2.describeKeyPairs(function(err, data) {
   if (err) {
      console.log("Error", err);
   } else {
      console.log("Success", JSON.stringify(data.KeyPairs));
      console.log('key', data.KeyPairs[0].KeyName)
     

var isFound = false;

data.KeyPairs.forEach(function(element) {
    console.log(element);
    if(element.KeyName===params.KeyName){
        isFound = true;
        return;
    }
} );

if(!isFound ){
   
ec2.createKeyPair(params, function(err, data) {
   if (err) {
      console.log("Error", err);
   } else {
      console.log(JSON.stringify(data));
   }


}); 
}else{

    console.log("key name already exisit...");
}

   /*   if(data.KeyPairs[0].KeyName  == params.KeyName){
          console.log("its already extis");
      }else{

ec2.createKeyPair(params, function(err, data) {
   if (err) {
      console.log("Error", err);
   } else {
      console.log(JSON.stringify(data));
   }


});

      
      }*/


   }
}
);

/*
if(data.KeyPairs == "amzonKP")
{
console.log("already exsit");

}*/
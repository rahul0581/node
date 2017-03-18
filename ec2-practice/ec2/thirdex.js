// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config/aws.json');

// Create EC2 service object
var ec2 = new AWS.EC2({
    apiVersion: '2016-11-15'
});

var instanceInfo = require('data/awsInstanceInfo.json')

console.log('Instance Info', instanceInfo);
console.log(instanceInfo.Tags[0].key+"  "+instanceInfo.Tags[0].Value);

/*
//JSON file object read by indiviual arrays.... 
console.log(instanceInfo.instanceName);

console.log(instanceInfo.imageCode);
console.log(instanceInfo.instanceType);
console.log(instanceInfo.SecurityGroups);
console.log(instanceInfo.SecurityGroups.groupName);

console.log(instanceInfo.SecurityGroups.IpPermissions);

console.log(instanceInfo.SecurityGroups.IpPermissions[0].IpProtocol); //tcp

console.log(instanceInfo.SecurityGroups.IpPermissions[0].FromPort); //80

console.log(instanceInfo.SecurityGroups.IpPermissions[1].FromPort);//22

console.log(instanceInfo.KeyPair);

*/

// read this to understand how arrays and function work in Nodejs
// http://book.mixu.net/node/ch5.html


//1. Check if Key Pair exists, if not create Key Pair


ec2.describeKeyPairs({
    KeyNames: [
        instanceInfo.KeyPair
    ]
}, function (err, data) {
    if (err) {
        console.log("Key Par not found", err.message);
        createKeyPair(instanceInfo.KeyPair, function (err, data) {
            if (err) {
                console.log("Create KP Error", err);
            } else {
                console.log("Key Pair Created", JSON.stringify(data.KeyPairs));
                manageSecurityGroup(instanceInfo.SecurityGroups, handleAfterSG);
                

            }

        });
    } else {

        console.log("Key Pair found", JSON.stringify(data.KeyPairs));
        manageSecurityGroup(instanceInfo.SecurityGroups, handleAfterSG);
       // mangeInstance(instanceInfo.Tags, handleAfterinst);

    }



});


function handleAfterSG(err, data) {

    if (err) {
        console.log("Error", err);
    }
    else {
        console.log('security group done');
        mangeInstance(instanceInfo.Tags, handleAfterinst);
 }

}




function manageSecurityGroup(secGroup, cb) {
    ec2.describeSecurityGroups({
        GroupNames: [
            secGroup.groupName,

        ]
    }, function (err, data) {
        if (err) {
            // console.log("Security group Error", err);

            ec2.createSecurityGroup({
                Description: secGroup.groupName,
                GroupName: secGroup.groupName,
                VpcId: secGroup.vpc
            }, function (err, data) {
                if (err) {
                    console.log("SG Create Error", err);
                    cb(err)
                } else {
                    var SecurityGroupId = data.GroupId;
                    console.log("SG Success", SecurityGroupId);
                    var paramsIngress = {
                        GroupName: 'sdk-example',
                        IpPermissions: [
                            {
                                IpProtocol: "tcp",
                                FromPort: 80,
                                ToPort: 80,
                                IpRanges: [{ "CidrIp": "0.0.0.0/0" }]
                            },
                            {
                                IpProtocol: "tcp",
                                FromPort: 22,
                                ToPort: 22,
                                IpRanges: [{ "CidrIp": "0.0.0.0/0" }]
                            }
                        ]
                    };
                    ec2.authorizeSecurityGroupIngress({
                        GroupName: secGroup.groupName,
                        IpPermissions: secGroup.IpPermissions
                    }, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                            cb(err)
                        } else {
                            console.log("Ingress Successfully Set", data);
                            cb(undefined, data)
                        }
                    });
                }
            });


        } else {
            console.log("SG found", JSON.stringify(data.SecurityGroups[0].GroupId));
            cb(undefined, data)
            //  console.log(data.SecurityGroups);
        }
    });


}
function createKeyPair(keypairName, cb) {

    ec2.createKeyPair({
        KeyName: keypairName
    }, cb);
}




function mangeInstance(ins, cb) {

    ec2.describeInstances( 
       function (err, data) {
            if (err) {
                console.log(" Describe instant Error", err.stack);
            } else {
                console.log(" Describe instant Success", JSON.stringify(data));

                var isfound = false;
 //console.log(instanceInfo.Tags[0].key + " value is "+instanceInfo.Tags[0].Value);
                   

                data.Reservations.forEach(function (element) {
                    element.Instances.forEach(function (instance) {
                      
                      // console.log(instance.Tags);
                         
                        

                  var nameTags = instance.Tags.filter(function (tag) {

                          return  tag.Key === instanceInfo.Tags[0].key && tag.Value === instanceInfo.Tags[0].Value;
                          
                 
                  });

                  //    console.log(nameTags.length);
                      if(nameTags.length>0){
                    //    console.log("instance found");
                        isfound = true;
                     // return false;
                      }else{
                    //    console.log("instance not found");
                       // return true;
                       
                      }
                    
                    })


                });

            //    console.log("after loop",isfound);
                //  creatinst(isfound);
                    //console.log(tag.key + " value "+tag.Value);
                    //console.log(instanceInfo.Tags[0].key + " value is "+instanceInfo.Tags[0].Value);
                    // console.log("after loop",nameTags.length);
                   if(!isfound ){ 
                    console.log(isfound);
                    console.log("creating new instance....");
                     creatinst(isfound);
                   }
                   else{
                     
                    console.log(isfound);
                     console.log("instance already created");
                    
                   }
        }
        });





}

function handleAfterinst(err, data) {

    if (err) {
        console.log("Error", err);
    }
    else {
        console.log('Instance  done');
    }

}






  function creatinst(isfound){
if(!isfound){
 // console.log("testing tag values of aws"+instanceInfo.Tags[0].key +instanceInfo.Tags[0].Value);
var params = {
                                ImageId: 'ami-1e299d7e', // amzn-ami-2011.09.1.x86_64-ebs
                                InstanceType: 't2.micro',
                                MinCount: 1,
                                MaxCount: 1
                            };

// Create the instance
                            ec2.runInstances(params, function (err, data) {
                                if (err) {
                                    console.log("Could not create instance", err);
                                    return;
                                }
                                var instanceId = data.Instances[0].InstanceId;
                                console.log("Created instance", instanceId);
                                // Add tags to the instance
                                params = {
                                    Resources: [instanceId], Tags: [
                                        {
                                            Key: instanceInfo.Tags[0].key,
                                            Value: instanceInfo.Tags[0].Value
                                        }
                                    ]
                                };
                                ec2.createTags(params, function (err) {
                                    console.log("Tagging instance", err ? "failure" : "success");
                                });
                            }); 






}else{

    console.log("already you have the instance");
}


  }



// 2. Check if Security Group Exists, if not create


// 3. check if instance exists, if not create it


console.log("welcome");

var name = "rahul";
var age = 33;
var marks = [12,23,42,34,53];
var movies= ["one","two","three"];
var address = {
                street: "colony",
                city:"austin",
                zipcode:123244,
                marks1:[1,2,3,5],
                addres2:{
                            stret1:"col",
                            city1:"gdaj",
                            zipcode1:2537
                        }
               }

/*
address.marks1.forEach(function(a){
console.log(a);

});
*/
/*console.log(name);
console.log("my name is "+name,"my age is",age, marks,movies,address);
console.log(marks[2]);*/
//console.log(address.addres2.zipcode1);
/*console.log(marks[0]);
console.log(marks[1]);
console.log(marks[2]);
console.log(marks[3]);
console.log(marks[4]);
*/
/*
for(var i=1;i<5;i++ ){
    
    if(i%2 == 0){
console.log(marks[i]);
    }
}
*//*
marks.forEach(function(elemnt){
    console.log(elemnt);
});
*/
console.log(address.addres2);

add(10,20,7);
add(3,4);



function add(x,y){
var sum = x+y;

console.log(sum);

}


function add(x,y,z){
var sum = x+y+z;

console.log(sum);

}
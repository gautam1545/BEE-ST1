const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/main.html");
});

app.post("/submission", function (request, response) {
    const students = require("./data");
    function makelistelement(s){
      return `
        <div>ID : ${s.id}</div>
        <div>Name : ${s.name}</div>
        <div>Address : ${s.address}</div>
        <h4 style="margin:0; padding:0; display:inline-block;">Marks : </h4>
        <div>Science: ${s.science}</div>
        <div>Maths: ${s.maths}</div>
        <div>Physics: ${s.physics}</div>
        <div>Biology: ${s.biology}</div>
        <div>Chemistry: ${s.chemistry}</div>
        <h4 style="margin:0; padding:0; display:inline-block;">Total : </h4>
        <span> ${s.total}</span><br>
        <h4 style="margin:0; padding:0; display:inline-block;">Average : </h4>
        <span> ${s.average}</span><br>
        <h4 style="margin:0; padding:0; display:inline-block;">Grade : </h4>
        <span> ${s.grade}</span>
      <br>
      <br>
      `
    }
    console.log(makelistelement(students[0]))
    var list =''
    students.forEach(e => list+= makelistelement(e))
    const display = `
    <div style="width:100vw; margin-top:5vh; margin-left:5vh;">
    ${list}
    </div>
    `
    response.send(display);
});


app.post("/posted", function (request, response) {
  const students = require("./data");
  var id = Number(request.body.ID);
  var name = request.body.NAME;
  var address = request.body.ADDRESS;

  var science = Number(request.body.s);
  var maths = Number(request.body.m);
  var physics = Number(request.body.p);
  var biology = Number(request.body.b);
  var chemistry = Number(request.body.c);

  var total = science + maths + physics + biology + chemistry;
  var average = (science + maths + physics + biology + chemistry) / 5;
  var grade;
  if (average > 90) grade = "A";
  else if (average > 75 && average < 90) grade = "B";
  else if (average > 40 && average < 75) grade = "C";
  else if (average > 33 && average < 40) grade = "D";
  else grade = "F";

  let student = {
    id: id,
    name: name,
    address: address,
    science: science,
    physics: physics,
    maths: maths,
    chemistry: chemistry,
    biology: biology,
    total: total,
    average: average,
    grade: grade,
  };
  students.push(student);
  fs.writeFile("data.json", JSON.stringify(students), (err) => {
    // Checking for errors
    if (err) throw err;
  });
  fs.readFile("data.json", function (err, data) {
    // Check for errors
    if (err) throw err;
  });
  // console.log(JSON.stringify(student));
  json = JSON.stringify(student);
  json += "\n";
  fs.appendFile("data.txt", json, function (err) {
    if (err) throw err;
  });
  response.sendFile(__dirname + "/main.html");
});
app.listen(3000);

const https = require('https');
const express = require('express');
const path = require('path');
const fs = require('fs');
const res = require('express/lib/response');
const req = require('express/lib/request');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const admin = require("firebase-admin");
const serviceAccount = require("./seairhubdriver-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
const port = 443; // 사용할 포트 번호

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(__dirname + '/js'));

app.use("*", (req, res, next) => {
  console.log("req.secure : " + req.secure);

  if(req.secure) {
    // https
    next();
  }else {
    // http
    let to = "https://" + req.header.host + req.url;
    console.log("to ==> " + to);
    return res.redirect("https://" + req.header.host + req.url);
  }
});

app.get('/', (req,res,next)=>{
  res.cookie("No", 10000001);
  res.render('index.ejs', {"num": 10000001});
});

app.post('/getTable', function(req, res){
  var data = req.cookies.No;

  var docRef = db.collection("Table").doc(String(data));

  docRef.get().then((doc) => {
      if (doc.exists) {
        //console.log("Document data:", doc.data());
        res.send({BL: doc.data().BL_num, container: doc.data().container_num});
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
});

app.post('/getDriver', function(req, res){
  var data = req.cookies.No;
  var docRef = db.collection("Driver_info").doc(String(data));

  docRef.get().then((doc) => {
      if (doc.exists) {
        //console.log("Document data:", doc.data());

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
});

app.post('/getDelivery', function(req, res){
  var data = req.cookies.No;

  var docRef = db.collection("Delivery").doc(String(data));

  docRef.get().then((doc) => {
      if (doc.exists) {
        //console.log("Document data:", doc.data());
        res.send({start: doc.data().start, dist: doc.data().dist});
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
});

app.post('/getLocation', function(req, res){
  var data = req.cookies.No;
  var docRef = db.collection("Point").doc(String(data));

  docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("Delivery:", doc.data());
        let later = parseInt(doc.data().lat);
        let loner = parseInt(doc.data().lon);

        res.send({lat: doc.data().lat, lon: doc.data().lon});
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
});

app.post('/send-location', (req, res, next) => { // 현위치 DB 저장

  db.collection('Point').doc("10000001").set({
    'lat' : req.body.lat,
    'lon' : req.body.lon
  });

  console.log("DB set : " + req.body);

  return res.status(200).json({
    isSuccess : true,
    code : 200,
    message : "Successfully sent location"
  })
});

app.post('/send-message', (req, res, next) => { // 알림 전송
  admin.messaging().send(req.body)
  .then((response) => {
    console.log('Successfully sent message : ', response)
    return res.status(200).json({
      isSuccess : true,
      code : 200,
      message : "Successfully sent message"
    })
  })
  .catch((err) => {
    console.log('Error Sending message : ', err)
    return res.status(400).json({
      isSuccess : false,
      code : 400,
      message : "Error Sending message"
    })
  });
});

const options = {
  cert: fs.readFileSync(__dirname + '/certificate.crt'),
  ca: fs.readFileSync(__dirname + '/ca_bundle.crt'),
  key: fs.readFileSync(__dirname + '/private.key')
 };

const sslServer = https.createServer(options, app);

sslServer.listen(port, () => console.log('server on'));
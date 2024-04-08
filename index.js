// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


function getTimeZoneName(offset) {
  const timeZoneMap = {
      0: 'GMT',
      60: 'CET', // Central European Time
      120: 'EET', // Eastern European Time
      180: 'MSK', // Moscow Standard Time
      240: 'GFT', // Gulf Standard Time
      300: 'AST', // Arabian Standard Time
      330: 'IRST', // Iran Standard Time
      345: 'AFT', // Afghanistan Time
      360: 'GST', // Gulf Standard Time
      390: 'IST', // Indian Standard Time
      420: 'BST', // Bangladesh Standard Time
      480: 'CST', // China Standard Time
      510: 'JST', // Japan Standard Time
      525: 'ACST', // Australian Central Standard Time
      540: 'AEST', // Australian Eastern Standard Time
      570: 'NZST', // New Zealand Standard Time
      // Add more timezone mappings as needed
  };
  return timeZoneMap[offset] || 'Unknown'; // Return timezone name or 'Unknown' if not found
}

function formatTime(utcTime){
    const day= utcTime.toLocaleString('default',{weekday:'short'});
    // const date= utcTime.toLocaleString('default',{date:'numeric' , minimumIntegerDigits:});
    const month = utcTime.toLocaleString('default', { month: 'short'});
    const hours = utcTime.getHours().toString().padStart(2, '0');
    const minutes = utcTime.getMinutes().toString().padStart(2, '0');
    const seconds = utcTime.getSeconds().toString().padStart(2, '0');
    // const hours = utcTime.toLocaleString('default', { hour:'' minimumIntegerDigits: 2});
    // const minutes = utcTime.toLocaleString('default', { minute: 'long' , minimumIntegerDigits: 2});
    // const seconds = utcTime.toLocaleString('default', { second: 'long' , minimumIntegerDigits: 2});
    const milliseconds = utcTime.getMilliseconds().toString().padStart(2, '0');
    var formattedTime= day + ", " 
                      + utcTime.getDate() + " "
                      + month+ " "
                      + utcTime.getFullYear()+ " "
                      + hours+":"
                      + minutes+":"
                      + seconds+" "
                      + milliseconds+" "
                      + getTimeZoneName(utcTime.getTimezoneOffset());
    return formattedTime;
}


app.get("/api/", function(req,res,next){
  var date = new Date();
  temp=date;
  date = formatTime(date);
  res.json({
    unix: temp.getTime(),
    utc: date
  });
  next();
});

const isInvalidDate = (date)=> date.toString() === "Invalid Date";

app.get("/api/:dateString" , function(req,res,next){
  var date = new Date(req.params.dateString);

  if(isInvalidDate(date))
  {
    date = new Date(+req.params.dateString);
  }

  if(isInvalidDate(date))
  {
    res.json({
      error: "Invalid Date"
    });
    return;
  }

  // res.json({
  //   unix: date.getTime(),
  //   utc: date.toString()
  // });
  if(!isNaN(new Date(req.params.dateString*1000))) // in other format (unix time), eg. 1451001600000
  { 
    var utcTime= new Date(req.params.dateString*1000);
    utcTime = new Date(utcTime/1000);
    const formattedTime = formatTime(utcTime);
    // const day= utcTime.toLocaleString('default',{weekday:'short'});
    // const month = utcTime.toLocaleString('default', { month: 'long'});
    // const hours = utcTime.getHours().toString().padStart(2, '0');
    // const minutes = utcTime.getMinutes().toString().padStart(2, '0');
    // const seconds = utcTime.getSeconds().toString().padStart(2, '0');
    // // const hours = utcTime.toLocaleString('default', { hour:'' minimumIntegerDigits: 2});
    // // const minutes = utcTime.toLocaleString('default', { minute: 'long' , minimumIntegerDigits: 2});
    // // const seconds = utcTime.toLocaleString('default', { second: 'long' , minimumIntegerDigits: 2});

    // var formattedTime= day + ", " 
    //                   + utcTime.getDate() + " "
    //                   + month+ " "
    //                   + utcTime.getFullYear()+ " "
    //                   + hours+":"
    //                   + minutes+":"
    //                   + seconds+" "
    //                   + getTimeZoneName(utcTime.getTimezoneOffset());
    // // var dateFormatting={
    // //   date: 'numeric',
    // //   month: 'long',
    // //   year: 'numeric',
    // //   minimumIntegerDigits: 2
    // // }
    // // utcTime = utcTime.toLocaleDateString(,dateFormatting);
    res.json({
      unix:parseInt(req.params.dateString),
      utc: formattedTime
    });
  }

  else if (!isNaN(new Date(date)))// in format YYYY-MM-DD
  {
    const unixTime=new Date(date).getTime();
    const formattedTime= formatTime(new Date(date));
    res.json({ 
      unix: unixTime,
      utc: formattedTime
    });
  }
  else
  {
    res.json({
      unix: req.params.dateString.getTime(),
      utc: req.params.dateString.toString()
    });
  }
  next();
});


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

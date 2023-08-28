require('dotenv').config();
const dns=require('dns');
const express = require('express');
const cors = require('cors');
const bodyparser=require('body-parser');
const app = express();
const shortid= require('shortid');
const url=require('url');

// Basic Configuration  https://www.yoursite.com/?/post/2021/12/08/$5982-!%20&__cf_chl_tk=5r.YBnfoIwHsj0DthxImiG_rlnqtISqbe8BsDHFacLY-1693043156-0-gaNycGzNDDs#_ref;di(@%
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let urlcount=0;
const urlDatabase={

};

app.post('/api/shorturl',function(req,res){
 
  const parsedUrl=url.parse(req.body.url);
  console.log(parsedUrl);

  if(parsedUrl.host){
  dns.lookup(parsedUrl.hostname,function(err,address,family){
    if(err){
      console.log("----in if-----")
      res.send({
        "error": "invalid url"
      });
    }else{
      
      console.log("----in else-----")
     
      urlDatabase[urlcount]=req.body.url;
      console.log(urlDatabase);
      res.send({
        "original_url": parsedUrl.href,
        "short_url": urlcount++
      });

    }
  });
}else{
  res.send({
    "error": "invalid url"
  });
}
  

});

app.get('/api/shorturl/:short',function(req,res){
  console.log(req.params.short);
  res.redirect(urlDatabase[req.params.short]);
});








app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

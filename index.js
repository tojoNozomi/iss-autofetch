//quick use for ishadowsocks.com
var sa = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');
var fetchWeb = url => new Promise((resolve,reject) => {
	sa.get(url).end((err,req)=>{
		if (err) {
			reject(err);
			console.log('err0');
		}
		console.log(0);
		resolve(req.text);
	});
});
var analyze = text =>{
	var $ = cheerio.load(text);
	var result = {};
	var resAddAttr = obj =>Object.assign(result,obj);
	var temp = $('#free').text().split('\n').filter(x=>x&&x.trim()).map(x=>x.trim()).map(x=>x.split(':')).filter(x=>x.length>1);
    resAddAttr({
    	server:temp[10][1],
    	server_port:temp[11][1],
    	password:temp[12][1],
    });
    console.log(1);
    return new Promise((resolve,reject) => resolve(result));
};
var writeConfig = configObj =>{
	var changeConfig = (json,obj) =>{
    	json.configs[0].server = String(obj.server);
    	json.configs[0].server_port = Number(obj.server_port);
    	json.configs[0].password = String(obj.password);   
    	return JSON.stringify(json);
	};
	var config = require('./gui-config.json');
	fs.writeFile('./gui-config.json',changeConfig(config,configObj),(err)=>{
		if (err) {console.log('err1')};
	});
};

fetchWeb('http://www.ishadowsocks.com/').then(analyze)
.then(writeConfig)
.catch((err)=>{
	console.log('err2');
});

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
var fs = require('fs');
const { PassThrough } = require('stream');
const request = require('request');
const { html } = require('cheerio/lib/api/manipulation');
const { callbackify } = require('util');


collegeID = [];


function save(saveData, newLine = false) {
    var stream = fs.createWriteStream("savesss.txt", {flags: 'a'});
    stream.once('open', function(fd) {
    if(newLine != false) {
        stream.write("'" + saveData + "', ");
        stream.end();
    }
    else {
        if(saveData == "0") {

        }
        else {
            stream.write("'" + saveData + "', ");
            stream.end();
        }
        
    }
    
});
}

function getCollegeID(collegeID = []) {
    request({
        method: 'GET',
        url: 'https://www.perfectgame.org/College/CollegeCommitments.aspx?Grad=2022&college=1756'
    }, (err, res, body) => {
    
        if (err) return console.error(err);
    
        let $ = cheerio.load(body);

        $('#ContentTopLevel_ContentPlaceHolder1_ddlColleges').find('option').each((i,op) => {
            collegeID.push($(op).attr('value'));
            save($(op).attr('value'));
        })
        collegeID.shift();
        
        console.log(collegeID);
        
        return collegeID;
        
    });
    return;
}

getCollegeID(collegeID);
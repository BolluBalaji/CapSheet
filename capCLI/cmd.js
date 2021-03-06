#!/usr/bin/env node 

const program = require('commander');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const colors = require('colors');

const baseUrl = 'http://localhost:3030/';

//sending file to the api end-point for validation using axios
const sendFileForValidation = async (filepath) => {
    let result = '{}';
    let data = new FormData();
    data.append('capsheet', fs.createReadStream(filepath));

    let config = {
        method: 'post',
        url: baseUrl,
        headers: {
          ...data.getHeaders()
        },
        data : data
      };
    

    await axios(config)
    .then(function (response) {
        result = JSON.stringify(response.data);
    })
    .catch(function (error) {
        let errMessage = "Error occured while connecting to the Server!";
        console.log("%s",colors.red(errMessage));
    });

    return JSON.parse(result);
}


//creating cli command with filepath option

//adding description and version for cli
program
    .version('1.0.0')
    .description('CapSheet Validataion')

//providing filepath option to read the file
program
    .requiredOption('-f, --file [value]', "Specify the location of CapSheet File")
    .action((args) => {
        try {
            if (fs.existsSync(args.file)) {
                console.log(`Processing the file...`);
                console.log("--------------------------------------------");
                sendFileForValidation(args.file)    //sending file to the server for validation
                .then(res => {
                    if(res.message==="Success"){
                        console.log("File Validation is: %s", colors.green(res.message));
                        console.log("--------------------------------------------");
                        for(let msg of res.data){
                            console.log("-> %s",colors.green(msg));
                        }
                    }
                    else if(res.message==="Failed"){
                        console.log("File Validation is: %s", colors.red(res.message));
                        console.log("--------------------------------------------");
                        for(let msg of res.data){
                            console.log("-> %s",colors.red(msg));
                        }
                    }
                    console.log("--------------------------------------------");
                })
            }
            else{
                console.log("FIle Doesn't Exists on specified Path!");
            }
          } catch(err) {
            console.error(err)
          }
    })

program.parse(process.argv);
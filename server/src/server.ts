import app from "./app";
import { Request, Response } from 'express';
import Person from './services/Person';
import { UploadedFile } from "express-fileupload";
import * as XLSX from 'xlsx';
import * as path from 'path';
import { isDate } from "util";


const PORT = process.env.PORT || 3030;

//validation each and every row of excel data
const validateData = (data:Person[]) => {
    let rowNumber: number = 1;
    let errMessage: string = "";
    let allErrors: Array<String> = [];
    let properties: Array<string> = ['FirstName','LastName','Profession','DOB']

    for(let row of data){
        rowNumber++;
        for(let prop of properties){
            if(!row.hasOwnProperty(prop) || !(String(row[prop as keyof Person]).length>0)){
                errMessage = `${prop} is Invalid at line ${rowNumber}`;
                allErrors.push(errMessage);
            }
            else if(prop=== 'DOB' && (!row.hasOwnProperty(prop) || !isDate(row[prop as keyof Person]))){
                errMessage = `${prop} is Invalid at line ${rowNumber}`;
                allErrors.push(errMessage);
            }
        }
    }
    let isValidFile = allErrors.length>0 ? false : true;

    return {isValidFile,allErrors}
}



//reading excel file using xlsx (sheet-js)
const readAndValidate = (fileName: string='Person.xlsx') => {
    const wb:XLSX.WorkBook = XLSX.readFile(path.join(__dirname,fileName),{cellDates:true, cellNF:false, cellText:false});
    const sheetsNames = wb.SheetNames;
    const sheet:XLSX.Sheet  = wb.Sheets[sheetsNames[0]];
    const data:Person[] = XLSX.utils.sheet_to_json(sheet,{dateNF:'DD-MM-YYYY'});
    return validateData(data);
}



//route to verify the excel data is valid or not
app.post('/', async (req: Request, res: Response) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let file: UploadedFile = req.files.capsheet;
            await file.mv(__dirname+'/'+file.name);
            let isValid = readAndValidate(file.name);
            
            if(isValid.isValidFile){
                res.status(200).send({
                    message: "Success",
                    data: Array("File is valid and uploaded successfully")
                })
            }
            else{
                res.status(422).send({
                    message: "Failed",
                    data: isValid.allErrors
                });
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


//running the server on port: 3030 or env.port
app.listen(PORT, () => {
    console.log(`Server is running on : ${PORT}`);
})

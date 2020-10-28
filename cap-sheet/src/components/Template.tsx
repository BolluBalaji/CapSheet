import React, { useState } from 'react';
import ResponseMessages from './ResponseMessages';

const baseUrl = 'http://localhost:3030';

function CapTemplate() {

    const [isError,setError] = useState(false);
    const [messages,setMessages] = useState([]);

    //checking data is valid or not using api
    const sendFileToAPI = (formData: any) => {
        //connecting to api to validate data using fetch
        fetch(`${baseUrl}/`, {
        method: 'post',
        body: formData
        })
        .then((response) => {
        return response.json();
        })
        .then((res) => {
            setMessages(res.data);
            (res.message==="Success")?setError(false):setError(true);
        });
    }

    //reading excel file using xlsx (sheet-js)
    const sheetUpload = (file: any): void => {
      const formData = new FormData()
      formData.append('capsheet',file);
      sendFileToAPI(formData);
    }

    return (
        <>
            <div>
                <a href="../Person.xlsx"><button>Download CapSheet</button></a> { /*Downloadig sample CapTemplate */}
            </div>
            <hr />
            <form>
                {/* handling file */}
                <input type="file" name="capsheet" onChange={(event) => {
                    const file = event.target?.files?.item(0);
                    sheetUpload(file);
                }}/>
            </form>

            {/*  Displaying message after validation of file */}
            {messages.length>0 && <ResponseMessages messages={messages} isError={isError}/>}
            

        </>
    )
}

export default CapTemplate

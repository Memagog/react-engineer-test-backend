    const mysql = require("mysql");
    const express =require('express');
    const cors =require('cors'); 
    const pdf_make =  require('pdfmake/build/pdfmake');
    const bodyParser = require("body-parser");    
    const app = express();

    app.use(cors());
    app.use(express.json()); 
    app.use(bodyParser.urlencoded({
      extended: true
    }))   

    const PORT = process.env.PORT || 4000;

    const document = {
      content:[]
    }

    const con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "1234",
            database: "customers" 
    })

    app.post('/get', (req, res)=>{

        if(!req.body) return res.status(404).json({message: 'false'})

        const name = req.body.firstname;  

        con.query(`SELECT * FROM custom WHERE firstname=?`,[name],(err, results)=> {  

            if(err) return console.log(err)            
            else results.map((i)=>document.content.push(i.firstname,i.lastname,{image: i.image})) 

            if(document.content.length !=0){        
              const pdf = pdf_make.createPdf(document); 
              con.query(`INSERT custom (pdf) VALUES('${pdf}')`, (err, result)=>{
               if(err) return console.log(err); 
               return result;             
              })    
              res.status(400).json({message: `${true}`})                          
            } 
            else res.status(404).json({message: `${false}`})                                                  
        }); 

        con.end();     
    })

    const start = () =>{
        try {         
          con.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
          const sql = "CREATE TABLE IF NOT EXISTS custom (firstname VARCHAR(255), lastname VARCHAR(255), image MEDIUMBLOB, pdf MEDIUMBLOB)";
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created");
          });
        });
           app.listen(PORT, ()=> console.log(`Running on PORt : ${PORT}`))
        } catch (error) {
          console.log(error)
        }
    }    
    start()
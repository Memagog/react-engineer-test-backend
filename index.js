    const mysql = require("mysql");
    const express =require('express');
    const cors =require('cors'); 
    const app = express();   

    app.use(cors());
    app.use(express.json()); 
    app.get('/get', (req, res)=>{
        console.log('Hello')
    })
    const PORT = process.env.PORT || 4000;
    const start = async () =>{
        try {
          const con = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "1234",
          })
          await con.connect((err)=>{
                if(err) throw console.log(`Error is ${err}`);
                console.log(`Connection to Database`)                
          })
          await app.listen(PORT, ()=> console.log(`Running on PORt : ${PORT}`))
        } catch (error) {
          console.log(error)
        }
    }
    
    start()
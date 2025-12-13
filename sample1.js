import express from 'express'
import multer from 'multer'
import path from 'path'
import mysql from 'mysql2/promise'

const app = express()

app.use(express.json())

app.set("view engine", "ejs");

const conn = mysql.createPool({
 host: "localhost",
  user: "root",
  password: "admin",
  database: "db"
});


// const upload=multer({dest:"./uploads"})

app.get("/",(req,res)=>{
    res.render("uploadFile")
})


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads")
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}_+${file.originalname}`)
    }
})

const upload=multer({storage})



app.post("/upload",upload.single('profile'),(req,res)=>{
    console.log(req.body)
    console.log(req.file)

    const filepath=req.file.path
    const filename=req.file.filename

    conn.query("Insert into uploads(file_name,file_path) values (?,?)",[filename,filepath],
        (err,result)=>{
            if(err){
                console.log(err)
                 return res.send("Error")
            }
            else{
                console.log("Svaed in DB")
               
            }
        }
    )
})



app.get("/download/:file",(req,res)=>{
    const filename=req.params.file
    console.log(filename)
    // const __dirname = path.resolve();
    // const filepath=path.join(__dirname,'./uploads',filename);
    const location=path.join('./uploads/',filename)
    // res.download(filepath,filename)
    res.download(location,filename)
    res.send("file downloaded")
})

app.listen(8081,(req,res)=>{
    console.log("connected")
})

//c.w: save the path of upload file in db as string

//H.W: save the file as binary image into the database

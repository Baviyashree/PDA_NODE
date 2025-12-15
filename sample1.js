import express from 'express'
import multer from 'multer'
import path from 'path'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()


const app = express()

app.use(express.json())

app.set("view engine", "ejs");

const conn = mysql.createPool({
 host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PWD || '',
  database: process.env.DB_NAME || 'db'
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



app.post("/upload", upload.single("profile"), async (req, res) => {
  try {
    const filepath = req.file.path
    const filename = req.file.filename

    await conn.query(
      "INSERT INTO uploads (file_name, file_path) VALUES (?, ?)",
      [filename, filepath]
    )

    res.send("File uploaded & saved 🫶")
  } catch (err) {
    console.error(err)
    res.status(500).send("DB error")
  }
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

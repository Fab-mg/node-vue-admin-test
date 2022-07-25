import { Request, Response } from "express"
import multer from "multer"
import { extname } from "path"

export const Upload = async (req: Request, res: Response) => {

    const storage = multer.diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + extname(file.originalname)
          return cb(null, file.fieldname + '-' + uniqueSuffix )
        }
      })

    const upload = multer({ storage: storage }).single('image')
    upload(req, res, (err) => {
        if(err){console.log(err)}
        let url = "http://localhost:8000/api/uploads/"+req.file.filename
        res.send({
            url: url
            })
        })

    
}
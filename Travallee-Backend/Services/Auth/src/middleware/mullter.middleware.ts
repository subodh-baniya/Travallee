import multer from 'multer'
import fs from 'fs'
import path from 'path'

const uploadDir = process.env.NODE_ENV === 'production' 
  ? '/app/Public' 
  : path.join(process.cwd(), 'Public')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, uploadDir)
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const upload = multer({ storage: storage })


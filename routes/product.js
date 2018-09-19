const express = require('express')
const router = express.Router()
const conn = require('../config/database.js')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './images');
    },

    filename: function(req, file, callback){
        callback(null, Date.now() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    // reject file
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg"){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },

    fileFilter: fileFilter
})

// show product
router.get('/', function(req, res){
    conn.query('SELECT * FROM product', function(err, result){
        if(err) throw err;

        if(result.length > 0){ // jika ada data di database
            res.json({result})
        }else{
          res.json({
              message: "Belum ada data !"
          })
        }
    })
})

// show product per id
router.get('/:id', function(req, res){
    const id = req.params.id;
    conn.query('SELECT * FROM product WHERE id = "'+id+'"', function(err, result){
        if(err) throw err;

        if(result.length > 0){
            res.json({result})
        }else{
            res.json({
                message: "Data product tidak ditemukan"
            })
        }
    })
})

// create product
router.post('/', upload.single('productImage'), function(req, res){
    const name = req.body.name;
    const price = req.body.price;
    const maker = req.body.maker;
    const image = req.file.originalname;

    conn.query('INSERT INTO product(name, price, maker, image) VALUES("'+ name +'", "'+ price +'", "'+ maker +'", "'+ image +'")', function(err, result){
        if(err) throw err;

        if(result){
            res.json({
                message: "Product berhasil di tambahkan",
                fileImage: req.file
            })
        }else{
            res.json({
                message: "Gagal menambahkan product"
            })
        }
    })
})

// edit product
router.put('/:id', function(req, res){
    const name = req.body.name;
    const price = req.body.price;
    const maker = req.body.maker;
    const id = req.params.id;

    conn.query('UPDATE product SET name = "'+ name +'", price = "'+ price +'", maker = "'+ maker +'" WHERE id ="'+ id +'" ', function(err, result){
        if(err) throw err;

        if(result.length > 0){
            res.json({
                message: "Product berhasil di ubah"
            })
        }else{
            res.json({
                message: "Gagal untuk mengubah product"
            })
        }
    })
})

// delete product
router.delete('/:id', function(req, res){
    const id = req.params.id;
    conn.query('DELETE FROM product WHERE id = "'+id+'"', function(err, result){
        if(err) throw err;

        if(result.length > 0){
            res.json({
                message: "Product berhasil di hapus"
            })
        }else{
            res.json({
                message: "Gagal untuk menghapus product"
            })
        }
    })
})

module.exports = router;
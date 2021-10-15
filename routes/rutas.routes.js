let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    uuidv4 = require('uuid/v4'),
    router = express.Router();


// Ruta model
let Rutas = require('../models/Rutas');

borrar_carpeta = (id) => {
    Rutas.find({ pattern_id: id }).then(data => {
        if (data.length === 0 || data == undefined ) {
            return 0;
        } else {            
            data.forEach((da) => {
                borrar_carpeta(da._id)
            })
        }
    })

    Rutas.deleteOne({ _id:id}, function(err, result) {
        if (err) {
            console.log("error query");
        } else {
            console.log(result);
        }
    })
}

router.post('/save_directory', (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    var pid = null
    if (req.body.ruta !== "/") {
        console.log("dentro_del_condicional")
        Rutas.find({ slug: req.body.ruta }).then(data => {
            console.log(data[0]._id)
            const Ruta = new Rutas({
                _id: new mongoose.Types.ObjectId(),
                pattern_id: data[0]._id,
                name: req.body.name,
                title: req.body.title,
                description: req.body.description,
                nivel: req.body.nivel,
                date: req.body.fecha,
                ruta: req.body.ruta,
                ruta_real: req.body.ruta.replace(' ', '_'),
                number_files: 0,
                slug: req.body.ruta.replace(' ', '_') + req.body.name.replace(' ','_').replace('/', '_')+'/'
            });
            Ruta.save().then(result => {
                res.status(201).json({
                    message: "Directory registered successfully!",
                    DirectoryCreated: {
                        _id: result._id,
                        name: result.name,
                        ruta: result.ruta,
                    },
                    
                })
            }).catch(err => {
                console.log(err),
                res.status(500).json({
                    error: err
                });
            })     
        })
    } else {
        const Ruta = new Rutas({
            _id: new mongoose.Types.ObjectId(),
            pattern_id: pid,
            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
            nivel: req.body.nivel,
            date: req.body.fecha,
            ruta: req.body.ruta,
            ruta_real: req.body.ruta.replace(' ', '_'),
            number_files: 0,
            slug: req.body.ruta.replace(' ', '_') + req.body.name.replace(' ','_').replace('/', '_')+'/'
        });
        Ruta.save().then(result => {
            res.status(201).json({
                message: "Directory registered successfully!",
                DirectoryCreated: {
                    _id: result._id,
                    name: result.name,
                    ruta: result.ruta,
                },
        
            })
        }).catch(err => {
            console.log(err),
            res.status(500).json({
                error: err
            });
        })
    }
})

router.get("/ver_carpetas", (req, res, next) => {
    Rutas.find().then(data => {
        res.status(200).json({
            message: "Directories list retrieved successfully!",
            users: data
        });
    });
});

router.post("/directories_by_ruta", (req, res) => {
    Rutas.find({ ruta_real: req.body.params.ruta }).then(data => {
        res.status(200).json({
            message: "Directory list retrieved successfully!",
            users: data
        });
    });
});
router.post("/updateDirectoryById", (req, res) => {
    var f = req.body.form.id;
    Rutas.findByIdAndUpdate(f, { title: req.body.form.title, description: req.body.form.description, name: req.body.form.name }).then(data => {
        res.status(200).json({
            message: "Actualizado!",
        })
    });
});
router.post("/exist_directory", (req, res) => {
    Rutas.exists({ slug: req.body.ruta }).then(data => {
        res.status(200).json({
            message: "Existe o no",
            datos: data,
        })
    })
})

router.post("/getDirectory", (req, res) => {
    Rutas.find({ slug: req.body.ruta }).then(data => {
        res.status(200).json({
            message: "Existe o no",
            datos: data,
        })
    })
})
router.post("/GetInfoFolder", (req, res) => {
    Rutas.find({ slug: req.body.params.slug }).then(data => {
        res.status(200).json({
            message: "Existe o no",
            datos: data,
        })
    })
})

router.post("/getDirectoryById", (req, res) => {
    Rutas.find({ _id: req.body.id }).then(data => {
        res.status(200).json({
            message: "Existe o no",
            datos: data,
        })
    })
})

router.delete("/del_carp", (req, res) => {
    borrar_carpeta(req.body.id)
    res.status(200).json({
        message: "Se borro el directorio y sus subdirectorios"
    })
});

module.exports = router;
const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');


const app = express();


    //------------- GET ----------------
    app.get('/', function (req, res) {
        res.json('Hello World')
    });



    //------------- GET ----------------
  
    app.get('/usuario', function (req, res) {

        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

        Usuario.find({ estado: true}, 'nombre email role estado google img')
                .skip(desde)
                .limit(limite)
                .exec((err, usuarios) => {
                    if ( err ){
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    Usuario.count({estado:true}, (err, conteo )=>{
                        res.json({
                            ok: true,
                            usuarios,
                            conteo
                        }); 
                    })

                    
                });

    });


    //------------- POST ---------------
  
    app.post('/usuario', function (req, res) {
  
      let body = req.body;

      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync(body.password, 10),
          //img: body.img,
          role: body.role
      });

      usuario.save( (err, usuarioDB) =>{
          if ( err ){
              return res.status(400).json({
                  ok: false,
                  err
              });
          }

          //usuarioDB.password = null;

          res.json({
              ok: true,
              usuario: usuarioDB
          });
      });
    });
     


    //-------------- PUT -----------------------
    app.put('/usuario/:id', function (req, res) {

    let validos = ['nombre',
                    'email',
                    'img',
                    'role',
                    'estado'];
  
      let id = req.params.id;
      let body = _.pick(req.body, validos) ;

      
//return res.json({body})
      Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true }, (err, usuarioDB) =>{

        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

      })
     
    });




    //---------------- Delete --------------------------
  
    app.delete('/usuario/:id', function (req, res) {

      let id = req.params.id;


      Usuario.findByIdAndUpdate(id, {estado : false}, {new: true}, ( err, usuarioBorrado ) =>{
            if( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if( !usuarioBorrado ){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                usuarioBorrado
            });
      })


      /*
      Usuario.findByIdAndRemove(id, ( err, usuarioBorrado) => {


        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( !usuarioBorrado ){
           return  res.status(400).json({
               ok: false,
               err: {
                   message: 'Usuario no encontrado'
               }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

      });*/
    });

    module.exports = app;
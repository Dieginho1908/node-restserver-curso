const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator'); //Packete que realiza las validaciones

let rolesValidos = { //Roles válidos en la propiedad enum del campo role
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El coreo es nesesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img:{
        type: String,
        required: false
    }, // no es obligatoria
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },// default: 'USER ROLE'
    estado: {
        type:Boolean,
        default: true
    },// boolean
    google: {
        type:Boolean,
        default: false
    }//boolean

});

usuarioSchema.methods.toJSON = function() {
    let user = this;

    let userObject = user.toObject();

    delete userObject.password;

    
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);
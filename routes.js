var express = require('express');
var Zombie = require('./models/zombie');
var Arma = require('./models/weapons');

var passport = require('passport');
var acl = require('express-acl');

var router = express.Router();

acl.config({
    baseUrl: '/',
    defaultRole: 'zombie',
    decodeObjectName: 'zombie',
    roleSearchPath: 'zombie.role'
});

router.use(acl.authorize);

router.use((req,res,next)=>{
    res.locals.currentZombie = req.zombie;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash('info');
    if(req.session.passport){
        if(req.zombie){
            req.session.role = req.zombie.role;
        }else{
            req.session.role = "zombie";
        }
    }
    console.log(req.session);
    next();
});

router.use(acl.authorize);



router.get("/",(req,res,next)=>{
    Zombie.find()
    .sort({createdAt:"descending"})
    .exec((err, zombies)=>{
        if(err){
            return next(err);
        }
        res.render("index",{zombies: zombies});
    });
});

router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/login",passport.authenticate("login",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
}));

router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});


router.get("/signup",(req,res,next)=>{
    res.render('signup');
});

router.get("/addweapon",(req,res,next)=>{
    res.render('addweapon');
});

router.get("/edit", ensureAuthenticated,(req,res)=>{
    res.render("edit");
});

router.post("/edit",ensureAuthenticated,(req,res,next)=>{
    req.zombie.displayName = req.body.displayName;
    req.zombie.bio = req.body.bio;
    req.zombie.save((err)=>{
        if(err){
            next(err);
            return;
        }
        req.flash("info","Perfil Actualizado");
        res.redirect("/edit");
    });
});

router.get("/weapons",(req,res,next)=>{
    Arma.find()
    .sort({fuerza:"descending"})
    .exec((err, armas)=>{
        if(err){
            return next(err);
        }
        res.render("weapons",{armas: armas});
    });
});

router.post("/addweapon",(req,res,next)=>{
    var descripcion = req.body.descripcion;
    var fuerza = req.body.fuerza;
    var categoria = req.body.categoria;

    Arma.findOne((arma)=>{
        var newArma = new Arma({
            descripcion: descripcion,
            fuerza: fuerza,
            categoria: categoria
        });
        newArma.save(next);
        res.redirect("/weapons")
    });
});

router.post("/signup",(req,res,next)=>{
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    Zombie.findOne({username: username},(err,zombie)=>{
        if(err){
            return next(err);
        }
        if(zombie){
            req.flash("error", "El nombre de usuario ya lo ha tomado otro zombie");
            return res.redirect("/signup");
        }
        var newZombie = new Zombie({
            username: username,
            password: password,
            role: role
        });
        newZombie.save(next);
        res.redirect("/login");
    });
});

router.get("/zombies/:username", (req, res, next) =>{
     Zombie.findOne({username: req.params.username}, (err, zombie) =>{
         if(err){
             return next(err);
        }
        if(!zombie){
             return next(404);
        }
        if(zombie){
            user = "/zombies/:username";
        }
        res.render("profile",{zombie: zombie});
     });
});


function ensureAuthenticated(req,res,next){
     if(req.isAuthenticated()){
         next();
     }else{
         req.flash("info","Necesitas iniciar sesión para poder ver esta seccion");
         res.redirect("/login");
     }
}
 
module.exports = router;
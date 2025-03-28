require('dotenv').config();
let express=require('express');
let app=express();
let path=require('path');
let passport=require('passport');
let passportLocal=require('passport-local');
let mysql=require('mysql2');
let session=require('express-session');
let bcrypt=require('bcrypt');
const port = process.env.PORT || 5000;
     

let connection=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_ROOT,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

let sessionOption={
    secret: 'weather app',
    resave:false,
    saveUnintialized:true
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

passport.use("Local",new passportLocal(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    function(req,email,password,done){ 
        try{
            let sql=`select * from user where email= ?`;
            connection.query(sql,[email],async function(err,result){
                if(err)
                    throw err;
                if(result.length==0)
                    return done(null,false);
                let user=result[0];
                let password_match=await bcrypt.compare(password,user.password);
                if(password_match)
                    return done(null,user);
                else
                    return done(null,false);
            });
        }
        catch(err){
            console.log("Error in login passport")
            res.redirect("/login");
        }
    }
))

passport.serializeUser(function(user,done){
    done(null,user);
})

passport.deserializeUser(function(user,done){
    let sql=`select * from user where id=?`;
    connection.query(sql,[user.id],function(err,result){
        if(err) 
            return done(err);
        return done(null,result[0]);
    })
})
app.listen(port,function(){
    console.log("Server is running on port "+port)
})
app.get("/",function(req,res){
    if(req.isAuthenticated())
        res.redirect("/weather");
    else
        res.redirect("/weather/login")
})
app.get("/weather",function(req,res){
    if(req.isAuthenticated())
        res.render("home.ejs",{name:req.user.username});
    else
        res.redirect("/weather/login")
})

app.get("/weather/login",function(req,res){
    res.render("login.ejs")
});
app.post("/weather/user/login",passport.authenticate("Local",{
    successRedirect: "/",
    failureRedirect: "/weather/login"
}))


app.get("/weather/signup",function(req,res){
    res.render("signup.ejs")
})

app.post("/weather/user/signup",async function(req,res){
    try{
        let {username,email,password}=req.body;
        let sql=`select * from user where email=?`;
        let check_email=await new Promise(function(resolve,reject){
            connection.query(sql,[email],function(err,result){
                if(err)
                    reject(err);
                resolve(result.length==0);
            })
        });
        if(check_email){
            sql=`insert into user (username,email,password) values (?,?,?)`;
            password=await new bcrypt.hash(password,10);
            connection.query(sql,[username,email,password],async function(err,result){
                if(err) throw err;
                console.log("User added successfully");
            })
            res.redirect("/weather/login")
        }
        else{
            res.redirect("/weather/signup?error=email_exists");
        }
    }
    catch(err){
        console.log("Error in signup process");
        res.redirect("/weather/signup");
    }
})

app.get("/weather/logout",function(req,res){
    req.logout(function(err){
        res.redirect("/weather/login");
    });
})
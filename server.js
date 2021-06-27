  const url = require("url");
  const path = require("path");
  const express = require("express");
  const passport = require("passport");
  const session = require("express-session");
  const Strategy = require("passport-discord").Strategy;
  const ejs = require("ejs");
  const bodyParser = require("body-parser");
  const Discord = require("discord.js");
  const config = require("../config.js");
  const roles = config.roles;
  const db = require("quick.db");
  const parseMilliseconds = require("parse-ms");
  const channels = config.channels;
  const app = express();
  const MemoryStore = require("memorystore")(session);
  const fetch = require("node-fetch");
  const cookieParser = require('cookie-parser');
  const referrerPolicy = require('referrer-policy');
  app.use(referrerPolicy({ policy: "strict-origin" }))
  const ms = require("parse-ms");
  // MODELS
  const marked = require("markdown-converter");
   const profiledata = require("./database/models/profile.js");
  const botsdata = require("./database/models/botlist/bots.js");
  const serversdata = require("./database/models/servers/server.js");
  const vanitysdata = require("./database/models/vanity/vanity.js");
  const bumpsdata = require("./database/models/servers/bump.js");
  const voteSchema = require("./database/models/botlist/vote.js");
  const uptimeSchema = require("./database/models/uptime.js");
  const banSchema = require("./database/models/site-ban.js");
    const ipbanSchema = require("./database/models/site-ipban.js");
  const userPremium = require("./database/models/site-premium.js");
  const maintenceSchema = require('./database/models/bakim.js');
const codesSchema = require("./database/models/codes.js");
  module.exports = async (client) => {
   var certirole = config.roles.botlist.certified_bot;
    var botrole = config.roles.botlist.bot;
   var devrole = config.roles.botlist.developer;
    var certidevrole = config.roles.botlist.certified_developer
    const templateDir = path.resolve(`${process.cwd()}${path.sep}src/views`);
    app.use("/css", express.static(path.resolve(`${templateDir}${path.sep}assets/css`)));
    app.use("/js", express.static(path.resolve(`${templateDir}${path.sep}assets/js`)));
    app.use("/img", express.static(path.resolve(`${templateDir}${path.sep}assets/img`)));
  
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));
  
    passport.use(new Strategy({
      clientID: config.website.clientID,
      clientSecret: config.website.secret,
      callbackURL: config.website.callback,
      scope: ["identify", "guilds"]
    },
    (accessToken, refreshToken, profile, done) => { 
      process.nextTick(() => done(null, profile));
    }));
  
    app.use(session({
      store: new MemoryStore({ checkPeriod: 86400000 }),
      secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
      resave: false,
      saveUninitialized: false,
    }));
  
    app.use(passport.initialize());
    app.use(passport.session());
  
  
    app.engine("html", ejs.renderFile);
    app.set("view engine", "html");
  
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));
  
  const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      _token: req.session['_token'],
      user: req.isAuthenticated() ? req.user : null,
      global: config,
      pdata1: userPremium
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    };
  
    const checkAuth = (req, res, next) => {
      if (req.isAuthenticated()) return next();
      req.session.backURL = req.url;
      res.redirect("/login");
    }
    
    const checkMaintence = async (req, res, next) => {
      const d = await maintenceSchema.findOne({server: config.server.id });
      if(d) {
          if(req.isAuthenticated()) {
              let usercheck = client.guilds.cache.get(config.server.id).members.cache.get(req.user.id);
              if(usercheck) {
                  if(usercheck.roles.cache.get(roles.yonetici)) {
                  next();
                  } else {
                      res.redirect('/error?code=200&message=Our website is temporarily unavailable.') 
                  }
              } else {
                  res.redirect('/error?code=200&message=Our website is temporarily unavailable.') 
              }
          } else {
              res.redirect('/error?code=200&message=Our website is temporarily unavailable.') 
          }
      } else {
          next();
      }
    }
    
    function generateRandom(length) {
        var result           = [];
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
       }
       return result.join('');
    }
    
 var ipgeoblock = require("node-ipgeoblock");

    
     
   app.get("/login", (req, res, next) => {
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL; 
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
       }
      next();
    },
    passport.authenticate("discord", { prompt: 'none' }));
  
  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/error?code=999&message=We encountered an error while connecting." }), async (req, res) => {
      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
      let banned2 = await ipbanSchema.findOne({user: ip})
      
        if(banned2){
          if(banned2.user = ip) {
            req.session.destroy(() => {
             return res.json({ 
              "Type ban": "Permanently Banned", 
              "Banned By": banned2.bannedby+'#'+banned2.tagg,
              "IP Adress": banned2.user
            });
             req.logout();
             });
          }
        }else{
          
        }
        let banned = await banSchema.findOne({user: req.user.id})
        if(banned) {
          const datum =  new Date().toLocaleString();
          var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
           const ipdata = require("./database/models/ipadress.js");
           let register1 = await ipdata.findOne({ipv4: await ip}, { _id: false });
           if (!register1){
            ipdata({ userID: req.user.id, ipv4: await ip, username: req.user.username, tag: req.user.discriminator, time: datum}).save()
          }
        client.users.fetch(req.user.id).then(async a => {
        client.channels.cache.get(channels.login).send(new Discord.MessageEmbed().setAuthor(a.username, a.avatarURL({dynamic: true})).setThumbnail(a.avatarURL({dynamic: true})).setColor("RED").setDescription(`[**${a.username}**#${a.discriminator}](https://dumbbotlist.tk/user/${a.id}) banned user tried to connect.`).addField("Username", a.username).addField("User ID", a.id).addField("User Discriminator", a.discriminator))
        })
        req.session.destroy(() => {
         res.redirect(`/banned?code=${banned.bannedby} have you banned from dumb bots official&message=Reason: ${banned.sebep}`) 
        req.logout();
        });
        } else {
          const datum =  new Date().toLocaleString();
          var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
           const ipdata = require("./database/models/ipadress.js");
           let register1 = await ipdata.findOne({ipv4: await ip}, { _id: false });
           if (!register1){
            ipdata({ userID: req.user.id, ipv4: await ip, username: req.user.username, tag: req.user.discriminator, time: datum}).save()
          }
          const profile1 = require("./database/models/profile.js");
          let register = await profile1.findOne({userID: req.user.id}, { _id: false });
          if (!register){
            profiledata({ userID: req.user.id, banned: false, paid: false}).save()
          }
          
            try {
              const request = require('request');
              request({
                  url: `https://discordapp.com/api/v8/guilds/${config.server.id}/members/${req.user.id}`,
                  method: "PUT",
                  json: { access_token: req.user.accessToken },
                  headers: { "Authorization": `Bot ${client.token}` }
              });
        } catch {};
        res.redirect(req.session.backURL || '/')
        client.users.fetch(req.user.id).then(async a => {
        client.channels.cache.get(channels.login).send(new Discord.MessageEmbed().setAuthor(a.username, a.avatarURL({dynamic: true})).setThumbnail(a.avatarURL({dynamic: true})).setColor("GREEN").setDescription(`[**${a.username}**#${a.discriminator}](https://dumbbotlist.tk/user/${a.id}) welcome to our bot list`).addField("Username", a.username).addField("User ID", a.id).addField("User Discriminator", a.discriminator))
        
        })
        }
    });
  
    app.get("/logout", function (req, res) {
      req.session.destroy(() => {
        req.logout();
        res.redirect("/");
      });
    });

    const http = require('http').createServer(app);
    const io = require('socket.io')(http);
    io.on('connection', socket => {
      io.emit("userCount", io.engine.clientsCount);
    }); 
    http.listen(3000);
    //------------------- EXTRA -------------------//

function file_get_contents(filename) {
    fetch(filename).then((resp) => resp.text()).then(function(data) {
        return data;
    });
}
 /* const getVisitorCountry = () => {
  return new Promise((resolve, reject) => {
    window
      .fetch("https://ip2c.org/self")
      .then((response) => response.text())
      .then((data) => {
        const [status, country] = String(data).split(";");
        if (status !== "1") {
          throw new Error("Unable to fetch country");
        }
        resolve(country);
      })
      .catch(() => {
        resolve("US");
      });
  });
 }; */
 // get visitor's location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// watch visitor's location
function watchLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition, handleError);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function handleError(error) {
  let errorStr;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorStr = 'User denied the request for Geolocation.';
      break;
    case error.POSITION_UNAVAILABLE:
      errorStr = 'Location information is unavailable.';
      break;
    case error.TIMEOUT:
      errorStr = 'The request to get user location timed out.';
      break;
    case error.UNKNOWN_ERROR:
      errorStr = 'An unknown error occurred.';
      break;
    default:
      errorStr = 'An unknown error occurred.';
  }
  console.error('Error occurred: ' + errorStr);
}

function showPosition(position) {
  console.log(`Latitude: ${position.coords.latitude}, longitude: ${position.coords.longitude}`);
}
    app.get("/", checkMaintence, async (req, res) => {
      const botdata = await botsdata.find();
      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
     
//getLocation()

      
      renderTemplate(res, req, "index.ejs", { config, roles, botdata, getuser });
    });
    app.get("/dc", (req, res) => {
      res.redirect('https://discord.gg/78ZCFKUpx5');
    });  
    app.get("/discord", (req, res) => {
      res.redirect('https://discord.gg/78ZCFKUpx5');
    });  
   app.get("/error", (req, res) => {
        renderTemplate(res, req, "pages/error.ejs", {
            req,
            config,
            res,
            roles,
            channels
        });
    });
    app.get("/partners", checkMaintence, (req, res) => {
        const Database = require("void.db");
        const db = new Database(path.join(__dirname, './database/json/partners.json'));
      renderTemplate(res, req, "partners.ejs", {roles, config, db});
    }); 
      app.get("/founders", checkMaintence, (req, res) => {
        const Database = require("void.db");
        const db = new Database(path.join(__dirname, './database/json/team.json'));
      renderTemplate(res, req, "team.ejs", {roles, config, db});
    }); 
    app.get("/team", checkMaintence, (req, res) => {
      const Database = require("void.db");
      const db = new Database(path.join(__dirname, './database/json/team.json'));
    renderTemplate(res, req, "team.ejs", {roles, config, db});
  });
   app.get("/banned", (req, res) => {
      renderTemplate(res, req, "pages/banned.ejs", {req, config, res, roles, channels});
});
   
    app.get("/news", checkMaintence, (req, res) => {
    const Database = require("void.db");
    const db = new Database(path.join(__dirname, './database/json/news.json'));
  renderTemplate(res, req, "news.ejs", {roles, config, db});
  });
   // app.get("/news-read/:id", checkMaintence, (req, res)  => {
  //   const Database = require("void.db");
  //   const db = new Database(path.join(__dirname, './database/json/news.json'));
  //    db.fetch({
  //     news: {
  //             id: req.params.id
  //     }
  // })
  // renderTemplate(res, req, "news-read.ejs", {roles, config, db});
  // });
  app.get("/privacy", checkMaintence, (req, res) => {
      renderTemplate(res, req, "/privacy/privacy.ejs", {config,roles});
    });
    app.get("/terms", checkMaintence, (req, res) => {
      renderTemplate(res, req, "/privacy/terms.ejs", {config,roles});
    });
    app.get("/bot-rules", checkMaintence, (req, res) => {
      renderTemplate(res, req, "/botlist/bot-rules.ejs", {config,roles});
    });
    app.get("/robots.txt", function(req,res) {
      res.set('Content-Type', 'text/plain');
      res.send(`Sitemap: https://dumbbotlist.tk/sitemap.xml`);
    });

    app.get("/sitemap.xml", async function(req,res) {
        let link = "<url><loc>https://dumbbotlist.tk/</loc></url>";
        let botdataforxml = await botsdata.find()
        botdataforxml.forEach(bot => {
            link += "\n<url><loc>https://dumbbotlist.tk/bot/"+bot.botID+"</loc></url>";
        })
        res.set('Content-Type', 'text/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="https://www.google.com/schemas/sitemap-image/1.1">${link}</urlset>`);
    });

  
  
     app.get("/bots/premium", checkMaintence, async (req,res) => {
          let page = req.query.page || 1;
          let x = await botsdata.find()
          let data = x.filter(b => b.premium === "Premium")
          //if(page < 1) return res.redirect(`/bots`);
          if(data.length <= 0) return res.redirect("/");
          if((page > Math.ceil(data.length / 6)))return res.redirect(`/bots`);
          if (Math.ceil(data.length / 6) < 1) {
              page = 1;
          };
          renderTemplate(res, req, "botlist/bots-premium.ejs", {
              req,
              roles,
              config,
              data,
              page: page
          });
        })
    //------------------- UPTİME -------------------//
    const uptimedata = require("./database/models/uptime.js");
    app.get("/uptime/add", checkMaintence, checkAuth, async (req,res) => {
      renderTemplate(res, req, "uptime/ekle.ejs", {req, roles, config});
    })
    app.post("/uptime/add", checkMaintence, checkAuth, async (req,res) => {
      const rBody = req.body;
      if(!rBody['link']) { 
          res.redirect('?error=true&message=Write a any link.')
      } else {
          if(!rBody['link'].match('https')) return res.redirect('?error=true&message=You must enter a valid link.')
          const updcode = makeidd(5);
          const dde = await uptimedata.findOne({link: rBody['link']});
          const dd = await uptimedata.find({userID: req.user.id});
          if(dd.length > 9) res.redirect('?error=true&message=Your uptime limit has reached.')
  
          if(dde) return res.redirect('?error=true&message=This link already exists in the system.')
          client.users.fetch(req.user.id).then(a => {
          client.channels.cache.get(channels.uptimelog).send(new Discord.MessageEmbed()
          .setAuthor(a.username, a.avatarURL({dynamic: true}))
          .setDescription("New link added uptime system.")
          .setThumbnail(client.user.avatarURL)
          .setColor("GREEN")
          .addField("User;", `${a.tag} \`(${a.id})\``, true)
          .addField("Uptime Code;", updcode, true)
          .addField("Uptime Limit;", `${dd.length+1}/10`, true)
          )
          new uptimedata({server: config.serverID, userName: a.username, userID: req.user.id, link: rBody['link'], code: updcode}).save();
        })
        res.redirect('?success=true&message=Your link has been successfully added to the uptime system.');
      }
    })
    app.get("/uptime/links", checkMaintence, checkAuth, async (req,res) => {
      let uptimes = await uptimedata.find({ userID: req.user.id })
      renderTemplate(res, req, "uptime/linklerim.ejs", {req, roles, config, uptimes});
     })
     app.get("/uptime/:code/delete", checkMaintence, checkAuth, async (req,res) => {
      const dde = await uptimedata.findOne({code: req.params.code});
      if(!dde) return res.redirect('/uptime/links?error=true&message=There is no such site in the system.')
      uptimedata.findOne({ 'code': req.params.code }, async function (err, docs) { 
              if(docs.userID != req.user.id) return res.redirect('/uptime/links?error=true&message=The link you tried to delete does not belong to you.');
              res.redirect('/uptime/links?success=true&message=The link has been successfully deleted from the system.');
              await uptimedata.deleteOne({ code: req.params.code });
       })
     })
    //------------------- UPTİME -------------------//
  
    //------------------- BOT LİST -------------------//
    
      app.get("/bots", checkMaintence, async (req,res) => {
            let page = req.query.page || 1;
            let data = await botsdata.find() || await botsdata.find().filter(b => b.status === "Approved")
            if(page < 1) return res.redirect(`/bots`);
            if(data.length <= 0) return res.redirect("/");
            if((page > Math.ceil(data.length / 6)))return res.redirect(`/bots`);
            if (Math.ceil(data.length / 6) < 1) {
            page = 1;
          };
          renderTemplate(res, req, "botlist/bots.ejs", {
              req,
              roles,
              config,
              data,
              page: page
          });
        })
           app.get("/addvanity", checkMaintence, checkAuth, async (req,res) => {
            
          renderTemplate(res, req, "vanity/add.ejs", {
              req,
              roles,
              config,
              data: vanitysdata
          });
        })
         app.get("/bots/certified", checkMaintence, async (req,res) => {
          let page = req.query.page || 1;
          let x = await botsdata.find()
          let data = x.filter(b => b.certificate === "Certified")
          if(page < 1) return res.redirect(`/bots`);
          if(data.length <= 0) return res.redirect("/");
          if((page > Math.ceil(data.length / 6)))return res.redirect(`/bots`);
          if (Math.ceil(data.length / 6) < 1) {
              page = 1;
          };
          renderTemplate(res, req, "botlist/bots-certified.ejs", {
              req,
              roles,
              config,
              data,
              page: page
          });
        })
       /*  app.get("/vanities/servers", checkMaintence, checkAuth, async (req,res) => {
          let page = req.query.page || 1;
          let x = await serversdata.find()
          let serversdata1 = x.filter(async b => b.ownerID == req.user.id);
          //tocheck
          
          if(page < 1) return res.redirect(`/`);
          if(serversdata1.length <= 0) return res.redirect("/");
          if((page > Math.ceil(serversdata1.length / 6)))return res.redirect(`/`);
          if (Math.ceil(serversdata1.length / 6) < 1) {
              page = 1;
          };
          renderTemplate(res, req, "vanity/serversall.ejs", {
              req,
              roles,
              config,
              page: page,
              serversdata: serversdata1,
              vanitysdata: vanitysdata.find()
          });
        }) */
       /*   app.get("/vanities/bots", checkMaintence, checkAuth, async (req,res) => {
          let page = req.query.page || 1;
          let x = await botsdata.find()
          let botsdata1 = x.filter(async b => b.ownerID == req.user.id && (await vanitysdata.findOne({ID: b.botID}).ID));
         
          if(page < 1) return res.redirect(`/`);
          if(botsdata1.length <= 0) return res.redirect("/");
          if((page > Math.ceil(botsdata1.length / 6)))return res.redirect(`/`);
          if (Math.ceil(botsdata1.length / 6) < 1) {
              page = 1;
          };
          renderTemplate(res, req, "vanity/botsall.ejs", {
              req,
              roles,
              config,
              page: page,
              botsdata: botsdata1
          });
        }) */
        app.get("/bots/verified", checkMaintence, async (req,res) => {
          let page = req.query.page || 1;
          let x = await botsdata.find()
          let data = x.filter(b => b.status === "Approved")
          if(page < 1) return res.redirect(`/bots`);
          if(data.length <= 0) return res.redirect("/");
          if((page > Math.ceil(data.length / 6)))return res.redirect(`/bots`);
          if (Math.ceil(data.length / 6) < 1) {
              page = 1;
          };
          renderTemplate(res, req, "botlist/bots-verified.ejs", {
              req,
              roles,
              config,
              data,
              page: page
          });
        })
        app.get("/search", checkMaintence, async (req,res) => {
          let page = req.query.page || 1;
          let x = await botsdata.find()
          let data = x.filter(a => a.status == "Approved" && a.username.includes(req.query.q) || a.shortDesc.includes(req.query.q))
         
          if(page < 1) return res.redirect(`/bots`);
          if(data.length <= 0) return res.redirect("/error?code=404&message=No Bots Found with that Name");
          if((page > Math.ceil(data.length / 6)))return res.redirect(`/bots`);
          if (Math.ceil(data.length / 6) < 1) {
              page = 1;
          };
          renderTemplate(res, req, "botlist/search.ejs", {
              req,
              roles,
              config,
              data,
              page: page
          });
        })
         app.get("/servers/search", checkMaintence, async (req,res) => {
          let page = req.query.page || 1;
          let x = await serversdata.find()
          let data = x.filter(a => a.status == "Approved" && a.username.includes(req.query.q) || a.shortDesc.includes(req.query.q))
         
          if(page < 1) return res.redirect(`/servers`);
          if(data.length <= 0) return res.redirect("/error?code=404&message=No Servers Found with that Name");
          if((page > Math.ceil(data.length / 6)))return res.redirect(`/servers`);
          if (Math.ceil(data.length / 6) < 1) {
              page = 1;
          };
          renderTemplate(res, req, "servers/search.ejs", {
              req,
              roles,
              config,
              data,
              page: page
          });
        })
        app.get("/tags", checkMaintence, async (req,res) => {
            renderTemplate(res, req, "botlist/tags.ejs", {
                req,
                roles,
                config
            });
          })
            app.get("/servers/tags", checkMaintence, async (req,res) => {
            renderTemplate(res, req, "servers/tags.ejs", {
                req,
                roles,
                config
            });
          })
        app.get("/tag/:tag", checkMaintence, async (req,res) => {
            let page = req.query.page || 1;
            let x = await botsdata.find()
            let data = x.filter(a => a.status == "Approved" && a.tags.includes(req.params.tag))
            if(page < 1) return res.redirect(`/tag/`+req.params.tag);
            if(data.length <= 0) return res.redirect("/error?code=404&message=No Bots Found with that Tag");
            if((page > Math.ceil(data.length / 6)))return res.redirect(`/tag/`+req.params.tag);
            if (Math.ceil(data.length / 6) < 1) {
              page = 1;
            };
            renderTemplate(res, req, "botlist/tag.ejs", {
                req,
                roles,
                config,
                data,
                page: page
            });
          })
           app.get("/servers/tag/:tag", checkMaintence, async (req,res) => {
            let page = req.query.page || 1;
            let x = await serversdata.find()
            let data = x.filter(a => a.status == "Approved" && a.tags.includes(req.params.tag))
            if(page < 1) return res.redirect(`/servers/tag/`+req.params.tag);
            if(data.length <= 0) return res.redirect("/error?code=404&message=No Servers Found with that Tag");
            if((page > Math.ceil(data.length / 6)))return res.redirect(`/servers/tag/`+req.params.tag);
            if (Math.ceil(data.length / 6) < 1) {
              page = 1;
            };
            renderTemplate(res, req, "servers/tag.ejs", {
                req,
                roles,
                config,
                data,
                page: page
            });
          })
    app.get("/addbot", checkMaintence, checkAuth, async (req,res) => {
      if(!client.users.cache.get(req.user.id)) {
        return res.redirect("/error?code=404&message=You Must be in Our Support Server to do this");
      }
      renderTemplate(res, req, "botlist/addbot.ejs", {req, roles, config});
    })
app.get("/serveradd/:serverID", checkMaintence, checkAuth, async (req,res) => {
  let guildcache = client.guilds.cache.get(config.server.id);
      if(!guildcache.members.fetch(req.user.id)) {
        return res.redirect("/error?code=404&message=You Must be in Our Support Server to do this");
      }
      if(!client.guilds.cache.get(req.params.serverID))
      {
        return res.redirect("/error?code=404&message=You Must Add Official Bot to do this");
      }
      renderTemplate(res, req, "servers/addserver.ejs", {req, roles, config, guild: req.params.serverID});
    })

    app.get("/bot/:botID/vote", checkMaintence, async (req,res) => {
      let botdata = await botsdata.findOne({ botID: req.params.botID });
      if(!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
      if(req.user) {
      if(!req.user.id === botdata.ownerID || req.user.id.includes(botdata.coowners)) {
        if(botdata.status != "Approved") return res.redirect("/error?code=404&message=You entered an invalid bot id.");
      }
      }
      renderTemplate(res, req, "botlist/vote.ejs", {req, roles, config, botdata});
    })


    app.post("/bot/:botID/vote", checkMaintence, checkAuth, async (req,res) => {
      const votes = require("./database/models/botlist/vote.js");
      let botdata = await botsdata.findOne({ botID: req.params.botID });
      let x = await votes.findOne({user: req.user.id,bot: req.params.botID})
      
   
        
      if(x) 
      {
          var timeleft = await parseMilliseconds(x.ms - (Date.now() - x.Date));
       var hour = timeleft.hours;
       var minutes = timeleft.minutes;
       var seconds = timeleft.seconds;
        return res.redirect(`/error?code=400&message=You can vote in ${hour}h ${minutes}m.`);
      }
      await votes.findOneAndUpdate({bot: req.params.botID, user: req.user.id }, {$set: {Date: Date.now(), ms: 43200000 }}, {upsert: true})
      await botsdata.findOneAndUpdate({botID: req.params.botID}, {$inc: {votes: 1}})
      let approveembed3 = new Discord.MessageEmbed()
             .setTitle("Bot Voted")
             .setDescription(`Bot: ${botdata.username}\n Voter: <@${req.user.username}> Votes: ${botdata.votes + 1}`)
             .setFooter("Embed Logs of Administration")
      client.channels.cache.get(channels.votes).send(approveembed3)
      return res.redirect(`/bot/${req.params.botID}/vote?success=true&message=You voted successfully. You can vote again after 12 hours.`);
      var votedbot = client.users.cache.get(botdata.botID);
      if(botdata.dcwebhook)
      {
      const webhook = require("webhook-discord");
 
const Hook = new webhook.Webhook(botdata.dcwebhook);
const msg = new webhook.MessageBuilder()
.setName("Dumb bot list Discord Webhooks")
.setAvatar("https://cdn.discordapp.com/avatars/849617280245432340/3b11b85c7054df0bcb444ed8480d3dbf.webp?size=4096")
.setTitle(`${votedbot.username} Has just been Voted!!`)
.setDescription(`Voter: ${req.user.username} Bot: ${votedbot.username} Total Votes: ${botdata.votes + 1}`)
.setFooter(`Discord Default Webhook`)
Hook.send(msg);
      }
      if(botdata.webhook)
      { 
        
        const fetch = require("node-fetch");
        fetch(botdata.webhook, {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({
     "user": `${req.user.username}`,
     "bot": `${votedbot.username}`,
     "votes": `${botdata.votes + 1}`
     }),
  })
      }
      renderTemplate(res, req, "botlist/vote.ejs", {req, roles, config, botdata, db});
    })



  app.get("/bot/:botID/test", checkMaintence, checkAuth, async (req, res) => {
     let rBody = req.body;
      let botdata = await botsdata.findOne({ botID: req.params.botID });
       var votedbot = client.users.cache.get(botdata.botID);
      if(req.user.id === botdata.ownerID && (botdata.webhook || botdata.dcwebhook))
      { 
             if(botdata.dcwebhook)
      {
      const webhook = require("webhook-discord");
 
const Hook = new webhook.Webhook(botdata.dcwebhook);
const msg = new webhook.MessageBuilder()
.setName("Dumb bot list Discord Webhooks")
.setAvatar("https://cdn.discordapp.com/avatars/849617280245432340/3b11b85c7054df0bcb444ed8480d3dbf.webp?size=4096")
.setTitle(`${votedbot.username} Has just been Voted!!`)
.setDescription(`Voter: ${req.user.username} Bot: ${votedbot.username} Total Votes: ${botdata.votes + 1}`)
.setFooter(`Discord Default Webhook`)
Hook.send(msg);
      }
      if(botdata.webhook)
      { 
        
        const fetch = require("node-fetch");
        fetch(botdata.webhook, {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({
     "user": `${req.user.username}`,
     "bot": `${votedbot.username}`,
     "votes": `${botdata.votes + 1}`
     }),
  })
  
      }

      res.redirect(`https:/dumbbotlist.tk/bot/${req.params.botID}?success=true&message=Your bot Webhook has been successfully tested by the system.&botID=${req.params.botID}`) 
      }else {
        return res.redirect("/");
      }
      
  })
   app.get("/server/:botID/vote", checkMaintence, async (req,res) => {
      let botdata = await serversdata.findOne({ serverID: req.params.botID });
      if(!botdata) return res.redirect("/error?code=404&message=You entered an invalid server id.");
      if(req.user) {
      if(!req.user.id === botdata.ownerID) {
        if(botdata.status != "Approved") return res.redirect("/error?code=404&message=You entered an invalid server id.");
      }
      }
      renderTemplate(res, req, "servers/vote.ejs", {req, roles, config, botdata});
    })


    app.post("/server/:botID/vote", checkMaintence, checkAuth, async (req,res) => {
      const votes = require("./database/models/servers/vote.js");
      let botdata = await serversdata.findOne({ serverID: req.params.botID });
      let x = await votes.findOne({user: req.user.id,server: req.params.botID})
      
   
        
      if(x) 
      {
          var timeleft = await parseMilliseconds(x.ms - (Date.now() - x.Date));
       var hour = timeleft.hours;
       var minutes = timeleft.minutes;
       var seconds = timeleft.seconds;
        return res.redirect(`/error?code=400&message=You can vote in ${hour}h ${minutes}m.`);
      }
      await votes.findOneAndUpdate({server: req.params.botID, user: req.user.id }, {$set: {Date: Date.now(), ms: 43200000 }}, {upsert: true})
      await serversdata.findOneAndUpdate({serverID: req.params.botID}, {$inc: {votes: 1}})
      let approveembed3 = new Discord.MessageEmbed()
             .setTitle("Server Voted")
             .setDescription(`Server: ${botdata.username}\n Voter: <@${req.user.username}> Votes: ${botdata.votes + 1}`)
             .setFooter("Embed Logs of Administration")
      client.channels.cache.get(channels.votes).send(approveembed3)
      return res.redirect(`/server/${req.params.botID}/vote?success=true&message=You voted successfully. You can vote again after 12 hours.`);
      
      if(botdata.dcwebhook)
      {
      const webhook = require("webhook-discord");
 
const Hook = new webhook.Webhook(botdata.dcwebhook);
const msg = new webhook.MessageBuilder()
.setName("Dumb bot list Discord Webhooks")
.setAvatar("https://cdn.discordapp.com/avatars/849617280245432340/3b11b85c7054df0bcb444ed8480d3dbf.webp?size=4096")
.setTitle(`${votedbot.username} Has just been Voted!!`)
.setDescription(`Voter: ${req.user.username} Bot: ${botdata.username} Total Votes: ${botdata.votes + 1}`)
.setFooter(`Discord Default Webhook`)
Hook.send(msg);
      }
      if(botdata.webhook)
      { 
        
        const fetch = require("node-fetch");
        fetch(botdata.webhook, {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({
     "user": `${req.user.username}`,
     "bot": `${botdata.username}`,
     "votes": `${botdata.votes + 1}`
     }),
  })
      }
      renderTemplate(res, req, "servers/vote.ejs", {req, roles, config, botdata, db});
    })



  app.get("/server/:botID/test", checkMaintence, checkAuth, async (req, res) => {
     let rBody = req.body;
      let botdata = await serversdata.findOne({ serverID: req.params.botID });
      
      if(req.user.id === botdata.ownerID && (botdata.webhook || botdata.dcwebhook))
      { 
             if(botdata.dcwebhook)
      {
      const webhook = require("webhook-discord");
 
const Hook = new webhook.Webhook(botdata.dcwebhook);
const msg = new webhook.MessageBuilder()
.setName("Dumb bot list Discord Webhooks")
.setAvatar("https://cdn.discordapp.com/avatars/849617280245432340/3b11b85c7054df0bcb444ed8480d3dbf.webp?size=4096")
.setTitle(`${botdata.username} Has just been Voted!!`)
.setDescription(`Voter: ${req.user.username} Bot: ${botdata.username} Total Votes: ${botdata.votes + 1}`)
.setFooter(`Discord Default Webhook`)
Hook.send(msg);
      }
      if(botdata.webhook)
      { 
        
        const fetch = require("node-fetch");
        fetch(botdata.webhook, {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({
     "user": `${req.user.username}`,
     "bot": `${botdata.username}`,
     "votes": `${botdata.votes + 1}`
     }),
  })
  
      }

      res.redirect(`https:/dumbbotlist.tk/server/${req.params.botID}?success=true&message=Your bot Webhook has been successfully tested by the system.&botID=${req.params.botID}`) 
      }else {
        return res.redirect("/");
      }
      
  })
    app.post("/addbot", checkMaintence, checkAuth, async (req,res) => {
       if(db.has(`don_${req.body.botID}`))
       {
         db.delete(`don_${req.body.botID}`)
       }
       if(db.has(`rate_${req.body.botID}`))
       {
         db.delete(`rate_${req.body.botID}`);
       }
       if(db.has(`presence_${req.body.botID}`))
       {
         db.delete(`presence_${req.body.botID}`);
       }
    let rBody = req.body;
      if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
     return res.redirect('/error?code=404&message=Invalid Catcha.');
  }
  // Put your secret key here.
  var secretKey = "6Lfq7CQbAAAAANpKPhjVt1P7QkBbq3XcGE-fcStT";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  var request = require('request');
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.redirect('/error?code=404&message=Invalid Catcha.');
    }
    
  });


      client.users.fetch(req.body.botID).then(async a => {
      
      let botvarmi = await botsdata.findOne({botID: req.body.botID});
      if(botvarmi) return res.redirect('/error?code=404&message=The bot you are trying to add exists in the system.');
      if(!a.bot)
      { 
        return res.redirect("/error?code=404&message=You entered an invalid bot id.");
      }
      if(!a)
      
      { 
       
        return res.redirect("/error?code=404&message=You entered an invalid bot id.");
      }
      if(rBody['coowners']) {
          if(String(rBody['coowners']).split(',').length > 3) return res.redirect("?error=true&message=You can add up to 3 CO-Owners..")
          if(String(rBody['coowners']).split(',').includes(req.user.id)) return res.redirect("?error=true&message=You cannot add yourself to other CO-Owners.");
      }
      var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
      await new botsdata({
           botID: a.id,
           botid: a.id,  
           ownerID: req.user.id,
           ownerName: req.user.usename,
           coowners: rBody['coowners'],
           username: a.username,
           discrim: a.discriminator,
           avatar: a.avatarURL(),
           prefix: rBody['prefix'],
           longDesc: rBody['longDesc'],
           shortDesc: rBody['shortDesc'],
           status: "UnApproved",
           tags: rBody['tags'],
           certificate: "None",
           token: makeToken(24),
           date: today,
           premium: "None",
           Date3: Date.now()
      }).save()
      if(rBody['background']) {
          await botsdata.findOneAndUpdate({botID: rBody['botID']},{$set: {backURL: rBody['background']}}, function (err,docs) {})
      }
      if(rBody['github']) {
          await botsdata.findOneAndUpdate({botID: rBody['botID']},{$set: {github: rBody['github']}}, function (err,docs) {})
      }
      if(rBody['website']) {
          await botsdata.findOneAndUpdate({botID: rBody['botID']},{$set: {website: rBody['website']}}, function (err,docs) {})
      }
      if(rBody['support']) {
          await botsdata.findOneAndUpdate({botID: rBody['botID']},{$set: {support: rBody['support']}}, function (err,docs) {})
      }
      if(rBody['coowners']) {
          if(String(rBody['coowners']).split(',').length > 3) return res.redirect("?error=true&message=You can add up to 3 CO-Owners..")
          if(String(rBody['coowners']).split(',').includes(req.user.id)) return res.redirect("?error=true&message=You cannot add yourself to other CO-Owners.");
          await botsdata.findOneAndUpdate({botID: rBody['botID']},{$set: { coowners: String(rBody['coowners']).split(',') }}, function (err,docs) {})
      }
      })
      client.users.fetch(rBody['botID']).then(a => {
        let approveembed2 = new Discord.MessageEmbed()
             .setTitle("Bot Added")
             .setDescription(`Bot: ${a.username}\n Owner: <@${req.user.username}>`)
             .setFooter("Embed Logs of Administration")
      client.channels.cache.get(channels.botlog).send(approveembed2)
      res.redirect(`?success=true&message=Your bot has been successfully added to the system.&botID=${rBody['botID']}`)
      })
    })


        
        app.post("/addvanity", checkMaintence, checkAuth, async (req,res) => {
      
    let rBody = req.body;
   


      
      let botvarmi = await vanitysdata.findOne({username: rBody['name']});
   
    
      if(botvarmi)
      
      { 
        return res.redirect("/error?code=404&message=There is Already an Vanity Name With Your One.");
      }
        let botvarmi1 = await vanitysdata.findOne({ID: rBody['bsid']});
        if(botvarmi1)
        {
          return res.redirect("/error?code=404&message=There is Already an Vanity Of Your Bot/Server.");
        }
      
      let chek = await botsdata.findOne({botID: rBody['bsid']});
      let servchek = await serversdata.findOne({serverID: rBody['bsid']});

      if(!servchek && !chek)
      {
        return res.redirect("/error?code=404&message=There is No Bot or Server with Your Given ID in Our List.");
      }
      if(rBody['name'].includes("/") || rBody['name'] == ("*") || rBody['name'] == ("bots") || rBody['name'].includes("servers") || rBody['name'] == ("dc") || rBody['name'] == ("server") || rBody['name'] == ("bot") || rBody['name'] == ("premium") || rBody['name'] == ("news") || rBody['name'].includes("team") || rBody['name'] == ("discord") || rBody['name'].includes("certification") || rBody['name'] === ("admin") || rBody['name'] == ("partners") || rBody['name'] == ("privacy") || rBody['name'] == ("user") || rBody['name']== ("terms") || rBody['name'] == ("addserver") || rBody['name'] == ("addbot") || rBody['name'] == ("addvanity") || rBody['name'] == ("codes") || rBody['name'] == ("uptime") || rBody['name'] == ("logout") || rBody['name'] == ("login") || rBody['name'] == ("callback") || rBody['name'] == ("tag") || rBody['name'] == ("tags") || rBody['name'] == ("img"))
      {
      return res.redirect("/error?code=404&message=The Name You Have Given is Against Our Rules Please Try to Take Another.");
      }
      if(chek)
      {
        await botsdata.findOneAndUpdate({botID: rBody['bsid']}, {$set: {vanity: rBody['name'] }});
      } if(servchek) {
         await serversdata.findOneAndUpdate({serverID: rBody['bsid']}, {$set: {vanity: rBody['name'] }});
      }
      if(chek)
      {
      var frcheck = "bot";
      } else if (servchek) {
        var frcheck = "server";
      }
      if(req.user.id == chek.ownerID || req.user.id == servchek.ownerID)
      {
       
      var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
      await new vanitysdata({
           ID: rBody['bsid'],
           id: rBody['bsid'],  
           ownerID: req.user.id,
           username: rBody['name'],
           type: frcheck
      }).save()
      
   
     
    
      
      
        let approveembed2 = new Discord.MessageEmbed()
             .setTitle("Vanity Added")
             .setDescription(`Vanity: ${rBody['name']}\n Owner: <@${req.user.username}>`)
             .setFooter("Embed Logs of Administration")
      client.channels.cache.get(channels.botlog).send(approveembed2)
      return res.redirect(`?success=true&message=Your Vanity has been successfully added to the system.`)
      } else {
        return res.redirect("/error?code=404&message=You must be owner to do this.")
      }
    })

    app.post("/serveradd/:serverID", checkMaintence, checkAuth, async (req,res) => {
      
    let rBody = req.body;
      if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
     return res.redirect('/error?code=404&message=Invalid Catcha.');
  }
  // Put your secret key here.
  var secretKey = "6Lfq7CQbAAAAANpKPhjVt1P7QkBbq3XcGE-fcStT";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  var request = require('request');
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.redirect('/error?code=404&message=Invalid Catcha.');
    }
    
  });


      let a = client.guilds.cache.get(req.params.serverID)
      
      let botvarmi = await serversdata.findOne({serverID: req.params.serverID});
      if(botvarmi) return res.redirect('/error?code=404&message=The server you are trying to add exists in the system.');
    
      if(!a)
      
      { 
       console.log("HM");
       console.log(a);
        return res.redirect("/error?code=404&message=You entered an invalid server id.");
      }
      if(rBody['coowners']) {
          if(String(rBody['coowners']).split(',').length > 5) return res.redirect("?error=true&message=You can add up to 5 CO-Owners..")
          if(String(rBody['coowners']).split(',').includes(req.user.id)) return res.redirect("?error=true&message=You cannot add yourself to other CO-Owners.");
      }
      var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
      await new serversdata({
           serverID: a.id,
           serverid: a.id,  
           ownerID: req.user.id,
           ownerName: req.user.usename,
           coowners: rBody['coowners'],
           username: a.name,
           avatar: a.iconURL(),
           invitelink: rBody['invitelink'],
           longDesc: rBody['longDesc'],
           shortDesc: rBody['shortDesc'],
           status: "Approved",
           tags: rBody['tags'],
           certificate: "None",
           date: today,
           premium: "None",
           users: a.members.cache.filter(member => !member.user.bot)
                .size
      }).save()
      db.set(`guilddata_${a.id}`, rBody['shortDesc']);
      if(rBody['background']) {
          await serversdata.findOneAndUpdate({serverID: req.params.serverID},{$set: {backURL: rBody['background']}}, function (err,docs) {})
      }
      
      if(rBody['website']) {
          await botsdata.findOneAndUpdate({serverID: req.params.serverID},{$set: {website: rBody['website']}}, function (err,docs) {})
      }
     
      if(rBody['coowners']) {
          if(String(rBody['coowners']).split(',').length > 5) return res.redirect("?error=true&message=You can add up to 5 CO-Owners..")
          if(String(rBody['coowners']).split(',').includes(req.user.id)) return res.redirect("?error=true&message=You cannot add yourself to other CO-Owners.");
          await serversdata.findOneAndUpdate({serverID: req.params.serverID},{$set: { coowners: String(rBody['coowners']).split(',') }}, function (err,docs) {})
      }
      
      
        let approveembed2 = new Discord.MessageEmbed()
             .setTitle("Server Added")
             .setDescription(`Server: ${a.name}\n Owner: <@${req.user.username}>`)
             .setFooter("Embed Logs of Administration")
      client.channels.cache.get(channels.botlog).send(approveembed2)
      res.redirect(`?success=true&message=Your server has been successfully added to the system.&serverID=${req.params.serverID}`)
      
    })
//------------------- CODE SHARE  -------------------//
    app.get("/code/:code", checkMaintence, checkAuth, async (req, res) => {
        let kod = req.params.code;
        let koddata = await codesSchema.findOne({
            code: kod
        })
        if (!koddata) return res.redirect('/codes?error=true&message=You entered an invalid code.')
        if (!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id)) return res.redirect("/error?code=403&message=To do this, you have to join our discord server.");
        if (koddata.codeCategory == "javascript") {
            if (!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(config.server.roles.codeshare.javascript)) return res.redirect("/error?code=403&message=You is not competent to do this.");
        }
        if (koddata.codeCategory == "html") {
            if (!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(config.server.roles.codeshare.html)) return res.redirect("/error?code=403&message=You is not competent to do this.");
        }
        if (koddata.codeCategory == "subs") {
            if (!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(config.server.roles.codeshare.altyapilar)) return res.redirect("/error?code=403&message=You is not competent to do this.");
        }
        if (koddata.codeCategory == "5invites") {
            if (!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(config.server.roles.codeshare.besdavet)) return res.redirect("/error?code=403&message=You is not competent to do this.");
        }
        if (koddata.codeCategory == "10invites") {
            if (!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(config.server.roles.codeshare.ondavet)) return res.redirect("/error?code=403&message=You is not competent to do this.");
        }
        if (koddata.codeCategory == "15invites") {
            if (!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(config.server.roles.codeshare.onbesdavet)) return res.redirect("/error?code=403&message=You is not competent to do this.");
        }
        if (koddata.codeCategory == "20invites") {
            if (!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(config.server.roles.codeshare.yirmidavet)) return res.redirect("/error?code=403&message=You is not competent to do this.");
        }
        if (koddata.codeCategory == "bdfd") {
            if (!client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(rconfig.server.roles.codeshare.bdfd)) return res.redirect("/error?code=403&message=You is not competent to do this.");
        }
        renderTemplate(res, req, "codeshare/codeview.ejs", {
            req,
            roles,
            config,
            koddata
        });
    })
    app.get("/codes", checkMaintence, checkAuth, async (req, res) => {
        let data = await codesSchema.find()
        renderTemplate(res, req, "codeshare/codes/codes.ejs", {
            req,
            roles,
            config,
            data,
        });
    })
    app.get("/codes/:type", checkMaintence, checkAuth, async (req, res) => {
        let data = await codesSchema.find()
        renderTemplate(res, req, "codeshare/codes/codelist.ejs", {
            req,
            roles,
            config,
            data,
        });
    })
    //------------------- CODE SHARE  -------------------//
    app.get("/servers", checkMaintence, async(req, res, next) => {
       let page = req.query.page || 1;
            let data = await serversdata.find() || await serversdata.find().filter(b => b.status === "Approved")
            if(page < 1) return res.redirect(`/servers`);
            if(data.length <= 0) return res.redirect("/");
            if((page > Math.ceil(data.length / 6)))return res.redirect(`/servers`);
            if (Math.ceil(data.length / 6) < 1) {
            page = 1;
          };
          let bumpdata = await bumpsdata.find();
          renderTemplate(res, req, "servers/index.ejs", {
              req,
              roles,
              config,
              data,
              page: page,
              bumpdata,
              serversdata
          });
    })
     app.get("/servers/me", checkAuth, checkMaintence, async(req, res, next) => {
      
        
             
               
               
            
                
         renderTemplate(res, req, "servers/me.ejs", {
             perms: Discord.Permissions,
              req,
              roles,
              config,
              serversdata,
              db
          });
    })
       app.get("/server/:botID", checkMaintence, async (req,res,next) => {
       
      let serverdata = await serversdata.findOne({serverID: req.params.botID});
      if(!serverdata) return res.redirect("/error?code=404&message=You entered an invalid server id.");
   
   
    
      if(serverdata.status != "Approved") {
        if(req.user.id == serverdata.ownerID || serverdata.coowners.includes(req.user.id)) {
          
          client.users.fetch(serverdata.ownerID).then(aowner => {
          
              renderTemplate(res, req, "servers/server.ejs", { req, config, serverdata, aowner, roles});
          
          });
        } else {
          res.redirect("/error?code=404&message=To edit this server, you must be one of its owners.");
        }
      } else {
       
       
    
        client.users.fetch(serverdata.ownerID).then(aowner => {
       
            renderTemplate(res, req, "servers/server.ejs", { req, config, serverdata, aowner, roles});
      
        });
      }
    });
    app.post("/server/:botID", async (req,res) => {
      let serverdata = await serversdata.findOne({serverID: req.params.botID});
      
          client.users.fetch(serverdata.ownerID).then(async owner => {
          if(bot) {
         
          } else {
          await botsdata.findOneAndDelete({ serverID: serverdata.botID })
          }
         
        })
        return res.redirect('/server/'+req.params.botID);
    })

    app.get("/server/:botID/edit", checkMaintence, checkAuth, async (req,res) => {
      let serverdata = await serversdata.findOne({serverID: req.params.botID});
      if(!serverdata) return res.redirect("/error?code=404&message=You entered an invalid server id.")
      if(req.user.id == serverdata.ownerID || botdata.coowners.includes(req.user.id)) {
        renderTemplate(res, req, "servers/server-edit.ejs", { req, config, serverdata, roles});
      } else {
        res.redirect("/error?code=404&message=To edit this server, you must be one of its owners.");
      }
    });
  
  
    app.post("/server/:botID/edit", checkMaintence, checkAuth, async (req,res) => {
      let rBody = req.body;
      let botdata = await serversdata.findOne({ serverID: req.params.botID })
      if(String(rBody['coowners']).split(',').length > 5) return res.redirect("?error=true&message=You can add up to 5 CO-Owners..")
      if(String(rBody['coowners']).split(',').includes(req.user.id)) return res.redirect("?error=true&message=You cannot add yourself to other CO-Owners.");
      await serversdata.findOneAndUpdate({serverID: req.params.botID},{$set: {
          ownerID: botdata.ownerID,
          longDesc: rBody['longDesc'],
          shortDesc: rBody['shortDesc'],
          tags: rBody['tags'],
          website: rBody['website'],
          coowners:(rBody['coowners']).split(','),
          backURL: rBody['background'],
          webhook: rBody['webhook'],
           dcwebhook: rBody['dcwebhook'],
      }
     }, function (err,docs) {})
      client.users.fetch(req.params.botID).then(a => {
          let edited = new Discord.MessageEmbed()
             .setTitle("Server Edited")
             .setDescription(`Server: ${a.username}\n Owner: <@${req.user.id}>`)
             .setFooter("Embed Logs of Administration")
      client.channels.cache.get(channels.botlog).send(edited)
      res.redirect(`?success=true&message=Your Server has been successfully edited.&serverID=${req.params.botID}`)
      })
    })
  
    app.get("/server/:botID/delete", async (req, res) => {
   
        let botdata = await serversdata.findOne({ serverID: req.params.botID })
        if(req.user.id === botdata.ownerID) {
          
          const channeltolog = client.channels.cache.get(config.channels.botlog)
          channeltolog.send(`${botdata.ownerID} has deleted Server  ${req.params.botID}`)
          await serversdata.deleteOne({ serverID: req.params.botID, ownerID: botdata.ownerID })
          return res.redirect(`/user/${req.user.id}?success=true&message=Server succesfully deleted.`)

        } else {
            return res.redirect("/error?code=404&message=You entered an invalid server id.");
        }
    })


    app.get("/bot/:botID", checkMaintence, async (req,res,next) => {
       
      let botdata = await botsdata.findOne({botID: req.params.botID});
      if(!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
          var uptimerate = db.fetch(`rate_${req.params.botID}`);
   
   if(!uptimerate)
      {
             var uptimerate = "100";
      }
      if(uptimerate)
      {
      var uptimerate = `${uptimerate}`;
      }
    var uptime = ms(db.fetch(`timefr_${req.params.botID}`) - Date.now())
    var upistime = {
      days: uptime.days,
      hours: uptime.hours,
      minutes: uptime.minutes
    };
      
      if(botdata.status != "Approved") {
        checkAuth;
        if(req.user.id == botdata.ownerID || botdata.coowners.includes(req.user.id)) {
          let coowner = new Array()
          botdata.coowners.map(a => {
              client.users.fetch(a).then(b => coowner.push(b))
          })
          client.users.fetch(botdata.ownerID).then(aowner => {
          client.users.fetch(req.params.botID).then(abot => {
              renderTemplate(res, req, "botlist/bot.ejs", { req, abot, config, botdata, coowner, aowner, roles, uptimerate, upistime, marked});
          });
          });
        } else {
          res.redirect("/error?code=404&message=To edit this bot, you must be one of its owners.");
        }
      } else {
        let coowner = new Array()
        botdata.coowners.map(a => {
            client.users.fetch(a).then(b => coowner.push(b))
        })
    
        client.users.fetch(botdata.ownerID).then(aowner => {
        client.users.fetch(req.params.botID).then(abot => {
            renderTemplate(res, req, "botlist/bot.ejs", { req, abot, config, botdata, coowner, aowner, roles, uptimerate, upistime, marked});
        });
        });
      }
      
    });
    app.post("/bot/:botID", async (req,res) => {
      let botdata = await botsdata.findOne({botID: req.params.botID});
        client.users.fetch(botdata.botID).then(async bot => {
          client.users.fetch(botdata.ownerID).then(async owner => {
          if(bot) {
          await botsdata.findOneAndUpdate({ botID: botdata.botID },{$set: { ownerName: owner.username, username: bot.username, discrim: bot.discriminator, avatar: bot.avatarURL() }})
          } else {
          await botsdata.findOneAndDelete({ botID: botdata.botID })
          }
          })
        })
        return res.redirect('/bot/'+req.params.botID);
        
    })

    app.get("/bot/:botID/edit", checkMaintence, checkAuth, async (req,res) => {
      let botdata = await botsdata.findOne({botID: req.params.botID});
      if(!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.")
      if(req.user.id == botdata.ownerID || botdata.coowners.includes(req.user.id)) {
        renderTemplate(res, req, "botlist/bot-edit.ejs", { req, config, botdata, roles});
      } else {
        res.redirect("/error?code=404&message=To edit this bot, you must be one of its owners.");
      }
    });
  
  
    app.post("/bot/:botID/edit", checkMaintence, checkAuth, async (req,res) => {
      let rBody = req.body;
      let botdata = await botsdata.findOne({ botID: req.params.botID })
      if(String(rBody['coowners']).split(',').length > 3) return res.redirect("?error=true&message=You can add up to 3 CO-Owners..")
      if(String(rBody['coowners']).split(',').includes(req.user.id)) return res.redirect("?error=true&message=You cannot add yourself to other CO-Owners.");
      await botsdata.findOneAndUpdate({botID: req.params.botID},{$set: {
          botID: req.params.botID,
          ownerID: botdata.ownerID,
          prefix: rBody['prefix'],
          longDesc: rBody['longDesc'],
          shortDesc: rBody['shortDesc'],
          tags: rBody['tags'],
          github: rBody['github'],
          website: rBody['website'],
          support: rBody['support'],
          coowners:(rBody['coowners']).split(','),
          backURL: rBody['background'],
          webhook: rBody['webhook'],
           dcwebhook: rBody['dcwebhook'],
      }
     }, function (err,docs) {})
      client.users.fetch(req.params.botID).then(a => {
          let edited = new Discord.MessageEmbed()
             .setTitle("Bot Edited")
             .setDescription(`Bot: ${a.username}\n Owner: <@${req.user.id}>`)
             .setFooter("Embed Logs of Administration")
      client.channels.cache.get(channels.botlog).send(edited)
      res.redirect(`?success=true&message=Your bot has been successfully edited.&botID=${req.params.botID}`)
      })
    })
  
    app.get("/bot/:botID/delete", async (req, res) => {
   
        let botdata = await botsdata.findOne({ botID: req.params.botID })
        if(req.user.id === botdata.ownerID || botdata.coowners.includes(req.user.id)) {
          let guild = client.guilds.cache.get(config.server.id).member(botdata.botID);
          const channeltolog = client.channels.cache.get(config.channels.botlog)
          channeltolog.send(`${botdata.ownerID} has deleted Bot  ${req.params.botID}`)
          await botsdata.deleteOne({ botID: req.params.botID, ownerID: botdata.ownerID })
          return res.redirect(`/user/${req.user.id}?success=true&message=Bot succesfully deleted.`)

        } else {
            return res.redirect("/error?code=404&message=You entered an invalid bot id.");
        }
    })
  
      //------------------- BOT LİST -------------------//
  
      //---------------- ADMIN ---------------\\
      const appsdata = require("./database/models/botlist/certificate-apps.js");
      // CERTIFICATE APP
      app.get("/certification", checkMaintence, checkAuth, async (req, res) => {
          renderTemplate(res, req, "/botlist/apps/certification.ejs", {req, roles, config})
      });
      app.get("/certification/apply", checkMaintence, checkAuth, async (req, res) => {
          const userbots = await botsdata.find({ ownerID: req.user.id })
          renderTemplate(res, req, "/botlist/apps/certificate-app.ejs", {req, roles, config, userbots})
      });
      app.post("/certification/apply", checkMaintence, checkAuth, async (req, res) => {
          const rBody = req.body;
          new appsdata({botID: rBody['bot'], future: rBody['future']}).save();
          res.redirect("/bots?success=true&message=Certificate application applied.&botID="+rBody['bot'])
          let botdata = await botsdata.findOne({ botID: rBody['bot'] })
            let approveembed1 = new Discord.MessageEmbed()
             .setTitle("Bot Certification")
             .setDescription(`Bot: ${botdata.username}\n Owner: <@${botdata.ownerID}>`)
             .setFooter("Embed Logs of Administration")
          client.channels.cache.get(channels.botlog).send(approveembed1)
      });
      //
      this.client = client;
      this.config = config;
      
      const checkAdmin = async (req, res, next) => {
      if (req.isAuthenticated()) {
           const guild = this.client.guilds.cache.get("849623732871757854") || null;
                
                const member = await guild.members.fetch(req.user.id) || null;
                if (!member) return resolve(false);
                if (
                    member.roles.cache.has("849653061893750824") ||
                    member.roles.cache.has("849653061893750824")
                )
                { return next();
              } else {
              res.redirect("/error?code=403&message=You is not competent to do this.")
          }
        } else {
      req.session.backURL = req.url;
      res.redirect("/login");
      }
      }
      
    
      app.get("/admin", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
      const botdata = await botsdata.find()
        const codedata = await codesSchema.find()
        const udata = await uptimedata.find()
        renderTemplate(res, req, "admin/index.ejs", {
            req,
            roles,
            config,
            codedata,
            botdata,
            udata
        })
      });
      // MINI PAGES
      app.get("/admin/unapproved", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
      
      renderTemplate(res, req, "admin/unapproved.ejs", {req, roles, config, botdata: await botsdata.find()})
      });
      app.get("/admin/approved", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
         
          renderTemplate(res, req, "admin/approved.ejs", {req, roles, config, botdata: await botsdata.find()})
      });
      app.get("/admin/certificate-apps", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
          const botdata = await botsdata.find()
          const apps = await appsdata.find()
          renderTemplate(res, req, "admin/certificate-apps.ejs", {req, roles, config, apps,botdata})
      });
      // SYSTEMS PAGES
  
      // CONFIRM BOT
      app.get("/admin/confirm/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
          const botdata = await botsdata.findOne({ botID: req.params.botID })
          if(!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
          if(botdata.status === "Approved")
          {
             return res.redirect("/error?code=404&message=This bot ia already approved.");
          }
          await botsdata.findOneAndUpdate({botID: req.params.botID},{$set: {
              status: "Approved",
              Date: Date.now(),
          }
         }, function (err,docs) {})
         client.users.fetch(req.params.botID).then(bota => {
           let approveembed = new Discord.MessageEmbed()
             .setTitle("Bot Approved")
             .setDescription(`Moderator: ${req.user.username}\n Bot: ${bota.username}\n Owner: <@${botdata.ownerID}>`)
             .setFooter("Embed Logs of Administration")
              client.channels.cache.get(channels.botlog).send(approveembed)
              if(client.users.cache.get(botdata.ownerID))
              {
              client.users.cache.get(botdata.ownerID).send(`Your bot named **${bota.tag}** has been approved.`)
              }
               let channel = client.channels.cache.get("850952052288520224");
  channel.send(`The bot <@${bota.id}> Has been Approved And Sr Mods and Administrators Please add the bot here. Invite link - https://discord.com/oauth2/authorize?client_id=${bota.id}&permissions=0&scope=bot`)
         });
         
         let guild = client.guilds.cache.get(config.server.id);
         if(guild.member(botdata.botID))
         {
         let bot = guild.member(botdata.botID);
        bot.roles.add(botrole)
         }
         if(guild.member(botdata.ownerID))
         {
         let owner = guild.member(botdata.ownerID);
         owner.roles.add(devrole);
         }
         if(parseInt(botdata.coowners)) {
         
             botdata.coowners.map(a => {
              
               if(guild.members.fetch(a))
               {
                 
              let coowner = guild.member(a);
              coowner.roles.add(devrole);
               }
             })
         }
         return res.redirect(`/admin/unapproved?success=true&message=Bot approved.`)
      });
      // DELETE BOT
      app.get("/admin/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
          const botdata = await botsdata.findOne({ botID: req.params.botID })
          if(!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
          let guild = client.guilds.cache.get(config.server.id)
          guild.member(botdata.botID).roles.remove(botrole);
          await guild.member(botdata.botID).kick();
          await botsdata.deleteOne({ botID: req.params.botID, ownerID: botdata.ownerID, botid: req.params.botID, status: "UnApproved" })
          return res.redirect(`/admin/approved?success=true&message=Bot deleted.`)
       });
      // DECLINE BOT
      app.get("/admin/decline/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
         const botdata = await botsdata.findOne({ botID: req.params.botID })
         if(!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
         renderTemplate(res, req, "admin/decline.ejs", {req, roles, config, botdata})
      });
      app.post("/admin/decline/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
          let rBody = req.body;
     	  let botdata = await botsdata.findOne({ botID: req.params.botID });
           client.users.fetch(botdata.ownerID).then(sahip => {
             let declineembed = new Discord.MessageEmbed()
             .setTitle("Bot Declined")
             .setDescription(`Reason: ${rBody['reason']}\n Moderator: ${req.user.username}\n Bot: ${botdata.username}\n Owner: <@${botdata.ownerID}>`)
             .setFooter("Embed Logs of Administration")
               client.channels.cache.get(channels.botlog).send(declineembed)
               if(client.guilds.cache.get(config.server.id).member(botdata.ownerID))
               {
               client.users.cache.get(botdata.ownerID).send(`Your bot named **${botdata.username}** has been declined.\nReason: **${rBody['reason']}**\nAuthorized: **${req.user.username}**`)
               }
          })
          await botsdata.deleteOne({ botID: req.params.botID, ownerID: botdata.ownerID, botid: req.params.botID, status: "UnApproved" })
          return res.redirect(`/admin/unapproved?success=true&message=Bot declined.`)
       });

       // CERTIFICATE
       app.get("/admin/certified-bots", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
          const botdata = await botsdata.find();
          renderTemplate(res, req, "admin/certified-bots.ejs", {req, roles, config, botdata})
       });
       app.get("/admin/certificate/give/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
          await botsdata.findOneAndUpdate({botID: req.params.botID},{$set: {
              certificate: "Certified",
          }
         }, function (err,docs) {})
         let botdata = await botsdata.findOne({ botID: req.params.botID });
          
          client.users.fetch(botdata.botID).then(bota => {
              client.channels.cache.get(channels.botlog).send(`<@${botdata.ownerID}>'s bot named **${bota.tag}** has been granted a certificate.`)
              if(client.guilds.cache.get(config.server.id).member(botdata.ownerID))
              {
              client.users.cache.get(botdata.ownerID).send(`Your bot named **${bota.tag}** has been certified.`)
              }
          });
          await appsdata.deleteOne({ botID: req.params.botID })
          let guild = client.guilds.cache.get(config.server.id)
          if(guild.member(botdata.botID))
          {
          let botto = guild.member(botdata.botID);
          botto.roles.add(certirole);
          }
          if(guild.member(botdata.ownerID))
          {
          let owneri = guild.member(botdata.ownerID);
          owneri.roles.add(certidevrole);
          }
          if(botdata.coowners) {
              botdata.coowners.map(a => {
                if(guild.members.cache.get(a)) {
                guild.members.cache.get(a).roles.add(certidevrole);
                }
              })
          }
          return res.redirect(`/admin/certificate-apps?success=true&message=Certificate gived.&botID=${req.params.botID}`)
       });
       app.get("/admin/certificate/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
          const botdata = await botsdata.findOne({ botID: req.params.botID })
         if(!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
         renderTemplate(res, req, "admin/certificate-delete.ejs", {req, roles, config, botdata})
       });
       app.post("/admin/certificate/delete/:botID", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
          let rBody = req.body;
          await botsdata.findOneAndUpdate({botID: req.params.botID},{$set: {
              certificate: "None",
          }
         }, function (err,docs) {})
         let botdata = await botsdata.findOne({ botID: req.params.botID });
         
          client.users.fetch(botdata.botID).then(bota => {
              client.channels.cache.get(channels.botlog).send(`<@${botdata.ownerID}>'s bot named **${bota.tag}** has been decline for a certificate.`)
              if(client.servers.cache.get(botdata.ownerID))
              {
              client.users.fetch(botdata.ownerID).send(`Your bot named **${bota.tag}** certificate application has been declined.\nReason: **${rBody['reason']}**`)
              }
          });
          await appsdata.deleteOne({ botID: req.params.botID })
          
          let guild = client.guilds.cache.get(config.server.id)
          if(guild.members.fetch(botdata.botID))
          {
          guild.member(botdata.botID).roles.remove(roles.botlist.certified_bot);
          }
          if(guild.members.fetch(botdata.ownerID))
          {
          guild.member(botdata.ownerID).roles.remove(roles.botlist.certified_developer);
          }
          return res.redirect(`/admin/certificate-apps?success=true&message=Certificate deleted.`)
       });
  
  
       // UPTIME
       // UPTIMES
       app.get("/admin/uptimes", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        let updata = await uptimeSchema.find();
        renderTemplate(res, req, "admin/uptimes.ejs", {req, roles, config, updata})
      });
      app.get("/admin/deleteuptime/:code", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        await uptimeSchema.deleteOne({ code: req.params.code })
        return res.redirect('../admin/uptimes?error=true&message=Link deleted.');
      });

      app.get("/premium", checkMaintence, checkAuth, async (req, res) => {
        client.users.fetch(req.user.id).then(async a => {
        const pdata = await profiledata.findOne({userID: a.id});
        renderTemplate(res, req, "/botlist/apps/premium.ejs", {req, roles, config, pdata})
      });
    });
     app.get("/addserver", checkMaintence, checkAuth, async (req, res) => {
        client.users.fetch(req.user.id).then(async a => {
        const pdata = await profiledata.findOne({userID: a.id});
        renderTemplate(res, req, "servers/guide.ejs", {req, roles, config, pdata})
      });
    });
     app.get("/premium/apply", checkMaintence, checkAuth, async (req, res) => {
        const userbots = await botsdata.find({ ownerID: req.user.id })
        client.users.fetch(req.user.id).then(async a => {
          const pdata = await profiledata.findOne({userID: a.id});
          if(pdata){
            if(pdata.paid != true) {
              res.redirect("/")
            }
          }else{
            res.redirect("/")
          }
        renderTemplate(res, req, "/botlist/apps/premium-app.ejs", {req, roles, config, userbots, pdata})
      });
    });
      app.get("/admin/maintence", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        let bandata = await banSchema.find();
        renderTemplate(res, req, "/admin/administrator/maintence.ejs", { req, roles, config, bandata })
      });
       app.post("/premium/apply", checkMaintence, checkAuth, async (req, res) => {
        const rBody = req.body;
        new appsdata({botID: rBody['bot'], future: rBody['future']}).save();
        res.redirect("/bots?success=true&message=premium application applied.&botID="+rBody['bot'])
        let botdata = await botsdata.findOne({ botID: rBody['bot'] })
        client.channels.cache.get(channels.botlog).send(`**[System console]**\nUser **${req.user.username}** requested premium for her bot named **${botdata.username}**.`)
    });
      const checkOwner = async (req, res, next) => {
        if (req.isAuthenticated()) {
            if(client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(roles.yonetici)) {
                next();
                } else {
                res.redirect("/error?code=403&message=You is not competent to do this.")
            }
          } else {
        req.session.backURL = req.url;
        res.redirect("/login");
        }
        }
          app.get("/admin/premium-apps", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        const botdata = await botsdata.find()
        const apps = await appsdata.find()
        renderTemplate(res, req, "admin/premium-apps.ejs", {req, roles, config, apps,botdata})
    });
    app.get("/admin/premium-bots", checkMaintence, checkOwner, checkAuth, async (req, res) => {
  const botdata = await botsdata.find();
  renderTemplate(res, req, "admin/premium-bots.ejs", {req, roles, config, botdata})
});
app.get("/admin/premium/give/:botID", checkMaintence, checkOwner, checkAuth, async (req, res) => {
  await botsdata.findOneAndUpdate({botID: req.params.botID},{$set: {
      premium: "Premium",
  }
 }, function (err,docs) {})
 let botdata = await botsdata.findOne({ botID: req.params.botID });

  client.users.fetch(botdata.botID).then(bota => {
      client.channels.cache.get(channels.botlog).send(`**[System console]**\n<@${botdata.ownerID}>'s bot named **${bota.tag}** has been granted a premium.`)
      client.users.cache.get(botdata.ownerID).send(`**[System console]**\nYour bot named **${bota.tag}** has been premium.`)
  });
  await appsdata.deleteOne({ botID: req.params.botID })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.add(roles.botlist.premium_bot);
  guild.members.cache.get(botdata.ownerID).roles.add(roles.botlist.premium_developer);
  if(botdata.coowners) {
      botdata.coowners.map(a => {
        if(guild.members.cache.get(a)) {
        guild.members.cache.get(a).roles.add(roles.botlist.premium_developer);
        }
      })
  }
  return res.redirect(`/admin/premium-apps?success=true&message=Certificate gived.&botID=${req.params.botID}`)
});
app.get("/admin/premium/delete/:botID", checkMaintence, checkOwner, checkAuth, async (req, res) => {
  const botdata = await botsdata.findOne({ botID: req.params.botID })
  if(!botdata) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
  renderTemplate(res, req, "admin/premium-delete.ejs", {req, roles, config, botdata})
});
app.post("/admin/premium/delete/:botID", checkMaintence, checkOwner, checkAuth, async (req, res) => {
  let rBody = req.body;
  await botsdata.findOneAndUpdate({botID: req.params.botID},{$set: {
      premium: "None",
  }
 }, function (err,docs) {})
 let botdata = await botsdata.findOne({ botID: req.params.botID });
  client.users.fetch(botdata.botID).then(bota => {
      client.channels.cache.get(channels.botlog).send(`**[System console]**\n<@${botdata.ownerID}>'s bot named **${bota.tag}** has not been granted a premium.`)
      client.users.cache.get(botdata.ownerID).send(`**[System console]**\nYour bot named **${bota.tag}** premium application has been declined.\nReason: **${rBody['reason']}**`)
  });
  await appsdata.deleteOne({ botID: req.params.botID })
  let guild = client.guilds.cache.get(config.server.id)
  guild.members.cache.get(botdata.botID).roles.remove(roles.botlist.premium_bot);
  guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.premium_developer);
  return res.redirect(`/admin/premium-apps?success=true&message=Certificate deleted.`)
});
 app.get("/admin/useripban", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        let banipdata = await ipbanSchema.find();
        let userdata = await profiledata.find();
        renderTemplate(res, req, "/admin/administrator/user-ipban.ejs", { req, roles, config, banipdata, userdata })
      });
      app.get("/admin/userpremium", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        let prdata = await userPremium.find();
        let userdata = await profiledata.find();
        renderTemplate(res, req, "/admin/administrator/user-premium.ejs", { req, roles, config, prdata, userdata })
      });
      app.post("/admin/userban", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        new banSchema({ user: req.body.userID, sebep: req.body.reason, yetkili: req.user.id, bannedby: req.user.username, tagg: req.user.discriminator }).save()
        profiledata.findOneAndUpdate({userID: req.body.userID},{$set: { 
          banned: true
       }}, function (err,docs) {})
        return res.redirect('../admin/userban?success=true&message=User banned.');
      });
      app.post("/admin/useripban", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        new ipbanSchema({ user: req.body.userID, sebep: req.body.reason, yetkili: req.user.id, bannedby: req.user.username, tagg: req.user.discriminator }).save()
        return res.redirect('../admin/useripban?success=true&message=User banned.');
      });
      app.post("/admin/userpremium", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        new userPremium({ user: req.body.userID, sebep: req.body.reason, yetkili: req.user.id, bannedby: req.user.username, tagg: req.user.discriminator }).save()
        profiledata.findOneAndUpdate({userID: req.body.userID},{$set: { 
          paid: true
       }}, function (err,docs) {})
        return res.redirect('../admin/userpremium?success=true&message=User premium.');
      });
      app.post("/admin/userunpremium", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        //new profiledata({ userID: req.body.userID, paid: false}).save()
        profiledata.findOneAndUpdate({userID: req.body.userID},{$set: { 
          paid: false
       }}, function (err,docs) {})
        userPremium.deleteOne({ user: req.body.userID }, function (error, user) { 
        if(error) console.log(error)
        })
        // profiledata.deleteOne({ userID: req.body.userID }, function (error, user) { 
        //   if(error) console.log(error)
        //   })
        return res.redirect('../admin/userpremium?success=true&message=User premium removed.');
      });
      app.post("/admin/userunban", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        banSchema.deleteOne({ user: req.body.userID }, function (error, user) { 
        if(error) console.log(error)
        })
        profiledata.findOneAndUpdate({userID: req.body.userID},{$set: { 
          banned: false
       }}, function (err,docs) {})
        // profiledata.deleteOne({ userID: req.body.userID }, function (error, user) { 
        //   if(error) console.log(error)
        //   })
        return res.redirect('../admin/userban?success=true&message=User ban removed.');
      });
      app.post("/admin/useripunban", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        ipbanSchema.deleteOne({ user: req.body.userID }, function (error, user) { 
        if(error) console.log(error)
        })
        // profiledata.deleteOne({ userID: req.body.userID }, function (error, user) { 
        //   if(error) console.log(error)
        //   })
        return res.redirect('../admin/useripban?success=true&message=User ban removed.');
      });
     app.get("/admin/team", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        const Database = require("void.db");
        const db = new Database(path.join(__dirname, './database/json/team.json'));
        renderTemplate(res, req, "/admin/administrator/team.ejs", { req, roles, config, db })
      });
       app.post("/admin/team", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        const Database = require("void.db");
        const db = new Database(path.join(__dirname, './database/json/team.json'));
         db.push(`team`, { 
           code: createID(12), 
           icon: req.body.icon,
           ownerID: req.body.ownerID,
           serverName: req.body.serverName,
           color:  req.body.color,
           rank:  req.body.rank,
          //  website: `https://dumbbotlist.tk/user/${req.body.Website}`,
           description: req.body.partnerDesc
         })
         let x = client.guilds.cache.get(config.server.id).members.cache.get(req.body.ownerID)
         if(x) {
           x.roles.add('848310229175500882')
           client.users.cache.get(req.body.ownerID).send(`**[System console]**\nwelcome to our team <@${req.body.ownerID}>\nyour rank is: **${req.body.rank}**.`)
         }
         return res.redirect('/admin/team?success=true&message=Team added.')
      });
      //---------------- news ---------------\\
      app.get("/admin/news", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        const Database = require("void.db");
        const db = new Database(path.join(__dirname, './database/json/news.json'));
        renderTemplate(res, req, "/admin/administrator/news.ejs", { req, roles, config, db })
      });
       app.post("/admin/news", checkMaintence, checkOwner, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        const Database = require("void.db");
        const db = new Database(path.join(__dirname, './database/json/news.json'));
        const datum =  new Date().toLocaleString();
         db.push(`news`, { 
           code: createID(12), 
           icon: req.body.icon,
           banner: req.body.banner,
           ownerID: req.body.ownerID,
           serverName: req.body.serverName,
           color:  req.body.color,
           rank:  req.body.rank,
           date: datum,
           description: req.body.partnerDesc
         })
         let rBody = req.body;
        

       const webhook = require("webhook-discord");
  
 const Hook = new webhook.Webhook("https://discordapp.com/api/webhooks/851207040247529532/j2MYjhSumvSYgWvcWi7VsVdytECmg8OXHM42UN1F-cEyjRPLpbvQIMJiQZrMyioEeh3j");
 const msg = new webhook.MessageBuilder()
 .setName('official news')
 .setAvatar(req.body.icon)
 .setTitle(req.body.serverName)
 .setDescription(`<@${req.body.ownerID}> posted a news message\n\nLink:\n[website](https://dumbbotlist.tk/news)`)
 .setFooter(`Copyright © dumbbotlist.tk official 2021`)
 Hook.send(msg);

       
         return res.redirect('/admin/news?success=true&message=News added.')
         
      });
      app.post("/admin/maintence", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        let bakimdata = await maintenceSchema.findOne({ server: config.server.id });
        if(bakimdata) return res.redirect('../admin/maintence?error=true&message=Maintenance mode has already been activated for this site.');
        client.channels.cache.get(channels.webstatus).send(`Dumb Town has been switched to __maintance__ due to **${req.body.reason}**`).then(a => { 
            new maintenceSchema({server: config.server.id, reason: req.body.reason, bakimmsg: a.id}).save();
        })
        return res.redirect('../admin/maintence?success=true&message=Maintence opened.');
      });
      app.post("/admin/unmaintence", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        const dc = require("discord.js");
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        let bakimdata = await maintenceSchema.findOne({ server: config.server.id });
        if(!bakimdata) return res.redirect('../admin/maintence?error=true&message=The website is not in maintenance mode anyway.');
        const bakimsonaerdikardesvcodes = new dc.MessageEmbed()
        .setAuthor("dumbbotlist.tk", client.user.avatarURL())
        .setThumbnail(client.user.avatarURL())
        .setColor("GREEN")
        .setDescription(`Dumb Town are **active** again!\n[Click to view Website](https://dumbbotlist.tk)`)
        .setFooter("Dumb Town © All rights reserved.");
        await client.channels.cache.get(channels.webstatus).messages.fetch(bakimdata.bakimmsg).then(a => { a.edit(`Dumb Town has been switched to maintance due to **${bakimdata.reason}** `, bakimsonaerdikardesvcodes) } )
        client.channels.cache.get(channels.webstatus).send(".").then(b => { b.delete({ timeout: 500 })})
        await maintenceSchema.deleteOne({server: config.server.id}, function (error, server) { 
        if(error) console.log(error)
        });
        return res.redirect('../admin/maintence?success=true&message=Maintenance mode has been shut down successfully.');
      });
      app.get("/admin/userban", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        let bandata = await banSchema.find();
        renderTemplate(res, req, "/admin/administrator/user-ban.ejs", { req, roles, config, bandata })
      });
      app.post("/admin/userban", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        new banSchema({ user: req.body.userID, sebep: req.body.reason, yetkili: req.user.id }).save()
        return res.redirect('../admin/userban?success=true&message=User banned.');
      });
      app.post("/admin/userunban", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        banSchema.deleteOne({ user: req.body.userID }, function (error, user) { 
        if(error) console.log(error)
        })
        return res.redirect('../admin/userban?success=true&message=User ban removed.');
      });
    
      app.get("/admin/partners", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        const Database = require("void.db");
        const db = new Database(path.join(__dirname, './database/json/partners.json'));
        renderTemplate(res, req, "/admin/administrator/partners.ejs", { req, roles, config, db })
      });
       app.post("/admin/partners", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        if(!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
        const Database = require("void.db");
        const db = new Database(path.join(__dirname, './database/json/partners.json'));
         db.push(`partners`, { 
           code: createID(12), 
           icon: req.body.icon,
           ownerID: req.body.ownerID,
           serverName: req.body.serverName,
           website: req.body.Website,
           description: req.body.partnerDesc
         })
         let x = client.guilds.cache.get(config.server.id).members.cache.get(req.body.ownerID)
         if(x) {
           x.roles.add(config.roles.profile.partnerRole)
         }
         return res.redirect('/admin/partners?success=true&message=Partner added.')
      });
        // CODE SHARE
    app.get("/admin/codes", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        let koddata = await codesSchema.find();
        renderTemplate(res, req, "admin/codes.ejs", {
            req,
            roles,
            config,
            koddata
        })
    });
    // ADDCODE
    app.get("/admin/addcode", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        renderTemplate(res, req, "admin/addcode.ejs", {
            req,
            roles,
            config
        })
    });
    app.post("/admin/addcode", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        const rBody = req.body;
        let kod = makeid(5);
        await new codesSchema({
            code: kod,
            codeName: rBody['codename'],
            codeCategory: rBody['category'],
            codeDesc: rBody['codedesc'],
        }).save()
        if (rBody['main']) {
            await codesSchema.updateOne({
                code: kod
            }, {
                $set: {
                    main: req.body.main
                }
            });
        }
        if (rBody['commands']) {
            await codesSchema.updateOne({
                code: kod
            }, {
                $set: {
                    commands: req.body.commands
                }
            });
        }
        client.channels.cache.get(channels.codelog).send(new Discord.MessageEmbed()
            .setTitle("New code added!").setColor("GREEN").setFooter("Code System")
            .setDescription(`The user named **[${req.user.username}](https://dumbbotlist.tk/user/${req.user.id})** added the code named **${rBody['codename']}** to the system.`)
            .addField("Code Link", `https://dumbbotlist.tk/code/${kod}`, true)
            .addField("Code Description", rBody['codedesc'], true)
            .addField("Code Category", rBody['category'], true)
        )
        res.redirect('/code/' + kod)
    });

    // EDITCODE
    app.get("/admin/editcode/:code", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        let kod = req.params.code;
        let koddata = await codesSchema.findOne({
            code: kod
        })
        if (!koddata) return res.redirect('/codes?error=true&message=You entered an invalid code.')
        renderTemplate(res, req, "admin/editcode.ejs", {
            req,
            roles,
            config,
            koddata
        })
    });
    app.post("/admin/editcode/:code", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        const rBody = req.body;
        let kod = req.params.code;
        await codesSchema.findOneAndUpdate({
            code: kod
        }, {
            $set: {
                codeName: rBody['codename'],
                codeCategory: rBody['category'],
                codeDesc: rBody['codedesc'],
                main: rBody['main'],
                commands: rBody['commands'],
            }
        }, function(err, docs) {})
        client.channels.cache.get(channels.codelog).send(new Discord.MessageEmbed()
            .setTitle("Code edited!").setColor("GREEN").setFooter(config.footer)
            .setDescription(`The user named **[${req.user.username}](https://dumbbotlist.tk/user/${req.user.id})** edited the code named **${rBody['codename']}**.`)
            .addField("Code Link", `https://vcodes.xyz/code/${kod}`, true)
            .addField("Code Description", rBody['codedesc'], true)
            .addField("Code Category", rBody['category'], true)
        )
        res.redirect('/code/' + kod)
    });
    // DELETECODE
    app.get("/admin/deletecode/:code", checkMaintence, checkAdmin, checkAuth, async (req, res) => {
        await codesSchema.deleteOne({
            code: req.params.code
        })
        return res.redirect('/admin/codes?error=true&message=Code deleted.');
    });
      //---------------- ADMIN ---------------\\
  
    //------------------- PROFILE -------------------//
    
    const profiledata = require("./database/models/profile.js");
      app.get("/user/:userID", checkMaintence, async (req, res) => {
        client.users.fetch(req.params.userID).then(async a => {
            let codecount = await codesSchema.find({
                sharer: a.id
            })
            const pdata = await profiledata.findOne({
                userID: a.id
            });
            const botdata = await botsdata.find()
            const member = a;
            const uptimecount = await uptimedata.find({
                userID: a.id
            });
            const serverdata = await serversdata.find()
            renderTemplate(res, req, "profile/profile.ejs", {
                member,
                req,
                roles,
                config,
                codecount,
                uptimecount,
                pdata,
                botdata,
                serverdata
            });
        });
    });
     app.get("/:botID", async(req, res) => {
         
      let test = await vanitysdata.findOne({username: req.params.botID });
    if(test)
    {
      let finded = await botsdata.findOne({botID: test.ID});
      let secend = await serversdata.findOne({serverID: test.ID});
      if(!finded && !secend)
      {
        return res.redirect("/");
      }
      if(finded)
      {
      res.redirect(`https://discord.com/oauth2/authorize?client_id=${finded.botID}&permissions=8&scope=bot`);
      } else if(secend)
      {
        res.redirect(secend.invitelink);
      }
    } else {
      return res.redirect("/");
    }
    })
    
    app.get("/user/:userID/edit", checkMaintence, checkAuth, async (req, res) => {
      client.users.fetch(req.user.id).then(async member => {
      const pdata = await profiledata.findOne({userID: member.id});
      renderTemplate(res, req, "profile/profile-edit.ejs", {member, req, roles, config, pdata, member});
      });
    });
    app.post("/user/:userID/edit", checkMaintence, checkAuth, async (req, res) => {
      let rBody = req.body;
        await profiledata.findOneAndUpdate({userID: req.user.id}, {$set: {
            biography: rBody['biography'],
            website: rBody['website'],
            github: rBody['github'],
            twitter: rBody['twitter'],
            instagram: rBody['instagram']
            }}, 
            {
                upsert:true
            }
            )
      return res.redirect('?success=true&message=Your profile has been successfully edited.');
    });
    //------------------- PROFILE -------------------//
    app.set('json spaces', 1)
   //------------------- API  -------------------//
    app.get("/api", async (req, res) => {
      res.json({ "Hello": "World", "Template by": "dumbbotlist.tk"});
    });
    const { Canvas, resolveImage } = require("canvas-constructor");
     app.get("/api/embed/:id", async (req, res) => {
  const bot = await botsdata.findOne({ botID: req.params.id });
  if (!bot) return res.sendStatus(404);
  try {
    let owner = client.users.cache.get(bot.ownerID);
    let geting = client.users.cache.get(req.params.id);
    var forav = geting.displayAvatarURL();
    var forav = forav.replace(".webp", ".png")
        let avatar = await resolveImage(forav);
   

    
//      .setTextFont('bold 35px sans')
//  .setTextFont('bold 12px Verdana')
//   
//  
const { registerFont } = require("canvas");
registerFont('COMIC.ttf', { family: 'BOLD 15px' })
    let img = new Canvas(500, 250)
      .setColor("#404E5C")
      .printRectangle(0, 0, 500, 250)
      .setColor("#DCE2F9")
  
      .printText(bot.username, 120, 75)
      .printRoundedImage(avatar, 30, 30, 70, 70, 20)
      .setTextAlign("left")
    
      img.printText(`${bot.serverCount || "N/A"} Servers | ${bot.votes} Votes`, 30, 125);
   
    img
      .printText(`Prefix: ${bot.prefix}`, 30, 145)
    
      .printWrappedText(bot.shortDesc, 30, 175, 440, 15)
      
     
      .printText(owner.username, 10, 245)
      .setTextAlign("right")
      .printText("https://dumbbotlist.tk", 490, 245);

    res.writeHead(200, {
      "Content-Type": "image/png"
    });
    res.end(await img.toBuffer(), "binary");
  } catch (e) {
    throw e
    res.sendStatus(500);
  }
});
    app.get("/api/bots/:botID", async (req, res) => {
      const botinfo = await botsdata.findOne({ botID: req.params.botID })
      if(!botinfo) return res.json({ "error": "You entered invalid bot id."})
      res.json({ 
      avatar: botinfo.avatar,
      botID: botinfo.botID, 
      username: botinfo.username, 
      discrim: botinfo.discrim,
      shortDesc: botinfo.shortDesc,
      prefix: botinfo.prefix,
      votes: botinfo.votes,
      ownerID: botinfo.ownerID,
      owner: botinfo.ownerName,
      coowners: botinfo.coowners,
      tags: botinfo.tags,
      longDesc: botinfo.longDesc,
      certificate: botinfo.certificate,
      github: botinfo.github,
      support: botinfo.support,
      website: botinfo.website,
      });
    });
    
    app.get("/api/bots/check/:userID", async (req, res) => {
        let token = req.header('Authorization');
        if(!token) return res.json({"error": "You must enter a bot token."})
        if(!req.params.userID) return res.json({"error": "You must enter a user id."})
        const botdata = await botsdata.findOne({ token: token })
        if(!botdata) return res.json({"error": "You enter an invalid bot token."})
        const vote = await voteSchema.findOne({ bot: botdata.botID, user: req.params.userID })
        if(vote) {
            res.json({ voted: true });
        } else {
            res.json({ voted: false });
        }
    });

    app.post("/api/bots/stats", async (req, res) => {
        let token = req.header('Authorization');
        if(!token) return res.json({"error": "You must enter a bot token."})
        const botdata = await botsdata.findOne({ token: token })
        if(!botdata) return res.json({"error": "You enter an invalid bot token."})
        let count = req.header('serverCount');
        if(!count)
        {
          return res.json({"error": "You must enter a Servers Count."})
        }
        if(botdata) {
             await botsdata.update({botID: botdata.botID},{$set:{ serverCount: req.header('serverCount') }})
             if(req.header("users") )
             {
    await botsdata.update({botID: botdata.botID},{$set:{ users: req.header('users') }})
             }
             return res.json({"status": "Successfully Posted"})
        }
    });
     app.post("/api/private/bots/search", async (req, res) => {
       let user = req.header("userid");
       if(!user)
       {
         return res.json({"error": "You must enter a userid."})
       }
       let check = await profiledata.findOne({userID: user});
       if(!check)
       {
         return res.json({"error": "You must enter a valid userid."})
       }
      
       let token = req.header('Authorization');
    
       if(check.token !== token)
       {
          return res.json({"error": "You must enter a valid token."})
       }
      
         let x = await botsdata.find()
         if(req.header('tag'))
         {
          var data1 = await x.filter(a => 
            a.status == "Approved" &&  a.tags.includes(req.header('tag')))
         } else {

           let count = req.header('name');
        if(!count)
        {
          return res.json({"error": "You must enter a name to search."})
        }
          var data1 = await x.filter(a => a.status == "Approved" &&  a.username.includes(req.header('name')))
         }
         
          if(!data1[0])
          {
            return res.json({"error": "No Bots Found with this Description or Bot Name" })
          }
        var data1 = data1[req.header('number')];
       
        if(!data1)
        {
           var data1 = await x.filter(a => a.status == "Approved" &&  a.username.includes(req.header('name')) || a.shortDesc.includes(req.header('name')))
           data1.forEach(dat => {
 res.json({'avatar': dat.avatar,
      'botID': dat.botID, 
      'username': `${dat.username}${dat.discrim}`, 
      'shortDesc':dat.shortDesc,
      'prefix': dat.prefix,
      'votes': dat.votes,
      'ownerID': dat.ownerID,
      'owner': dat.ownerName,
      'tags': dat.tags,
      'certificate': dat.certificate,
      'github': dat.github,
      'support': dat.support,
      'website': dat.website})
           })
           return;
        }
       
        if(data1) {
             
             return  res.json({'avatar': data1.avatar,
      'botID': data1.botID, 
      'username': data1.username, 
      'discrim': data1.discrim,
      'shortDesc':data1.shortDesc,
      'prefix': data1.prefix,
      'votes': data1.votes,
      'ownerID': data1.ownerID,
      'owner': data1.ownerName,
      'coowners': data1.coowners,
      'tags': data1.tags,
      'longDesc': data1.longDesc,
      'certificate': data1.certificate,
      'github': data1.github,
      'support': data1.support,
      'website': data1.website})
        }
    });
    //------------------- API -------------------//    //------------------- API -------------------//
    app.listen(44455)
    app.use((req, res) => {
        res.status(404).redirect("/")
    });
  };
  
  function makeid(length) {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }
      function createID(length) {
      var result           = '';
      var characters       = '123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }
  
  function makeidd(length) {
      var result           = '';
      var characters       = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }
   function makeToken(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
  function getuser(id) {
  try {
  return client.users.fetch(id)
  } catch (error) {
  return undefined
  }
  } 
  
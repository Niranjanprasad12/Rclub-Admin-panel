const mongoose = require('mongoose')
const express = require("express");
const ejs = require("ejs");
const lodash = require("lodash");
require("dotenv").config();
const Member = require("./models/memberList");
const Log = require("./models/log")
const Update  = require("./models/updates")
const { response } = require('express');
app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


function getTimeAndDate(){
  var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();  
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  return dateTime
}

function getDate(){
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;
  return today
}

//mongodb atlas connection uri...

const connectionUri = "mongodb+srv://Team15:"+process.env.PASSWORD+"@miniprojectdb.alac4.mongodb.net/attendanceDb?retryWrites=true&w=majority";

mongoose.connect(connectionUri)
.then((result)=>{
  console.log("connected to db");
  app.listen(process.env.PORT || 3000);
})
.catch((err)=>console.log(err));

app.get('/',(req,res)=>{
  date = getDate();
  Member.countDocuments({})
  .then((ct)=>{
    Update.find().sort({updatedAt:-1})
    .then((updates)=>{
      console.log(updates);
      Log.find({status:"out"}).sort({createdAt:-1})
      .then((logs)=>{
        Log.countDocuments({status:"in"})
        .then((inside)=>{
          Log.findOne().sort({updatedAt:-1})
          .then((result)=>{
            Member.findOne().sort({updatedAt:-1})
            .then((lastUpdateMember)=>{
              Log.countDocuments({})
              .then((visits)=>{
                res.render("index",{date:date,memberCount:ct,updates:updates,logs:logs,inside:inside,lastUpdatedInside:result.updatedAt,lastUpdatedMember:lastUpdateMember.updatedAt,visits:visits})
              })
            })
          })
        })
        .catch((err)=>{
          console.log(err)
        })
      })
      .catch((err)=>[
        console.log(err)
      ])
    })
    .catch((err)=>{
      console.log(err)
    })
      
    })
  .catch((err)=>{
    console.log(err)
  })
})

app.get("/addmember",(req,res)=>{
  Member.countDocuments({})
  .then((ct)=>{
    res.render('form',{add:"active",remove:"none",title:"Add member", route:"addmember",memberCount:ct})
  })
  
  .catch((err)=>{
    console.log(err)
  })
})

app.get("/removemember",(req,res)=>{
  Member.countDocuments({})
  .then((ct)=>{
    res.render('form',{remove:"active",add:"none", title:"Remove member", route:"removemember",memberCount:ct})
  })
  
  .catch((err)=>{
    console.log(err)
  })
})

app.get("/memberlist",(req,res)=>{
  Member.countDocuments({})
  .then((ct)=>{
    Member.find()
    .then((result)=>{res.render('memberlist',{datas:result,memberCount:ct});})
    .catch((err)=>{console.log(err)});})
  
  .catch((err)=>{
    console.log(err)
  })

})

app.get("/details",(req,res)=>{      // api for the rpi to get the member details.......
  Member.find()
  .then((result)=>{res.send(result)})
  .catch((err)=>{console.log(err)})
})


app.post("/addmember",(req,res)=>{
  console.log(req.body);

  const newMember = new Member({
    name:req.body.name, 
    rollNumber:req.body.rollno,
    designation:req.body.designation,
    department:req.body.department,
    clubId: req.body.clubid,
    email:req.body.email,
    year:req.body.year
  })

  newMember.save()
  .then(()=>{
    console.log("New user added successfully");
    const newUpdate = new Update({
      name:req.body.name,
      activity:"Added as a " + req.body.designation +" of the club",
      time:getTimeAndDate()
    })

    newUpdate.save()
    .then(()=>{
      res.redirect("/addmember")
    })
    .catch((err)=>{
      console.log(err)
    })
  })
  .catch((err)=>{
    console.log(err)
  })

})


app.post("/removemember",(req,res)=>{
  console.log(req.body);
  Member.deleteOne({clubId:req.body.clubid})
  .then(()=>{
    console.log("Member removed successfully");
    const newUpdate = new Update({
      name:req.body.name,
      activity:"has been removed from the club",
      time:getTimeAndDate()
    })

    newUpdate.save()
    .then(()=>{
      res.redirect("/removemember");
    })
    .catch((err)=>{
      console.log(err)
    })
  })
  .catch((err)=>{
    console.log(err);
  })
})


app.get("/log",(req,res)=>{   // for log out time we need the status so we need the log in python file that's why we created this route
  Log.find()
  .then((result)=>{
    res.send(result);
  })
  .catch((err)=>{
    console.log(err)
  })
})


app.post("/log",(req,res)=>{   // for logging the in and out time details in the log database we created this post route...
  console.log(req.body)
  if (req.body.status === "out"){
    console.log('hello')
    console.log(req.body._id)
    Log.deleteOne({_id:req.body._id})
    .then(()=>{
      const newLog = new Log({
        date:req.body.date,
        name:req.body.name,
        status:req.body.status,
        clubId:req.body.clubId,
        rollNumber:req.body.rollNumber,
        inTime:req.body.inTime,
        outTime:req.body.outTime
      })
      newLog.save()
      .then(()=>{
        console.log("Log details saved successfully");
        const newUpdate = new Update({
          name:req.body.name,
          activity:"left the club room.",
          time:getTimeAndDate()
        })

        newUpdate.save()
        .then(()=>{
          res.sendStatus(200)
        })
        .catch((err)=>{
          console.log(err)
        })
      })
      .catch((err)=>{
        console.log(err)
      })

    })
    .catch((err)=>{
      console.log(err)
    })



 
  }else{
    const newLog = new Log({
      date:req.body.date,
      name:req.body.name,
      status:req.body.status,
      clubId:req.body.uid,
      rollNumber:req.body.rollNo,
      inTime:req.body.inTime,
      outTime:req.body.outTime
    })
  
    newLog.save()
    .then(()=>{
      console.log("Log details saved successfully")
      const newUpdate = new Update({
        name:req.body.name,
        activity:"entered into the club room.",
        time:getTimeAndDate()
      })

      newUpdate.save()
      .then(()=>{
        res.sendStatus(200)
      })
      .catch((err)=>{
        console.log(err)
      })
    })
    .catch((err)=>{
      console.log(err)
    })
  
  }


})





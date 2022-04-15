const express = require('express');
const router = express.Router();
const Pusher = require('pusher');
const vote = require('../models/vote');
const pusherKey = require('../config/keys');


const pusher = new Pusher(pusherKey.pusherKey);

router.get('/',(req,res)=>{
    vote.find().then(votes => res.json({success:true, votes: votes}))
});

router.post('/', (req,res)=>{
    // console.log(req.body);

    const newVote = {
        tech: req.body.tech,
        points: 1,
    }
    
    vote.findOne({tech: newVote.tech})
      .then(data=>{
          if(data){
            //   console.log("found ",data);
             vote.findOneAndUpdate({tech:data.tech},{$set:{points: parseInt(data.points)+1}})
               .then()
               .catch(err=>console.log(err));
          }else{
            new vote(newVote).save().then( vote =>{
                pusher.trigger('tech-poll', "tech-vote", {
                    points: parseInt(vote.points),
                    tech: vote.tech
                });
            });
        }
      })    

    

    return res.json({sucess: true, message: 'You Voted SuccesFully'});
});

module.exports = router;
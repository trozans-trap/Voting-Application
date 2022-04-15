const express = require('express');
const router = express.Router();
const Pusher = require('pusher');
const mongoose = require('mongoose');
const vote = require('../models/vote');
const pusherKey = require('../config/keys');

const pusher = new Pusher(pusherKey.pusherKey);

router.get('/',(req,res)=>{
    vote.find().then(votes =>{
        res.json({success:true, votes: votes})
        // console.log("Get",votes);
    });

});

router.post('/', (req,res)=>{

    const newVote = {
        tech: req.body.tech,
        points: 1,
    }
    console.log("in post",newVote);
    vote.findOne({tech: newVote.tech})
      .then(data=>{
          if(data){
            //   console.log("found ",data);
            vote.findOneAndUpdate({tech:data.tech},{$set:{points: parseInt(data.points)+1}})
               .then(vote =>{
                   console.log("update",vote,parseInt(data.points)+1);
                pusher.trigger('tech-poll', 'tech-vote', {
                    points: parseInt(data.points)+1,
                    tech: vote.tech
                })})
               .catch(err=>console.log(err));
               return res.json({sucess: true, message: 'You Voted SuccesFully,*'});

          }else{
            vote(newVote).save().then( vote =>{
                pusher.trigger('tech-poll', 'tech-vote', {
                    points: parseInt(vote.points),
                    tech: vote.tech
                });
            return res.json({sucess: true, message: 'You Voted SuccesFully#'});

            });
        }
      });    


});

module.exports = router;
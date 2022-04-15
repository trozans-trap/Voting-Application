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
    });

});

router.post('/', (req,res)=>{
    const tech = req.body.tech;
    const points = 1;
    vote.findOne({tech: tech})
      .then(data=>{
          if(data){
            vote.findOneAndUpdate({tech:data.tech},{$set:{points: parseInt(data.points)+1}})
               .then(vote =>{
                pusher.trigger('tech-poll', 'tech-vote', {
                    points: parseInt(vote.points)+1,
                    tech: vote.tech
                })})
               .catch(err=>console.log(err));
               return res.json({sucess: true, message: 'You Voted SuccesFully,*'});

          }else{
            
            const newVote = new vote({
                tech,
                points
            });
              newVote.save().then( vote =>{
                  console.log("in new",vote);
                pusher.trigger('tech-poll', 'tech-vote', {
                    points: parseInt(vote.points)+1,
                    tech: vote.tech
                })})
                .catch(err=>console.log(err));
                return res.json({sucess: true, message: 'You Voted SuccesFully,#'});
        }
      });    


});

module.exports = router;
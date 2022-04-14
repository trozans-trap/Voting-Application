const express = require('express');
const router = express.Router();
const Pusher = require('pusher');

const pusher = new Pusher({
    
  });

router.get('/',(req,res)=>{
    res.send('Vote');
});

router.post('/', (req,res)=>{
    pusher.trigger('os-poll', "os-vote", {
          points: 1,
          os: req.body.os
      });

    return res.json({sucess: true, message: 'You Voted SuccesFully'});
});

module.exports = router;
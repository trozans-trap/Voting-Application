const express = require('express');
const router = express.Router();
const Pusher = require('pusher');

const pusher = new Pusher({
    
  });

router.get('/',(req,res)=>{
    res.send('Vote');
});

router.post('/', (req,res)=>{
    console.log("hello");
    console.log(req.body);
    pusher.trigger('tech-poll', "tech-vote", {
          points: 1,
          tech: req.body.tech
      });

    return res.json({sucess: true, message: 'You Voted SuccesFully'});
});

module.exports = router;
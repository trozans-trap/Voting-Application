const form = document.getElementById('voteForm');
form.addEventListener('submit',e=>{
    const vote = document.querySelector('input[name=tech]:checked').value;
    const data = {tech: vote};
    console.log("value",vote);
    fetch('http://localhost:8123/vote',{
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
     .then(res => res.json())
     .then(data => console.log(data))
     .catch(err=>console.log(err));
    e.preventDefault();
})

fetch('http://localhost:8123/vote')
  .then(res =>res.json())
  .then(data => {
      const votes = data.votes;
      const totalVotes = votes.length;
        let votesCounts = {
            frontEnd: 0,
            backEnd: 0,
            devOps: 0,
            tester: 0,
            qaEngineer: 0
        };

      votesCounts = votes.reduce(
          (acc,vote) =>(
            (acc[vote.tech] = (acc[vote.tech] || 0) + parseInt(vote.points)),acc
           ),
           {}
        );
        console.log("cnt",votesCounts);
      let dataPoints = [
        {label: 'Front End', y:votesCounts.frontEnd},
        {label: 'Back End', y:votesCounts.backEnd},
        {label: 'DevOps', y:votesCounts.devOps},
        {label: 'Tester', y:votesCounts.tester},
        {label: 'Qa Engineer', y:qaEngineer},
    ]
    
    const graph = document.querySelector('#graph')
    
    if(graph){
        const chart = new CanvasJS.Chart('graph', {
            animationEnabled: true,
            theme: 'theme1',
            title: {
                text: `Total Votes ${totalVotes}`
            },
            data: [
                {
                    type: 'column',
                    dataPoints: dataPoints
                }
            ]
        });
        chart.render();
    
        Pusher.logToConsole = true;
    
        var pusher = new Pusher('7396bd12fbbbbcb6fdc1', {
          cluster: 'ap2'
        });
    
        var channel = pusher.subscribe('tech-poll');
        channel.bind('tech-vote', function(data) {
          dataPoints = dataPoints.map(x=>{
              if(x.label == data.tech){
                  x.y +=data.points;
              }
              return x;
          })
        });
    }
    })


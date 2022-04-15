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
     .catch(err => console.log(err));

    e.preventDefault();
})

fetch('http://localhost:8123/vote')
  .then(res =>res.json())
  .then(data => {
      const votes = data.votes;
      

      
        let votesCounts = {
            FrontEnd: 0,
            BackEnd: 0,
            DevOps: 0,
            Tester: 0,
            QaEngineer: 0
        };

      votesCounts = votes.reduce(
          (acc,vote) =>(
            (acc[vote.tech] = (acc[vote.tech] || 0) + parseInt(vote.points)),acc
           ),
           {}
        );
        console.log("cntVote",votesCounts);
        let totalVotes = parseInt(votesCounts.FrontEnd)+parseInt(votesCounts.BackEnd)+parseInt(votesCounts.DevOps)+parseInt(votesCounts.Tester)+parseInt(votesCounts.QaEngineer);
        document.querySelector('#votesTotal').textContent = `Total Votes: ${totalVotes}`;
      
        // console.log("cnt",parseInt(votesCounts);
      let dataPoints = [
        {label: 'FrontEnd', y:votesCounts.FrontEnd},
        {label: 'BackEnd', y:votesCounts.BackEnd},
        {label: 'DevOps', y:votesCounts.DevOps},
        {label: 'Tester', y:votesCounts.Tester},
        {label: 'QaEngineer', y:votesCounts.QaEngineer},
    ]
    
    const graph = document.querySelector('#graph')
    
    if(graph){
        const chart = new CanvasJS.Chart('graph', {
            animationEnabled: true,
            theme: 'theme2',
            title: {},
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
          cluster: 'ap2',
          encrypted: true
        });
    
        var channel = pusher.subscribe('tech-poll');
        channel.bind('tech-vote', (data) => {
          dataPoints.forEach(x=>{
              if(x.label == data.tech){
                  x.y =x.y+1;
                  totalVotes+=parseInt(data.points);
              }
          });
          chart.render();
        });
      }
    })


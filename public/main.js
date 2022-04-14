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

let dataPoints = [
    {label: 'Front End', y:0},
    {label: 'Back End', y:0},
    {label: 'DevOps', y:0},
    {label: 'Tester', y:0},
    {label: 'Qa Engineer', y:0},
]

const graph = document.querySelector('#graph')

if(graph){
    const chart = new CanvasJS.Chart('graph', {
        animationEnabled: true,
        theme: 'theme1',
        title: {
            text: 'Tech Results'
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
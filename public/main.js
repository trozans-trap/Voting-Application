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
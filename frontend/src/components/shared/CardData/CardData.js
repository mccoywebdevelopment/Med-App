import React from 'react';
import Chart from 'chart.js';

class CardData extends React.Component {
    componentDidMount = () =>{
        var ctx = document.getElementsByClassName('myChart');
        for(var i=0;i<ctx.length;++i){
            var myChart = new Chart(ctx[i], {
                type: 'doughnut',
                data: {
                    labels: ['Dependents', 'Users'],
                    datasets: [{
                        label: '# of Votes',
                        data: [(20+i),(9-i)],
                        backgroundColor: [
                            '#2196f3',
                            '#FCB031'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    // scales: {
                    //     yAxes: [{
                    //         ticks: {
                    //             beginAtZero: true
                    //         }
                    //     }]
                    // }
                }
            });
        }
    }
    render() {
        return (
            <div class="card" style={{height:'100%',width:'100%'}}>
                <div class="card-body">
                    <div class="d-flex justify-content-between pb-3">
                        <h4 class="card-title mb-0">McCoy House</h4>
                        <p class="mb-0 text-muted">20 Dependents, 5 Users</p>
                    </div>
                    <canvas className="myChart"></canvas>
                    {/* <ul class="timeline">
                        <li class="timeline-item">
                            <p class="timeline-content"><a href="#">Ben Tossell</a> assign you a task</p>
                            <p class="event-time">Just now</p>
                        </li>
                        <li class="timeline-item">
                            <p class="timeline-content"><a href="#">Ben Tossell</a> assign you a task</p>
                            <p class="event-time">Just now</p>
                        </li>
                        <li class="timeline-item">
                            <p class="timeline-content"><a href="#">Ben Tossell</a> assign you a task</p>
                            <p class="event-time">Just now</p>
                        </li>
                        <li class="timeline-item">
                            <p class="timeline-content"><a href="#">Ben Tossell</a> assign you a task</p>
                            <p class="event-time">Just now</p>
                        </li>
                        <li class="timeline-item">
                            <p class="timeline-content"><a href="#">Ben Tossell</a> assign you a task</p>
                            <p class="event-time">Just now</p>
                        </li>
                    </ul> */}
                        <a class="d-block mt-3" href="#">Show More</a>
                        </div>
                        </div>
        )
    }
}

export default CardData;
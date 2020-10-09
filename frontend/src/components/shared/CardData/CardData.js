import React from 'react';
import Chart from 'chart.js';

class CardData extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        var ctx = document.getElementById('myChartGroup' + this.props.index);
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.props.labels,
                datasets: [{
                    data: this.props.data,
                    backgroundColor: this.props.colors,
                    borderWidth: 1
                }]
            }
        });

    }
    render() {
        return (
            <div className="card" style={{ height: '100%', width: '100%' }}>
                <div className="card-body">
                    <div className="d-flex justify-content-between pb-3">
                        <h4 className="card-title mb-0">{this.props.title}</h4>
                        <p className="mb-0 text-muted" style={{fontSize:'12px'}}>{this.props.details}</p>
                    </div>
                    <canvas id={"myChartGroup" + this.props.index}></canvas>
                    <a className="d-block mt-3" href={this.props.href}>Show More</a>
                </div>
            </div>
        )
    }
}

export default CardData;
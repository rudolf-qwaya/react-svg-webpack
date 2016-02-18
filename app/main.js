const React = require('react');
const ReactDOM = require('react-dom');
const request = require('then-request');
require("./style.css");

const stations = {
    nw: ['Kän', 'Khä', 'Jkb', 'Bkb', 'Spå', 'Sub'],
    ne: ['Nvk', 'Hgv', 'Sol', 'Hel', 'Udl', 'So'],
    c: ['Ke', 'Cst', 'Sst', 'Åbe', 'Äs'],
    sw: ['Sta', 'Hu', 'Flb', 'Tul', 'Tu', 'Rön', 'Öte', 'Söd'],
    se: ['Fas', 'Tåd', 'Skg', 'Hnd', 'Jbo', 'Vhe', 'Kda', 'Ts']
};

const Station = React.createClass({
    render: function () {
        var s = 'translate(' + this.props.x + ' ' + this.props.y + ')';
        var style = {
            fontSize: 12,
            fontWeight: 'bold',
            fill: 'black'
        };
        return <g transform={s}>
            <rect x="-16" y="-12" width="32" height="24" fill="yellow"/>
            <text x="0" y="5" style={style} textAnchor="middle">{this.props.location}</text>
        </g>
    }
});

const Stations = React.createClass({
    render: function () {
        const a = stations.c;
        const p = this.props;
        const dx = (p.x2 - p.x1) / (a.length - 1);
        const dy = (p.y2 - p.y1) / (a.length - 1);

        return <g>
            <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke="lightsteelblue" strokeWidth="12"/>
            {a.map((location, i) => <Station key={location} location={location} x={p.x1 + dx * i} y={p.y1 + dy * i}/>)}
        </g>
    }
});

const Navs = React.createClass({
    getInitialState: function () {
        return {
            secondsElapsed: 0,
            stations: []
        }
    },
    tick: function () {
        this.setState({secondsElapsed: this.state.secondsElapsed + 1})
    },
    setStations: function (stations) {
        this.setState({stations: stations})
    },
    componentDidMount: function () {
        //this.interval = setInterval(this.tick, 1000)
    },
    componentWillUnmount: function () {
        clearInterval(this.interval)
    },
    render: function () {
        return <svg version="1.1" baseProfile="full" width="600" height="800" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="darkslategray"/>
            <Stations x1={100} y1={100} x2={300} y2={700}/>
        </svg>
    }
});

ReactDOM.render(<Navs />, document.getElementById('content'));

const React = require('react');
const ReactDOM = require('react-dom');
const request = require('then-request');
const _ = require('lodash');

require("./style.css");

const stations = {
    nw: ['Kän', 'Khä', 'Jkb', 'Bkb', 'Spå', 'Sub'],
    ne: ['Nvk', 'Hgv', 'Sol', 'Hel', 'Udl', 'So'],
    c: ['Ke', 'Cst', 'Sst', 'Åbe', 'Äs'],
    sw: ['Söd', 'Öte', 'Rön', 'Tu', 'Tul', 'Flb', 'Hu', 'Sta'],
    se: ['Ts', 'Kda', 'Vhe', 'Jbo', 'Hnd', 'Skg', 'Tåd', 'Fas']
};

const Station = React.createClass({
    render: function () {
        var s = 'translate(' + this.props.x + ' ' + this.props.y + ')';
        const current = this.props.current[this.props.location];
        var style = {
            fontSize: current ? 10 : 12,
            fontWeight: 'bold',
            fill: current ? 'green' : 'black'
        };
        return <g transform={s}>
            <rect x="-32" y="-12" width="64" height="24" fill="yellow"/>
            <text x="0" y="5" style={style}
                  textAnchor="middle">{current || this.props.location}</text>
        </g>
    }
});

const Stations = React.createClass({
    render: function () {
        const p = this.props;
        const a = p.locations;
        const dx = (p.x2 - p.x1) / (a.length - (p.end || 0));
        const dy = (p.y2 - p.y1) / (a.length - (p.end || 0));

        return <g>
            <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke="lightsteelblue" strokeWidth="12"/>
            {a.map((location, i) => <Station key={location} current={this.props.current} location={location}
                                             x={p.x1 + dx * i} y={p.y1 + dy * i}/>)}
        </g>
    }
});

const Navs = React.createClass({
    getInitialState: function () {
        return {
            secondsElapsed: 0,
            current: {}
        }
    },
    tick: function () {
        this.setState({secondsElapsed: this.state.secondsElapsed + 1})
    },
    setCurrent: function (current) {
        this.setState({current: current})
    },
    componentDidMount: function () {
        //this.interval = setInterval(this.tick, 1000)
    },
    componentWillUnmount: function () {
        clearInterval(this.interval)
    },
    render: function () {
        const ke = 250;
        const as = 450;

        return <svg version="1.1" baseProfile="full" width="600" height="800" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="darkslategray"/>
            <Stations current={this.state.current} locations={stations.nw} x1={50} y1={50} x2={300} y2={ke}/>
            <Stations current={this.state.current} locations={stations.ne} x1={550} y1={50} x2={300} y2={ke}/>
            <Stations current={this.state.current} locations={stations.sw} x2={300} y2={as} x1={50} y1={750}/>
            <Stations current={this.state.current} locations={stations.se} x2={300} y2={as} x1={550} y1={750}/>
            <Stations current={this.state.current} locations={stations.c} end={1} x1={300} y1={ke} x2={300} y2={as}/>
        </svg>
    }
});

const navs = ReactDOM.render(<Navs />, document.getElementById('content'));

function handleCurrent(obj) {
    const announcements = _.first(obj.RESPONSE.RESULT).TrainAnnouncement;
    console.log(announcements.length, 'announcements');
    const value = _(announcements)
        .groupBy('AdvertisedTrainIdent')
        .map((group, key) => _.sortBy(group, 'TimeAtLocation'))
        .map(_.last)
        .map(train => [train.LocationSignature, _.first(train.ToLocation).LocationName + train.ActivityType.substr(0, 3) + train.TimeAtLocation.substr(11, 5)])
        .zipObject()
        .value();
    navs.setCurrent(value);
}

require('then-request')('GET', 'api/current').done(response => handleCurrent(JSON.parse(response.body)));
console.log('request sent');

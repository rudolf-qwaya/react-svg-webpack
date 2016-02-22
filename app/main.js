const React = require('react');
const ReactDOM = require('react-dom');
const request = require('then-request');
const _ = require('lodash');

require("./style.css");
const groupByCurrentLocation = require('./groupByCurrentLocation');

const stations = {
    nw: ['Kän', 'Khä', 'Jkb', 'Bkb', 'Spå', 'Sub'],
    ne: ['Nvk', 'Hgv', 'Sol', 'Hel', 'Udl', 'So'],
    c: ['Ke', 'Cst', 'Sst', 'Åbe', 'Äs'],
    sw: ['Söd', 'Öte', 'Rön', 'Tu', 'Tul', 'Flb', 'Hu', 'Sta'],
    se: ['Ts', 'Kda', 'Vhe', 'Jbo', 'Hnd', 'Skg', 'Tåd', 'Fas']
};

const TrainsAtStation = React.createClass({
    render: function () {
        const lineHeight = 13;
        return <g transform={'translate(0 ' + (lineHeight / 2 - this.props.current.length * 2) + ')'}>
            {_.map(this.props.current,
                (train, i) =>
                    <text key={train.AdvertisedTrainIdent}
                          x={this.props.textAnchor === 'end' ? -16 : 16}
                          y={lineHeight * i}
                          fontSize={lineHeight}
                          fill="white"
                          textAnchor={this.props.textAnchor}>
                        {_.first(train.ToLocation).LocationName + ' ' + train.ActivityType.substr(0, 3) + train.TimeAtLocation.substr(11, 5)}
                    </text>)}
        </g>
    }
});

const Station = React.createClass({
    render: function () {
        var style = {
            fontSize: 10,
            fontWeight: 'bold',
            fill: 'black',
            textAnchor: 'middle'
        };
        return <g transform={'translate(' + this.props.x + ' ' + this.props.y + ')'}>
            <rect x="-12" y="-8" width="24" height="16" fill="yellow"/>
            <text x="0" y="4" style={style}>{this.props.location}</text>
            <TrainsAtStation current={this.props.current[this.props.location] || []}
                             textAnchor={this.props.textAnchor}/>
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
            <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke="lightsteelblue" strokeWidth="6"/>
            {a.map((location, i) => {
                const x = p.x1 + dx * i;
                const y = p.y1 + dy * i;
                return <Station key={location} current={this.props.current}
                                textAnchor={x < 120 || x > 240 && x < 360 ? 'start' : 'end'}
                                location={location} x={x} y={y}/>
            })}
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
        const ke = 192;
        const as = 384;
        const margin = 24;

        return <svg version="1.1" baseProfile="full" viewBox="0 0 480 640" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="darkslategray"/>
            <Stations current={this.state.current} locations={stations.nw} x1={margin} y1={margin} x2={240} y2={ke}/>
            <Stations current={this.state.current} locations={stations.ne} x1={480 - margin} y1={margin} x2={240} y2={ke}/>
            <Stations current={this.state.current} locations={stations.sw} x2={240} y2={as} x1={margin} y1={640 - margin}/>
            <Stations current={this.state.current} locations={stations.se} x2={240} y2={as} x1={480 - margin} y1={640 - margin}/>
            <Stations current={this.state.current} locations={stations.c} end={1} x1={240} y1={ke} x2={240} y2={as}/>
        </svg>
    }
});

const navs = ReactDOM.render(<Navs />, document.getElementById('content'));

function handleCurrent(obj) {
    const announcements = _.first(obj.RESPONSE.RESULT).TrainAnnouncement;
    console.log(announcements.length, 'announcements');
    navs.setCurrent(groupByCurrentLocation(announcements));
}

require('then-request')('GET', 'api/current').done(response => handleCurrent(JSON.parse(response.body)));
console.log('request sent');

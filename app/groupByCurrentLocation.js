const _ = require('lodash');

module.exports = function groupByCurrentLocation(announcements) {
    return _(announcements)
        .groupBy('AdvertisedTrainIdent')
        .map(group => _.sortBy(group, 'TimeAtLocation'))
        .map(_.last)
        .groupBy('LocationSignature')
        .mapValues(trains => _.map(trains, train => _.first(train.ToLocation).LocationName + train.ActivityType.substr(0, 3) + train.TimeAtLocation.substr(11, 5)))
        .value();
};

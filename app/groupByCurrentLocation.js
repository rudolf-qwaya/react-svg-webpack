const _ = require('lodash');

module.exports = function groupByCurrentLocation(announcements) {
    return _(announcements)
        .groupBy('AdvertisedTrainIdent')
        .map(group => _.sortBy(group, 'TimeAtLocation'))
        .map(_.last)
        .groupBy('LocationSignature')
        .value();
};

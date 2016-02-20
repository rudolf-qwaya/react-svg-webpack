const groupByCurrentLocation = require('../app/groupByCurrentLocation');

describe("groupByCurrentLocation", function () {
    it("returns empty object", function () {
        expect(groupByCurrentLocation()).toEqual({});
    });

    it("returns latest TimeAtLocation for a train", function () {
        expect(groupByCurrentLocation([
            {
                "ActivityType": "Ankomst",
                "AdvertisedTrainIdent": "2264",
                "LocationSignature": "Ke",
                "ToLocation": [{"LocationName": "U"}],
                "TimeAtLocation": "2016-02-18T20:41:00"
            }, {
                "ActivityType": "Avgang",
                "AdvertisedTrainIdent": "2264",
                "LocationSignature": "Cst",
                "ToLocation": [{"LocationName": "U"}],
                "TimeAtLocation": "2016-02-18T20:39:00"
            }]
        )).toEqual({Ke: ['UAnk20:41']});
    });

    it("two trains at same station", function () {
        expect(groupByCurrentLocation([
                {
                    "ActivityType": "Ankomst",
                    "AdvertisedTrainIdent": "2264",
                    "LocationSignature": "Ke",
                    "ToLocation": [{"LocationName": "U"}],
                    "TimeAtLocation": "2016-02-18T20:41:00"
                }, {
                    "ActivityType": "Avgang",
                    "AdvertisedTrainIdent": "2264",
                    "LocationSignature": "Cst",
                    "ToLocation": [{"LocationName": "U"}],
                    "TimeAtLocation": "2016-02-18T20:39:00"
                }, {
                    "ActivityType": "Ankomst",
                    "AdvertisedTrainIdent": "2565",
                    "LocationSignature": "Ke",
                    "ToLocation": [{"LocationName": "Vhe"}],
                    "TimeAtLocation": "2016-02-18T20:42:00"
                }, {
                    "ActivityType": "Avgang",
                    "AdvertisedTrainIdent": "2565",
                    "LocationSignature": "Sub",
                    "ToLocation": [{"LocationName": "Vhe"}],
                    "TimeAtLocation": "2016-02-18T20:39:00"
                }
            ]
        )).toEqual({Ke: ['UAnk20:41', 'VheAnk20:42']});
    });
});
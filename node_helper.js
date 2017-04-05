/* Magic Mirror
 * Module: MMM-MLBstandings
 *
 * By Cowboysdude
 * 
 */
const NodeHelper = require('node_helper');
const request = require('request');


module.exports = NodeHelper.create({
        
    start: function() {
        console.log("Starting module: " + this.name);
    },
    
    getStandings: function(url) {
        request({
            url: "https://erikberg.com/mlb/standings.json",
            method: 'GET',
            headers: {
                'User-Agent': 'MagicMirror/1.0 (' + this.config.email + ')'
            }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
            	var data = {};
                var result = JSON.parse(body).standing;
                data.AL = this.filterStandings(result, "AL");
                data.NL = this.filterStandings(result, "NL");
				this.sendSocketNotification("STANDINGS_RESULTS", {standings: data});
			}
        });
    },
    
    filterStandings: function(standings, conference) {
		const filtered = standings.filter((result) => result.conference === conference);
		return {
			E: filtered.filter((result) => result.division === "E" ),
			C: filtered.filter((result) => result.division === "C" ),
			W: filtered.filter((result) => result.division === "W" )
		};
	},

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
        } else if (notification === "GET_STANDINGS") {
            this.getStandings();
        }
    }

});

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
                var result = JSON.parse(body).standing;
                if (result.filter((result) => result.conference === "AL")){
        this.americanEast = result.filter((result) => result.division === "E" );
        this.americanCen = result.filter((result) => result.division === "C" );
        this.americanWest = result.filter((result) => result.division === "W" );
  console.log(this.americanWest);      
        }
                if (result.filter((result) => result.conference === "NL")){
		this.nationale = result.filter((result) => result.division === "E" );
        this.nationalc = result.filter((result) => result.division === "C" );
        this.nationalw = result.filter((result) => result.division === "W" );	
		}
    this.sendSocketNotification("STANDINGS_RESULTS", {AmericanE: this.americanEast, AmericanC: this.americanCen, AmericanW: this.americanWest,        Nationale: this.nationale, Nationalc: this.nationalc, Nationalw: this.nationalw});
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
        } else if (notification === "GET_STANDINGS") {
            this.getStandings();
        }
    }

});
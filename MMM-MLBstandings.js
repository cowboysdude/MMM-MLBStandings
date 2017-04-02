/* Magic Mirror
 * Module: MMM-MLBstandings
 *
 * By cowboysdude
 * 
 */
Module.register("MMM-MLBstandings", {

    // Module config defaults.
    defaults: {
        updateInterval: 2 * 60 * 1000, // every 2 minutes
        animationSpeed: 10,
        initialLoadDelay: 2500, // 2.5 seconds delay
        retryDelay: 1500,
        maxWidth: "100%",
        fadeSpeed: 5,
        header: true,
        rotateInterval: 20 * 1000
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    getStyles: function() {
        return ["MMM-MLBstandings.css"];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);
        // Set locale.
        this.week = "";
        this.americanEast = {};
        this.nationale = {};
        this.americanCen = {};
        this.nationalc = {};
        this.americanWest = {};
        this.nationalw = {};
        this.today = "";
        this.activeItem = 0;
        this.updateInterval = null;
        this.scheduleUpdate();
    },
    
    scheduleCarousel: function() {
       		console.log("Scheduling History items");
	   		this.rotateInterval = setInterval(() => {
				this.activeItem++;
				this.updateDom(this.config.animationSpeed);
			}, this.config.rotateInterval);
	   },

    scheduleUpdate: function() {
        this.updateInterval = setInterval(() => {
            this.getStandings();
        }, this.config.updateInterval);
        this.getStandings(this.config.initialLoadDelay);
        var self = this;
    },

    getStandings: function() {
        this.sendSocketNotification("GET_STANDINGS", this.american, this.national);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "STANDINGS_RESULTS") {
        	this.americanEast = payload.AmericanE;
            this.nationale = payload.Nationale;
            this.americanCen = payload.AmericanC;
            this.nationalc = payload.Nationalc;
            this.americanWest = payload.AmericanW;
            this.nationalw = payload.Nationalw;
    console.log(this.nationalw);
            if(this.rotateInterval == null){
			   	this.scheduleCarousel();
			   }
               this.updateDom(this.config.animationSpeed);
         }
         this.updateDom(this.config.initialLoadDelay);
     },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (this.config.header === true) {
            var header = document.createElement("header");
            header.classList.add("header");
            if (this.config.logo === true) {
                header.innerHTML = "<img class='emblem' src='modules/MMM-MLB/icons/mlb.png'>    MLB Scores     " + moment().format('MM/DD/YYYY');
            } else {
                header.innerHTML = " MLB Scores     " + moment().format('MM/DD/YYYY');
            }
            wrapper.appendChild(header);
        }

           

            var top = document.createElement("div");
            top.classList = "xsmall bright thin";

            // Table creation below

            var gameTable = document.createElement("table");

            var firstrow = document.createElement("tr");

            var teamcolumn = document.createElement("th");
            teamcolumn.setAttribute("colspan", 4);
            teamcolumn.classList.add("status");
            teamcolumn.innerHTML = "Team";

            firstrow.appendChild(teamcolumn);
            gameTable.appendChild(firstrow);

            var winscolumn = document.createElement("th");
            winscolumn.setAttribute("colspan", 4);
            winscolumn.classList.add("r");
            winscolumn.innerHTML = "W";
            firstrow.appendChild(winscolumn);
            gameTable.appendChild(firstrow);

            var losscolumn = document.createElement("th");
            losscolumn.setAttribute("colspan", 4);
            losscolumn.classList.add("h");
            losscolumn.innerHTML = "L";
            firstrow.appendChild(losscolumn);
            gameTable.appendChild(firstrow);

            var gbcolumn = document.createElement("th");
            gbcolumn.setAttribute("colspan", 4);
            gbcolumn.classList.add("h");
            gbcolumn.innerHTML = "GB";
            firstrow.appendChild(gbcolumn);
            gameTable.appendChild(firstrow);

            var wpcolumn = document.createElement("th");
            wpcolumn.setAttribute("colspan", 4);
            wpcolumn.classList.add("h");
            wpcolumn.innerHTML = "W%";
            firstrow.appendChild(wpcolumn);
            gameTable.appendChild(firstrow);

            var gpcolumn = document.createElement("th");
            gpcolumn.setAttribute("colspan", 4);
            gpcolumn.classList.add("h");
            gpcolumn.innerHTML = "GP";
            firstrow.appendChild(gpcolumn);

            var tencolumn = document.createElement("th");
            tencolumn.setAttribute("colspan", 4);
            tencolumn.classList.add("h");
            tencolumn.innerHTML = "L10";
            firstrow.appendChild(tencolumn);

            var streakcolumn = document.createElement("th");
            streakcolumn.setAttribute("colspan", 4);
            streakcolumn.classList.add("h");
            streakcolumn.innerHTML = "Streak";
            firstrow.appendChild(streakcolumn);


            gameTable.appendChild(firstrow);


            //-----------------------------------//
            //         Data goes here            //
            //-----------------------------------//
            
            for (var i = 0; i < this.americanCen.length; i++) {
                var standings = this.americanCen[i];
           

                var standingTemp = document.createElement("tr");

                  if (standings.division === "E") {
            

                    var standingTempColumn = document.createElement("td");
            var teamImg = '<img class="logo" src="modules/MMM-MLBstandings/icons/' + standings.last_name + '.png"> ' + standings.first_name + " " + standings.last_name;
                    var teamImg = teamImg;
                    standingTempColumn.setAttribute("colspan", 4);
                    standingTempColumn.classList.add("rows");
                    standingTempColumn.innerHTML = teamImg;
                    standingTemp.appendChild(standingTempColumn);
                    gameTable.appendChild(standingTemp);

                    var winsColumn = document.createElement("td");
                    winsColumn.setAttribute("colspan", 4);
                    winsColumn.innerHTML = standings.won;
                    standingTemp.appendChild(winsColumn);
                    gameTable.appendChild(standingTemp);

                    var lossColumn = document.createElement("td");
                    lossColumn.setAttribute("colspan", 4);
                    lossColumn.innerHTML = standings.lost;
                    standingTemp.appendChild(lossColumn);
                    gameTable.appendChild(standingTemp);

                    var gbColumn = document.createElement("td");
                    gbColumn.setAttribute("colspan", 4);
                    gbColumn.innerHTML = standings.games_back;
                    standingTemp.appendChild(gbColumn);
                    gameTable.appendChild(standingTemp);

                    var wpColumn = document.createElement("td");
                    wpColumn.setAttribute("colspan", 4);
                    wpColumn.innerHTML = standings.win_percentage;
                    standingTemp.appendChild(wpColumn);
                    gameTable.appendChild(standingTemp);

                    var gpColumn = document.createElement("td");
                    gpColumn.setAttribute("colspan", 4);
                    gpColumn.innerHTML = standings.games_played;
                    standingTemp.appendChild(gpColumn);
                    gameTable.appendChild(standingTemp);

                    var tenColumn = document.createElement("td");
                    tenColumn.setAttribute("colspan", 4);
                    tenColumn.innerHTML = standings.last_ten;
                    standingTemp.appendChild(tenColumn);
                    gameTable.appendChild(standingTemp);

                    var streakColumn = document.createElement("td");
                    streakColumn.setAttribute("colspan", 4);
                    streakColumn.innerHTML = standings.streak;
                    standingTemp.appendChild(streakColumn);
                    gameTable.appendChild(standingTemp);
                    
                    var emptyRow = document.createElement("tr");
                    var emptyColumn = document.createElement("td");
                    emptyRow.setAttribute("colspan", 4);
                    emptyRow.innerHTML = "";
                    standingTemp.appendChild(emptyColumn);
                    gameTable.appendChild(standingTemp);
           //     }
             }
            if (standings.division === "C") {
     
             var standing2Temp = document.createElement("tr");

                    var standing2TempColumn = document.createElement("td");
            var teamImg = '<img class="logo" src="modules/MMM-MLBstandings/icons/' + standings.last_name + '.png"> ' + standings.first_name + " " + standings.last_name;
                    var teamImg = teamImg;
                    standing2TempColumn.setAttribute("colspan", 4);
                    standing2TempColumn.classList.add("rows");
                    standing2TempColumn.innerHTML = teamImg;
                    standing2Temp.appendChild(standing2TempColumn);
                    gameTable.appendChild(standing2Temp);

                    var winsColumn = document.createElement("td");
                    winsColumn.setAttribute("colspan", 4);
                    winsColumn.innerHTML = standings.won;
                    standing2Temp.appendChild(winsColumn);
                    gameTable.appendChild(standing2Temp);

                    var lossColumn = document.createElement("td");
                    lossColumn.setAttribute("colspan", 4);
                    lossColumn.innerHTML = standings.lost;
                    standing2Temp.appendChild(lossColumn);
                    gameTable.appendChild(standing2Temp);

                    var gbColumn = document.createElement("td");
                    gbColumn.setAttribute("colspan", 4);
                    gbColumn.innerHTML = standings.games_back;
                    standing2Temp.appendChild(gbColumn);
                    gameTable.appendChild(standing2Temp);

                    var wpColumn = document.createElement("td");
                    wpColumn.setAttribute("colspan", 4);
                    wpColumn.innerHTML = standings.win_percentage;
                    standing2Temp.appendChild(wpColumn);
                    gameTable.appendChild(standing2Temp);

                    var gpColumn = document.createElement("td");
                    gpColumn.setAttribute("colspan", 4);
                    gpColumn.innerHTML = standings.games_played;
                    standing2Temp.appendChild(gpColumn);
                    gameTable.appendChild(standing2Temp);

                    var tenColumn = document.createElement("td");
                    tenColumn.setAttribute("colspan", 4);
                    tenColumn.innerHTML = standings.last_ten;
                    standing2Temp.appendChild(tenColumn);
                    gameTable.appendChild(standing2Temp);

                    var streakColumn = document.createElement("td");
                    streakColumn.setAttribute("colspan", 4);
                    streakColumn.innerHTML = standings.streak;
                    standing2Temp.appendChild(streakColumn);
                    gameTable.appendChild(standing2Temp);
                    
                    var emptyRow = document.createElement("tr");
                    var emptyColumn = document.createElement("td");
                    emptyRow.setAttribute("colspan", 4);
                    emptyRow.innerHTML = "";
                    standing2Temp.appendChild(emptyColumn);
                    gameTable.appendChild(standing2Temp);
           //     }
             }
             
              if (standings.division === "W") {
     
             var standing2Temp = document.createElement("tr");

                 

                    var standing2TempColumn = document.createElement("td");
            var teamImg = '<img class="logo" src="modules/MMM-MLBstandings/icons/' + standings.last_name + '.png"> ' + standings.first_name + " " + standings.last_name;
                    var teamImg = teamImg;
                    standing2TempColumn.setAttribute("colspan", 4);
                    standing2TempColumn.classList.add("rows");
                    standing2TempColumn.innerHTML = teamImg;
                    standing2Temp.appendChild(standing2TempColumn);
                    gameTable.appendChild(standing2Temp);

                    var winsColumn = document.createElement("td");
                    winsColumn.setAttribute("colspan", 4);
                    winsColumn.innerHTML = standings.won;
                    standing2Temp.appendChild(winsColumn);
                    gameTable.appendChild(standing2Temp);

                    var lossColumn = document.createElement("td");
                    lossColumn.setAttribute("colspan", 4);
                    lossColumn.innerHTML = standings.lost;
                    standing2Temp.appendChild(lossColumn);
                    gameTable.appendChild(standing2Temp);

                    var gbColumn = document.createElement("td");
                    gbColumn.setAttribute("colspan", 4);
                    gbColumn.innerHTML = standings.games_back;
                    standing2Temp.appendChild(gbColumn);
                    gameTable.appendChild(standing2Temp);

                    var wpColumn = document.createElement("td");
                    wpColumn.setAttribute("colspan", 4);
                    wpColumn.innerHTML = standings.win_percentage;
                    standing2Temp.appendChild(wpColumn);
                    gameTable.appendChild(standing2Temp);

                    var gpColumn = document.createElement("td");
                    gpColumn.setAttribute("colspan", 4);
                    gpColumn.innerHTML = standings.games_played;
                    standing2Temp.appendChild(gpColumn);
                    gameTable.appendChild(standing2Temp);

                    var tenColumn = document.createElement("td");
                    tenColumn.setAttribute("colspan", 4);
                    tenColumn.innerHTML = standings.last_ten;
                    standing2Temp.appendChild(tenColumn);
                    gameTable.appendChild(standing2Temp);

                    var streakColumn = document.createElement("td");
                    streakColumn.setAttribute("colspan", 4);
                    streakColumn.innerHTML = standings.streak;
                    standing2Temp.appendChild(streakColumn);
                    gameTable.appendChild(standing2Temp);
                    
                    var emptyRow = document.createElement("tr");
                    var emptyColumn = document.createElement("td");
                    emptyRow.setAttribute("colspan", 4);
                    emptyRow.innerHTML = "";
                    standing2Temp.appendChild(emptyColumn);
                    gameTable.appendChild(standing2Temp);
           //     }
             }
             
            top.appendChild(gameTable);
            wrapper.appendChild(top);
        }
     
     
     
        return wrapper;
    },
});
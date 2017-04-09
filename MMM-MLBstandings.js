/* Magic Mirror
 * Module: MMM-MLBstandings
 *
 * By cowboysdude
 * 
 */
Module.register("MMM-MLBstandings", {

    // Module config defaults.
    defaults: {
        updateInterval: 60 * 60 * 1000, // every 60 minutes
        animationSpeed: 10,
        initialLoadDelay: 2500, // 2.5 seconds delay
        retryDelay: 1500,
        maxWidth: "100%",
        fadeSpeed: 5,
        header: true,
        rotateInterval: 5 * 1000
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
        this.conferences = ["AL", "NL"];
        this.divisions = ["E", "C", "W"];
        this.today = "";
        this.activeItem = 0;
        this.updateInterval = null;
        this.scheduleUpdate();
    },
    
    scheduleCarousel: function(){
       		console.log("Scheduling Standings data");
	   		this.rotateInterval = setInterval(() => {
				this.activeItem++;
				if(this.activeItem >= 6) {
					this.activeItem = 0;
				}
				this.updateDom(this.config.animationSpeed);
			}, this.config.rotateInterval);
			
	   },

    scheduleUpdate: function() {
        this.updateInterval = setInterval(() => {
            this.getStandings();
        }, this.config.updateInterval);
        this.getStandings(this.config.initialLoadDelay);
    },

    getStandings: function() {
        this.sendSocketNotification("GET_STANDINGS");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "STANDINGS_RESULTS") {
        	this.standings = payload.standings
            this.loaded = true
            if(this.rotateInterval == null){
			   	this.scheduleCarousel();
			   }
               this.updateDom(this.config.animationSpeed);
         
         	}
         this.updateDom(this.config.initialLoadDelay);
         
     },

    getDom: function() {
        var self = this;
          
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;
        
        if (!this.loaded) {
            wrapper.innerHTML = "Getting your data...<img src='modules/MMM-MLBStandings/icons/loading.gif' width='22' height='22'>";
            wrapper.className = "bright light xsmall";
            return wrapper;
        }

        if (this.config.header === true) {
            var header = document.createElement("header");
            header.classList.add("header");
            if (this.config.logo === true) {
    header.innerHTML = "<img class='emblem' src='modules/MMM-MLB/icons/mlb.png'>    MLB Scores     " + moment().format('MM/DD/YYYY');
            } else {
                header.innerHTML = " MLB Standings as of:      " + moment().format('MM/DD/YYYY');
            }
            wrapper.appendChild(header);
        }

            var top = document.createElement("div");
            top.classList = "xsmall bright thin";
             
/////////////////////////////////////////////////////////////////////
/////////////////// Table creation below ////////////////////////////
/////////////////////////////////////////////////////////////////////
            
            var gameTable = document.createElement("table");
            var firstrow = document.createElement("tr");

            var teamcolumn = document.createElement("th");
            teamcolumn.setAttribute("colspan", 2);
            teamcolumn.classList.add("status");
            teamcolumn.innerHTML = "";

            firstrow.appendChild(teamcolumn);
            gameTable.appendChild(firstrow);
            
            var cdcolumn = document.createElement("th");
            cdcolumn.classList.add("alignth");
            cdcolumn.innerHTML = "C~D";
            firstrow.appendChild(cdcolumn);
            gameTable.appendChild(firstrow);

            var winscolumn = document.createElement("th");
            winscolumn.classList.add("alignth");
            winscolumn.innerHTML = "W";
            firstrow.appendChild(winscolumn);
            gameTable.appendChild(firstrow);

            var losscolumn = document.createElement("th");
            losscolumn.classList.add("alignth");
            losscolumn.innerHTML = "L";
            firstrow.appendChild(losscolumn);
            gameTable.appendChild(firstrow);

            var gbcolumn = document.createElement("th");
            gbcolumn.classList.add("alignth");
            gbcolumn.innerHTML = "GB";
            firstrow.appendChild(gbcolumn);
            gameTable.appendChild(firstrow);

            var wpcolumn = document.createElement("th");
            wpcolumn.classList.add("alignth");
            wpcolumn.innerHTML = "W%";
            firstrow.appendChild(wpcolumn);
            gameTable.appendChild(firstrow);

            var gpcolumn = document.createElement("th");
            gpcolumn.classList.add("alignth");
            gpcolumn.innerHTML = "GP";
            firstrow.appendChild(gpcolumn);

            var tencolumn = document.createElement("th");
            tencolumn.classList.add("alignth");
            tencolumn.innerHTML = "L10";
            firstrow.appendChild(tencolumn);

            var streakcolumn = document.createElement("th");  
            streakcolumn.classList.add("alignth");          
            streakcolumn.innerHTML = "Streak";
            firstrow.appendChild(streakcolumn);
            
            gameTable.appendChild(firstrow);
            
            //-----------------------------------//
            //         DATA GOES HERE            //
            //-----------------------------------//
              
            var conference = this.conferences[this.activeItem < 3 ? 0 : 1];
            var division = this.divisions[this.activeItem % 3];
            var standings = this.standings[conference][division];
            
            for (var i = 0; i < standings.length; i++) { 
			gameTable.appendChild(this.createStandingDataRow(standings[i]));
			}
            top.appendChild(gameTable);
            wrapper.appendChild(top);
     
        return wrapper;
    },
    
    createStandingDataRow: function(data) {
		
		var row = document.createElement("tr");

        var iconColumn = document.createElement("td");
        var icon = document.createElement("img");
        icon.classList.add("logo");
        icon.src = "modules/MMM-MLBstandings/icons/" + data.last_name + ".png";
        iconColumn.appendChild(icon);
        row.appendChild(iconColumn);

        var teamColumn = document.createElement("td");
        teamColumn.innerHTML = data.first_name + " " + data.last_name;
        row.appendChild(teamColumn);
        
        var cdColumn = document.createElement("td");
        cdColumn.classList.add("align");
        cdColumn.innerHTML = data.conference+ "~" +data.division;
        row.appendChild(cdColumn);

        var winsColumn = document.createElement("td");
        winsColumn.classList.add("align");
        winsColumn.innerHTML = data.won;
        row.appendChild(winsColumn);
        
        var lossColumn = document.createElement("td");
        lossColumn.classList.add("align");
        lossColumn.innerHTML = data.lost;
        row.appendChild(lossColumn);
        
        var gbColumn = document.createElement("td");
        gbColumn.classList.add("align");
        gbColumn.innerHTML = data.games_back;
        row.appendChild(gbColumn);
        
        var wpColumn = document.createElement("td");
        wpColumn.classList.add("align");
        wpColumn.innerHTML = data.win_percentage;
        row.appendChild(wpColumn);
        
        var gpColumn = document.createElement("td");
        gpColumn.classList.add("align");
        gpColumn.innerHTML = data.games_played;
        row.appendChild(gpColumn);
        
        var tenColumn = document.createElement("td");
        tenColumn.classList.add("align");
        tenColumn.innerHTML = data.last_ten;
        row.appendChild(tenColumn);
        
        var streakColumn = document.createElement("td");
        streakColumn.classList.add("align");
        streakColumn.innerHTML = data.streak;
        row.appendChild(streakColumn);
        
		return row;
	},
	
});

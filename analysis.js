var app = new Vue({
    el: '#app',
    created: function() {
        var self = this;
        this.$http.get('/fields.json').then(function(resp) {
            self.defaults = resp.body
        });
        this.$http.get('/api').then(function(response) {
            this.rawData = JSON.parse(response.body)
        });
        setInterval(this.update, 3000);
    },
    data: {
        team: "",
        defaults: {},
        rawData: {},
        data: [],
        s: window.ss,
        _: _,
    },
    methods: {
        update: function() {
            this.$http.get('/api').then(function(response) {
                this.rawData = JSON.parse(response.body)
            });
        },
        openRaw: function(raw, team) {
            //console.log(raw)
            swal({ title: team, html: "<pre>" + JSON.stringify(raw) + "</pre>" })
        },
        submit: function() {
            //generate statistics, with actual comments because I am a good programmer.
            //I also wont understand this without comments
            var team = {}
            matches = _.filter(this.rawData, ["team", Number(this.team)]) //finding all the matches that match the team number
            matches = _.sortBy(_.uniqBy(matches, 'match'), "match"); //make sure only one match per robot, and sort it
            for (var i = matches.length - 1; i >= 0; i--) {
                var obj = JSON.parse(JSON.stringify(this.defaults));
                for (var key in matches[i]) {
                    if (matches[i].hasOwnProperty(key)) {
                        obj[key] = matches[i][key]
                    }
                }
                matches[i] = obj;
                for (var key in matches[i]) {
                    if (matches[i].hasOwnProperty(key)) {
                        (team[key] = team[key] || []).unshift(matches[i][key]);
                    }
                }
            }
            this.team = ""
            //at this point, we have a team object with all of the data about a team, ordered by match number
            this.data.unshift(this.analyze(team))
        },
        analyze: function(team){
            console.log(team)
            return team;
        },
    },
    components: {
        'matches': {
            template: "#match",
            props: ['d'],
        }
    }
})
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
        showRank: false,
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
        getTeam: function(number){
             //generate statistics, with actual comments because I am a good programmer.
            //I also wont understand this without comments
            var team = {}
            matches = _.filter(this.rawData, ["team", Number(number)]) //finding all the matches that match the team number
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
            return this.analyze(team)
        },
        submit: function() {   
            //at this point, we have a team object with all of the data about a team, ordered by match number
            this.data.unshift(this.getTeam(this.team))
            this.team = ""
        },
        analyze: function(team){
            console.log(team)
            hangArr = []
            for (var i = 0; i < team.hang.length; i++) {
                team.hang[i];
            }
            ss.mean(hangArr)

            team.rankScore = ((ss.mean(team.a_scale_cubes).toFixed(2)*9)+(ss.mean(team.a_switch_cubes).toFixed(2)*7)+(ss.mean(team.scale_cubes).toFixed(2)*7)+(ss.mean(team.switch_cubes).toFixed(2)*5)+(ss.mean(team.def_cubes).toFixed(2)*2)+(ss.mean(team.vault_cubes).toFixed(2)*4)).toFixed(2);

            return team;
        },
    },
    computed: {
        getAllTeams: function(){
            teams = []
            teamList = _.map(_.uniqBy(this.rawData, 'team'), "team");
            teamList = teamList.filter(Boolean)
            console.log(teamList)
            for (var i = teamList.length - 1; i >= 0; i--) {
                teams.push(this.getTeam(teamList[i]))
            }
            return _.sortBy(teams, function(o) { return -o.rankScore; })
        },
    },
    components: {
        'matches': {
            template: "#match",
            props: ['d'],
        }
    }
})

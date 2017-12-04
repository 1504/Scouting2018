var app = new Vue({
    el: '#app',
    created: function() {
        this.$http.get('/api').then(function(response) {
            this.rawData = JSON.parse(response.body)
        });
        setInterval(this.update, 3000);
    },
    data: {
        team: "",
        rawData: {},
        data: [],
        ss: window.ss
    },
    methods: {
        update: function() {
            this.$http.get('/api').then(function(response) {
                this.rawData = JSON.parse(response.body)
            });
        },
        openRaw: function(raw, team){
            //console.log(raw)
            swal({title: team, html:"<pre>" + JSON.stringify(raw) + "</pre>"})
        },
        submit: function() {
            //generate statistics, with actual comments because I am a good programmer.
            //I also wont understand this without comments
            var stuff = {}
            matches = _.filter(this.rawData, ["team", Number(this.team)]) //finding all the matches that match the team number
            stuff.number = this.team //setting the number to be displayed in the card
            stuff.drivetype = matches[0].drive + " " + matches[0].wheels //displaying the drivetype
            stuff.matches = _.map(matches, "match"); //gets all of the match numbers
            stuff.fouls = _.map(matches, function(item) {
                if (item.foul) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.moved = _.map(matches, function(item) {
                if (item.autonmovement != "moves") return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.crossed = _.map(matches, function(item) {
                if (item.autonmovement != "cross") return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.startgears = _.map(matches, function(item) {
                if (!_.includes(item.autongears, "starts")) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.placegears = _.map(matches, function(item) {
                if (!_.includes(item.autongears, "places")) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.autonhigh = _.round(_.meanBy(matches, "autonhighaccu"), 3)
            stuff.autonlow = _.round(_.meanBy(matches, "autonlowaccu"), 3)
            stuff.defensive = _.map(matches, function(item) {
                if (!item.telopdefense) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.stuck = _.map(matches, function(item) {
                if (!item.teloprobostuck) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.telophigh = _.round(_.meanBy(matches, "telophighaccu"), 3)
            stuff.teloplow = _.round(_.meanBy(matches, "teloplowaccu"), 3)
            stuff.cycletime = _.round(_.mean(_.compact(_.map(matches, "telopgearstime"))), 3)
            stuff.gearsplaced = _.map(matches, "telopgearsplaced")
            stuff.gearsfailed = _.round(_.meanBy(matches, "telopgearsfailed"), 3)
            stuff.gearstuck = _.map(matches, function(item) {
                if (!item.teloprobostuck) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.hangtime =_.round(_.mean(_.compact(_.map(matches, "telophangtime"))), 3)
            stuff.comments = {}
            stuff.comments.text = _.map(matches, "comments")
            stuff.comments.match = _.map(matches, "match")
            stuff.comments.names = _.map(matches, "name")
            stuff.hanging = _.map(matches, function(item) {
                if (item.telopballhang == 'success') return { c: "g", match: item.match }
                else return { c: "r", match: item.match }
            });
            stuff.raw = matches;
            console.log(stuff)
            this.data.unshift(stuff)
        }
    },
    components: {
        'matches': {
            template: "#match",
            props: ['d'],
        }
    }
})

var app = new Vue({
    el: '#app',
    created: function () {
        this.$http.get('/api').then(function (response) {
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
        update: function () {
            this.$http.get('/api').then(function (response) {
                this.rawData = JSON.parse(response.body)
            });
        },
        openRaw: function (raw, team) {
            //console.log(raw)
            swal({ title: team, html: "<pre>" + JSON.stringify(raw) + "</pre>" })
        },
        submit: function () {
            //generate statistics, with actual comments because I am a good programmer.
            //I also wont understand this without comments
            var stuff = {}
            matches = _.filter(this.rawData, ["team", Number(this.team)]) //finding all the matches that match the team number
            stuff.number = this.team //setting the number to be displayed in the card
           // stuff.drivetype = matches[0].drive + " " + matches[0].wheels //displaying the drivetype
            stuff.matches = _.map(matches, "match"); //gets all of the match numbers
            stuff.fouls = _.map(matches, function (item) {
                if (item.foul) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.moved = _.map(matches, function (item) {
                if (item.a_movement != "moves") return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.crossed = _.map(matches, function (item) {
                if (item.a_movement != "cross") return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.a_switch = _.map(matches, function (item) {
                if (!_.includes(item.a_switch, "left" || "right")) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.a_scale = _.map(matches, function (item) {
                if (!_.includes(item.a_scale, "left" || "right")) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.a_vault = _.map(matches, function (item) {
                if (!_.includes(item.a_vault, "Yes")) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.autonquality = _.round(_.meanBy(matches, "a_place_quality"), 3)
            stuff.defensive = _.map(matches, function (item) {
                if (!item.defense) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.stuck = _.map(matches, function (item) {
                if (!item.teloprobostuck) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.switch_cubes = _.map(matches, "switch_cubes")
            stuff.scale_cubes = _.map(matches, "scale_cubes")
            stuff.vault_cubes = _.map(matches, "vault_cubes")
            stuff.defensive = _.map(matches, function (item) {
                if (item.defensive) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.def_score = _.round(_.meanBy(matches, "def_score"), 3)
            stuff.def_pickup = _.round(_.meanBy(matches, "def_pickup"), 3)
            stuff.foul_number = _.round(_.meanBy(matches, "foul_number"), 3)
            //stuff.cycletime = _.round(_.mean(_.compact(_.map(matches, "telopgearstime"))), 3)
            stuff.comments = {}
            stuff.comments.text = _.map(matches, "comments")
            stuff.comments.match = _.map(matches, "match")
            stuff.comments.names = _.map(matches, "name")
            stuff.hang = _.map(matches, function (item) {
                if (item.hang == 'success') return { c: "g", match: item.match }
                else return { c: "r", match: item.match }
            });
            stuff.hang_time = _.round(_.mean(_.compact(_.map(matches, "hang_time"))), 3)
            stuff.levitate = _.map(matches, function (item) {
                if (item.levitate != "Yes") return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.hanged_on_other = _.map(matches, function (item) {
                if (item.hangsonother) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.can_carry = _.map(matches, function (item) {
                if (item.otherhangson) return { c: "r", match: item.match }
                else return { c: "g", match: item.match }
            });
            stuff.robot_hang_total = _.map(matches, "endrobothangtotal")
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

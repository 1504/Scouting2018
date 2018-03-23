var app = new Vue({
    el: '#app',
    data: {
        d: {},
        default: {},
        data: [],
        menu: false,
        viewData: false,
        s: {},
        showQR: false,
        selectedData: [],
        auth: atob('Ymx1ZWJhYmllc2FyZXVuaGVhbHRoeQ==')
    },
    created: function() {
        var self = this;
        this.$http.get('/fields.json').then(function(resp) {
            self.d = resp.body
            console.log(self.d)
        }, function() {
            alert("An error occured, please refresh the page")
        });
        this["default"] = JSON.parse(JSON.stringify(this.d));
        this.data = store('data') || [];
        this.s = store('settings') || {
            password: '',
            name: ''
        };
    },
    methods: {
        submit: function() {
            for (var key in this.d) {
                if (this.d.hasOwnProperty(key) && typeof(this.d[key]) === "boolean"){
                    this.d[key] = this.d[key].toString()
                }   
            }
            this.data.push(this.d);
            store('data', this.data);
            this.d.name = this.s.name;
            this.d = JSON.parse(JSON.stringify(this["default"]));
            this.$loading.toggle('Attempting to send...');
            this.$http.post('', this.data, { timeout: 3000 }).then((function() {
                this.$loading.toggle();
                this.clear();
                this.$alert({ message: 'Form Submitted', title: ':D', okText: 'Okay' });
            }), function() {
                this.$loading.toggle();
                this.$alert({ message: 'Form saved. There are now ' + this.data.length + ' forms saved', title: 'Could not Send', okText: 'Okay' });
            });
        },
        remove: function(i) {
            this.data.splice(i,1)
            store('data', this.data);
            this.$toast({ position: 'bottom', message: 'Deleted report' });
        },
        deleteSelected: function(){
            for (var i = this.selectedData.length - 1; i >= 0; i--) {
                this.data.splice(this.selectedData[i]._id, 1)
            }
            store('data', this.data);
            this.$toast({ position: 'bottom', message: 'Deleted reports' });
        },
        clear: function() {
            store(false);
            this.data = [];
            this.$toast({ position: 'bottom', message: 'Stored Data Cleared' });
        },
        saveSettings: function() {
            store('settings', this.s);
            this.$toast({ position: 'bottom', message: 'Saved' });
        },
        qr: function() {
            var data = []
            for (var i = this.selectedData.length - 1; i >= 0; i--) {
                data.push(this.selectedData[i].data)
            }
            this.showQR = true;
            var str = ""
            for (var i = 0; i < data.length; i++) {
                var arr = Object.keys(data[i]).map(function(k) { return data[i][k] });
                if (i == 0) {
                    str += arr.join("|")
                } else {
                    str += arr.join("|") + "\n"
                }
            }
            createQR(str)
            console.log(str)
        },
        decodeQR: function(str) {
            arr = str.split("\n");
            for (var i = arr.length - 1; i >= 0; i--) {
                var obj = {}
                var report = arr[i].split("|")
                var keys = Object.keys(this.d)
                for (var i = report.length - 1; i >= 0; i--) {
                    obj[keys[i]] = report[i]
                }
                this.data.push(obj);
                store('data', this.data);
                this.$toast({ position: 'bottom', message: 'Scouting Data added to Device' });
            }
        },
        onDecode: function(data) {

            console.log(data)
        }
    }
});
var app = new Vue({
    el: '#app',
    data: {
        d: {},
        default: {},
        data: [],
        menu: false,
        viewData: false,
        s: {},
        auth: atob('Ymx1ZWJhYmllc2FyZXVuaGVhbHRoeQ==')
    },
    created: function() {
        var self = this;
        this.$http.get('/fields.json').then(function(resp){
            self.d = resp.body
        }, function(){
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
                this.$alert({ message: 'Form saved. There are now ' + this.data.length + ' forms saved', title: ':(', okText: 'Okay' });
            });
        },
        clear: function() {
            store(false);
            this.data = [];
            this.$toast({ position: 'bottom', message: 'Stored Data Cleared' });
        },
        saveSettings: function() {
            store('settings', this.s);
            this.$toast({ position: 'bottom', message: 'Saved' });
        }
    }
});
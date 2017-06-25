(function () {

    var headerModule = {
        init: function () {

            // require.ensure(["../js/jquery.min.js","../js/vue.js"], function(require) {
                // require('../js/jquery.min.js');
                // var $ = jQuery;
                // 定义

                var HM = require('./header.js');
                Vue.component('HM',HM);

                var FM = require('./footer.js');
                Vue.component('FM',FM);

                var vm = new Vue({
                  el: '#app'
                  ,template: `
                                <div :class="pageCls">
                                  <HM></HM>
                                  <div class="con">
                                    <ul class="bootclearfix">
                                        <li v-for="item in items" v-if="item.show == 1">
                                            <a href="javascript:;" @click="add();">this is show link</a>
                                            <p>{{item.name}}</p>
                                        </li>
                                    </ul>
                                  </div>
                                  <FM></FM>
                                </div>
                                `
                  ,data: function () {
                      var _data = {
                        pageCls: 'shopList',
                        items: [
                                {
                                    show: 1,
                                    name: 'name0'
                                },
                                {
                                    show: 1,
                                    name: 'name1'
                                },
                                {
                                    show: 0,
                                    name: 'name2'
                                },
                            ]
                        };
                        return _data;
                  }
                ,methods: {
                    add: function () {
                        var NArr = [
                                {
                                    show: 1,
                                    name: 'name3'
                                },
                                {
                                    show: 0,
                                    name: 'name2'
                                },
                                {
                                    show: 1,
                                    name: 'name3'
                                },
                            ];
                        this.$data.items = this.$data.items.concat(NArr);
                    }
                }
                });
            // });
        }
    };

    headerModule.init();

    module.exports = headerModule;

}());


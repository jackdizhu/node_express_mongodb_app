(function () {

    var headerModule =  Vue.extend({
      template: `
              <div class="header">
                  <p>header</p>
              </div>
                `
      ,props:['Pdata']
      ,data: function () {
        var _data = {};
          return _data;
      }
      ,methods: {
        }
    });

    module.exports = headerModule;

}());


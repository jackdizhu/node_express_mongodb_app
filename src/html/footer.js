(function () {

    var footerModule =  Vue.extend({
      template: `
              <div class="footer">
                  <p>footer</p>
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

    module.exports = footerModule;

}());


/**
 * Created by wizdev on 12/8/2015.
 */
(function (require, module) {

    var reqHeaders = (function(){
        var model = {
            getHeader:function(headers){
                var header = {
                    host:headers['headers']['host'],
                    referer : headers['headers']['referer'],
                    ipAddress:'X-Forwarded-For'
                };
                return header;
            }
        };
        return model;
    })();

    var appSetup = (function(model) {
        {
            this.setupApp = function (req, res) {
                var _model = new reqHeaders.getHeader(req);
                model.findApp(_model, function (error, doc) {
                    if (error) {
                        return res.status(500).json(error);
                    }
                    res.status(200).json(doc);
                });
            };

            return this;
        };
    });

    module.exports = appSetup;

})(require, module);
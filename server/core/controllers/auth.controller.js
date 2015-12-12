/**
 * Created by wizdev on 12/8/2015.
 */

(function (require, module) {
    var auth = (function(model)
        {
            var _auth = {};

            _auth.signup = function (req, res) {
                model.findAll(function (error, logs) {
                if (error) {
                    logger.error(error);
                    return res.status(500).json(error);
                }
                res.status(200).json(logs);
            });
            };

            _auth.signin = function (req, res) {
                var _model = req.body;
                var _condition = {email: _model.email, password: _model.password};
                model.signin(_condition, function (error, result) {
                    if (error) {
                        res.status(500).json(error);
                    } else {
                        res.status(200).json({isSucess:true, data:result });
                    }
                });
            };
            return _auth;
        });

    module.exports = auth;
})(require, module);
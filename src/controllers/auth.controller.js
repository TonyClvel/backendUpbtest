const authService = require('../services/auth.service');

const login = (req, res) => {
    const sesion = authService.login(req.body);
    res.json(sesion);
};

module.exports = { login };

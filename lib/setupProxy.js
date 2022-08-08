const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy(`/produtos/json&estoque=S&apikey=${process.env.NEXT_PUBLIC_BLING_KEY}`, {
        target: 'https://bling.com.br/Api/v2',
        secure: false,
        changeOrigin: true,
        })
    );
    };
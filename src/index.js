var Client = require('pg').Client;
var ActiveRecord = require('./lib/ActiveRecord');
var Filme = require('./models/Filme');

process.env.CONNECTION_STRING = 'postgresql://pgsql:pgsql@localhost/database';

var client = new Client({host: 'localhost', user: 'pgsql', database: 'database', password: 'pgsql'});
client.connect();
var sql = 'create table if not exists filmes (id numeric constraint id primary key, titulo varchar(60) not null, ano integer not null)';

client.query(sql);

var f = new Filme();
// f.findAll(null, function (data) {
//     console.log(data);
// });

// f.findByPk(1, null, function (data) {
//     console.log(data);
// });

var novo = new Filme();
novo.setAttributes({
    titulo: 'teste alterado2',
    ano: 2017
});

//novo.insert(null, function (data) {});
novo.update(3, null, function (data) {});
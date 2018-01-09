var ActiveRecord = require('../lib/ActiveRecord');

class Filme extends ActiveRecord {
    constructor() {
        super('filmes');
        this.pk = "id";
    }
}

module.exports = Filme;
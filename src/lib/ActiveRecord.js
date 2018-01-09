var Client = require('pg').Client;
var QueryBuilder = require("squel");
var PGQueryBuilder = QueryBuilder.useFlavour("postgres");
var _ = require('underscore');

class ActiveRecord {
    constructor(tableName) {
        if (!tableName) {
            throw 'tableName must be set';
        }
        this.tableName = tableName;
    }

    open() {
        this.client = new Client({
            connectionString: process.env.CONNECTION_STRING
        });
        this.client.connect();
    }

    close() {
        this.client.end();
    }

    findAll(errorHandler, successHandler) {
        var sql = PGQueryBuilder.select()
            .from(this.tableName)
            .toString();

        this.query(sql, errorHandler, successHandler);
    }

    query(sql, errorHandler, successHandler) {
        errorHandler = this.validateErrorHandler(errorHandler);
        successHandler = this.validateSuccessHandler(successHandler);
 
        this.open();

        this.execute(sql, errorHandler, successHandler);
    }

    execute(sql, errorHandler, successHandler) {
        var that = this;
        this.client.query(sql, function (err, res) {
            if (err) {
                errorHandler(err);
                return;
            }

            successHandler(that.parseData(res));
            
            that.close();
        });
    }

    findByPk(pk, errorHandler, successHandler) {
        var sql = PGQueryBuilder.select()
            .from(this.tableName)
            .where(this.pk + " = ?", pk)
            .toString();

        this.query(sql, errorHandler, successHandler);
    }

    parseData(data) {
        return data.rows;
    }

    validateErrorHandler(errorHandler) {
        if (typeof errorHandler != "function") {
            errorHandler = function (err) {
                console.error('Default error handler');
                console.log(err);
            }
        }

        return errorHandler;
    }

    validateSuccessHandler(successHandler) {
        if (typeof successHandler != "function") {
            successHandler = function (res) {
                console.error('Default success handler');
                console.log(ActiveRecord.parseData(res));
            }
        }

        return successHandler;
    }

    setAttributes(newAttributes) {
        if (!this.attributes) {
            this.attributes = newAttributes;
        }
    }

    insert(errorHandler, successHandler) {
        var sqlBuilder = PGQueryBuilder.insert()
            .into(this.tableName);

        _.each(this.attributes, function (value, column) {
            sqlBuilder.set(column, value);
        })

        var sql = sqlBuilder.toString();

        this.query(sql, errorHandler, successHandler);
    }

    update(pk, errorHandler, successHandler) {
        var sqlBuilder = PGQueryBuilder.update()
            .table(this.tableName);

        _.each(this.attributes, function (value, column) {
            sqlBuilder.set(column, value);
        });

        sqlBuilder.where(this.pk + ' = ' + pk);

        this.query(sqlBuilder.toString(), errorHandler, successHandler);
    }
}

module.exports = ActiveRecord;
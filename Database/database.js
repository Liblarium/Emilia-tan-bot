const { time } = require(`../config.js`);
const dbConfig = { type: `mysql`, host: `localhost`, port: `3306`, username: `Ran`, password: `Ran`, name: `profile-bd`, entitys: require(`./entitis.js`).entitys };
const { ConnectionInfo } = require(`./databases.js`)
const { DataSource } = require(`typeorm`);
const db = new ConnectionInfo(dbConfig.type, dbConfig.host, dbConfig.port, dbConfig.username, dbConfig.password, dbConfig.name, dbConfig.entitys);
exports.database = db;
exports.aidb =  new ConnectionInfo(`postgres`, `localhost`, `5432`, `Ran`, `Ran`, `ai`, require(`./AI/entitis.js`).entitys);
//exports.pgBase = new DataSource({type: `postgres`, host: `localhost`, port: 5432, username: `porstgres`, password: `ffffff`, database: `profile`, synchronize: true, logging: true, entities: require(`${process.cwd()}/Database/entitis.js`).entitys, subscribers: [], migrations: [],})
exports.TestDataBase = {
    /**
     * 
     * @param {string | number} err  
     */
    error: (err) => {
        return console.log(`[${time()}][База Данных | Ошибка]: ${err}`);
    },
    /**
     * 
     * @param {string} colums имя столбика
     * @param {string} name то, что вы ищете в столбике
     * @param {string} table имя таблицы
     * @param {string | number} error ошибка при краше
     */
    viewData: (colums, name, table, error) => {
        db.fetchData(colums, name, table, res => {
            if (res === undefined) return this.error(error);
            return res;
        });
    },
    /**
     * 
     * @param {string} table имя таблицы
     * @param {string[]} name имена стобликов в []
     * @param {string | number} error ошибка при краше
     */
    selectData: (table, name, error) => {
        db.selectData(table, name, res => {
            if (res === undefined) return this.error(error);
            return res;
        });
    },
    /**
     * 
     * @param {string} table имя таблицы
     * @param {string | number} error ошибка при краше
     */
    allData: (table, error) => {
        db.fetchAllData(table, res => {
            if (res === undefined) return this.error(error);
            return res;
        });
    },
    /**
     * 
     * @param {string | number} id поиск по ID таблицы
     * @param {string} table имя 
     * @param {string | number} error ошибка при краше
     */
    findId: (id, table, error) => {
        db.fetchByIds(id, table, res => {
            if (res === undefined) return this.error(error);
            return res;
        });
    },
    /**
     * 
     * @param {object} file 
     * @param {string} table 
     * @param {string | number} error 
     */
    create: (file, table, error) => {
        db.upsertData(file, table, res => {
            if (res === undefined) return this.error(error);
            if (typeof res != `object`) return this.error(error);
            return res;
        });
    },
    /**
     * 
     * @param {string | number} id id того, что будет изменено
     * @param {object} file то, что будет изменено в в таблице. Изменять через {}  
     * @param {string} table имя таблицы
     * @param {string | number} error ошибка при краше
     */
    update: (id, file, table, error) => {
        db.updatePartialData(id, file, table, res => {
            if (res === undefined) return this.error(error);
            if (typeof res != `object`) return this.error(error);
            return res;
        });
    },
    /**
     * 
     * @param {string | number} id id того, что будет удалено
     * @param {string} table имя таблицы
     * @param {string | number} error ошибка при краше
     */
    delete: (id, table, error) => {
        db.deleteByIds(id, table, res => {
            if (res === undefined) return this.error(error);
            return res;
        });
    },
    /**
     * 
     * @param {string} table имя таблицы
     * @param {string | number} error ошибка при краше
     */
    lastId: (table, error) => {
        db.fetchLastId(table, res => {
            if (res === undefined) return this.error(error);
            return res;
        });  
    },
}

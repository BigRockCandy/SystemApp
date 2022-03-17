import {
	getDBConfig
} from './api.js'
import appConfig from '../config/config.js'
import * as appUtil from './util.js'

//打开数据库(创建数据库或者有该数据库就打开)
var name = "safecheck" // 数据库名称
// 防止数据中的 单引号 报错
export const html2Escape = (str) => {
	// console.log("str",str,typeof str)
	if (typeof str === "string") {
		return str.replace(/'/g, "''");
	} else if (typeof str === "object") {
		return JSON.stringify(str).replace(/'/g, "''");
	} else {
		return str
	}

}
export const deleteAppTable = async () => {
	let tables = await getTable()
	console.log('tables', tables)
	for (let i = 0; i < tables.length; i++) {
		const sql = 'drop table ' + tables[i].name
		await executeSql(sql)

	}

}
export const openSqlite = async () => {
	//创建数据库或者打开
	//这plus.sqlite只在手机上运行
	return new Promise((resolve, reject) => {
		if (isOpen()) {
			// console.log("数据库已经打开了")
			resolve("数据库已经打开");
			return true
		}
		// console.log("开始打开数据库")
		plus.sqlite.openDatabase({
			name, //数据库名称
			path: `/storage/emulated/0/dbBackUp/${name}.db`, //数据库地址，uniapp推荐以下划线为开头，这到底存在哪里去了，我也不清楚，哈哈
			success() {
				// console.log("成功打开数据库")
				resolve(); //成功回调
			},
			fail(e) {
				// console.log("失败打开数据库",e)
				reject(e); //失败回调
			}
		})
	})
}
//判断数据库是否打开
export const isOpen = () => {
	//数据库打开了就返回true,否则返回false
	var open = plus.sqlite.isOpenDatabase({
		name,
		path: `/storage/emulated/0/dbBackUp/${name}.db`,
	})
	return open;
}
//关闭数据库
export const closedb = () => {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name,
			success(e) {
				resolve(e);
			},
			fail(e) {
				reject(e);
			}
		})
	})
}
// 执行sql语句
export const executeSql = (sql) => {
	return new Promise((resolve, reject) => {
		//创建表格在executeSql方法里写
		// console.log("开始执行自定义sql", sql)
		plus.sqlite.executeSql({
			name,
			//表格创建或者打开，后面为表格结构
			sql: sql,
			success(e) {
				// console.log('executeSql',JSON.stringify(e))
				resolve(e);
			},
			fail(e) {
				console.error("executeSql报错", e)
				reject(e);
			}
		})
	})
}
// 查询所有数据表名
export const getTable = async () => {
	return selectSql("select name FROM sqlite_master where type='table'")
}
// 获取表的所有字段
export const getAllField = async (tableName) => {
	return selectSql(`PRAGMA table_info(${tableName})`)
}

// 查询表数据总条数
export const getCount = (tableName, whereObj = {}) => {
	let sql = `select count(*) as num from ${tableName} where 1 `
	if (Object.keys(whereObj).length > 0) {
		for (let i in whereObj) {
			sql += ` and ${i} = '${whereObj[i]}' `
		}
	}
	console.log("getCount的SQL", sql)
	return selectSql(sql)
}
// 查询表是否存在
export const isTable = (tableName) => {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: `select count(*) as isTable FROM sqlite_master where type='table' and name='${tableName}'`,
			success(e) {
				resolve(e[0].isTable ? true : false);
			},
			fail(e) {
				console.log(e)
				reject(e);
			}
		})
	})
}

// 添加数据
export const addSql = async (tableName, obj = {}) => {
	if (Object.keys(obj).length > 0) {
		// 获取数据库的字段
		let fieldList = await getAllField(tableName)
		// 取数据库有的字段
		let keys = intersection(fieldList, obj)
		let keyStr = keys.toString()
		let valStr = ''
		keys.forEach((item, index) => {
			valStr += (`'${html2Escape(obj[item])}',`)
		})
		valStr = valStr.substring(0, valStr.length - 1)
		let sqlStr = `insert into ${tableName}(${keyStr}) values(${valStr})`
		console.log("addSql", sqlStr)
		return executeSql(sqlStr)
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		})
	}
}


// 修改数据
export const updateSql = async (tableName, setData, whereObj = {}) => {
	if (!Object.keys(whereObj).length) {
		return new Promise((resolve, reject) => {
			reject("请传whereObj")
		});
		return false
	}
	if (setData && JSON.stringify(setData) !== '{}') {
		// 获取数据库的字段
		let fieldList = await getAllField(tableName)
		let dataKeys = intersection(fieldList, setData)
		let setStr = ''
		// console.log("dataKeys",tableName,dataKeys)
		dataKeys.forEach((item, index) => {
			// console.log(setData[item])
			setStr += (
				`${item} = '${setData[item]}',`)
		})
		setStr = setStr.substring(0, setStr.length - 1)
		let sql = `update ${tableName} set ${setStr} where 1 `
		for (let i in whereObj) {
			sql += ` and ${i} = '${whereObj[i]}' `
		}
		// console.log("修改数据的sql",sql)
		return executeSql(sql)
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}

//删除数据库数据
export const deleteSql = (tableName, whereObj = {}) => {
	if (tableName && JSON.stringify(whereObj) !== '{}') {
		let dataKeys = Object.keys(whereObj)
		let setStr = ''
		dataKeys.forEach((item, index) => {
			console.log(whereObj[item])
			setStr += (
				`${item}='${whereObj[item]}' ${dataKeys.length - 1 !== index ? " and " : ""}`)
		})
		console.log("删除sql", `-- delete from ${tableName} where ${setStr}`)
		let sql = `delete from ${tableName} where ${setStr}`
		return executeSql(sql)
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}

/**
 * 获取分页数据库数据
 * @param tableName 表名称
 * @param pageObj  分页数据，如  {current:1,size:10}
 * @param whereObj 查询
 * @param orderBy 排序
 * @returns {Promise<unknown>}
 */
export const getPageList = async (tableName, pageObj, whereObj = {}, orderBy) => {
	// console.log("数据库",tableName,pageObj,whereObj,orderBy)
	let current = parseInt(pageObj.current)
	let size = parseInt(pageObj.size)
	// console.log("数据库11")
	let pages = 0,
		total = 0 // pages为总页数，total为总数据条数
	let sql = ''
	let numindex = 0
	await getCount(tableName, whereObj).then((resNum) => {
		console.log("resNum", resNum, size)
		pages = Math.ceil(resNum[0].num / size)
		total = resNum[0].num
	})
	if (((current - 1) * size) == 0) {
		numindex = 0
	} else {
		numindex = ((current - 1) * size) + 1
	}
	sql = `select * from ${tableName} where 1 `
	if (Object.keys(whereObj).length > 0) {
		for (let i in whereObj) {
			sql += ` and ${i} = '${whereObj[i]}' `
		}
	}
	if (orderBy) {
		sql += ` order by ${orderBy} `
	}
	sql += ` limit ${numindex},${size}`
	console.log("分页sql，", sql)
	if (pages < current - 1) {
		return new Promise((resolve, reject) => {
			reject("无数据")
		});
	} else {
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: name,
				sql: sql,
				success(e) {
					resolve({
						code: 0,
						data: {
							data: {
								records: e,
								pages,
								total
							}
						},
						msg: null
					});
				},
				fail(e) {
					reject({
						data: e,
						code: 500,
						msg: e
					});
				}
			})
		})
	}
}
/**
 * 自定义语句查询，数据库数据
 * @param sql sql语句
 * @returns {Promise<any>}
 */
export const selectSql = (sql) => {
	// console.log("查询的sql",sql)
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name: name,
			sql: sql,
			success(e) {
				// console.log('selectSql', JSON.stringify(e))
				resolve(e);
			},
			fail(e) {
				console.log("selectSql查询报错", e)
				reject(e);
			}
		})
	})
}

/**
 * 查询数据库数据
 * @param tableName 表名
 * @param searchObj 查询的对象
 * @param orderBy 排序, 如 "id desc"
 * @param selectStr
 * @returns {Promise<any>}
 */
export const selectList = (tableName, searchObj = {}, orderBy = "") => {
	let setStr = ''
	let sql = ''
	if (tableName) {
		if (JSON.stringify(searchObj) !== '{}') {
			let dataKeys = Object.keys(searchObj)
			dataKeys.forEach((item, index) => {
				// console.log(searchObj[item])
				setStr += (
					`${item}='${html2Escape(searchObj[item])}' ${dataKeys.length - 1 !== index ? " and " : ""}`
				)
			})
		}
		sql = `select * from ${tableName} `
		sql += setStr ? ` where ${setStr} ` : ""

		if (orderBy) {
			sql += ` order by ${orderBy} `
		}
		console.log("查询数据库数据", sql)
		return selectSql(sql)
	} else {
		return new Promise((resolve, reject) => {
			reject("错误")
		});
	}
}


//将SQL语句进行拼接values(),()...然后再一次性插入，
export const insertAll = async (tableName = "", data = []) => {
	let sql = ""
	// 获取数据库的字段
	try {
		let fieldList = await getAllField(tableName)
		// console.log("fieldList",fieldList)
		if (tableName && data.length > 0) {
			// 取交集的字段，才是合法的，能存进数据库的字段（注意：取的字段，是按照第一条数据的字段，进行赋值的）
			let keys = intersection(fieldList, data[0])
			let keyStr = keys.toString()
			console.log("keyStr", keyStr)

			sql = `insert into ${tableName} (${keyStr}) values`;
			for (let i = 0; i < data.length; i++) {
				sql += "(";
				for (const [k, v] of keys.entries()) {
					// console.log("data[i][v]",k,v,data[i][v],data)
					sql += `'${html2Escape(data[i][v])}',`
				}
				sql = sql.substring(0, sql.length - 1)
				sql += "),";
			}
			sql = sql.substring(0, sql.length - 1)
			console.log("批量插入的sql", sql)
		} else {
			this.$msg("表名为空或者插入数据为空")
		}
	} catch (e) {
		console.error("批量插入报错", e)
	}
	return executeSql(sql)
}

/**
 * 批量修改 data数组 field关键字段 批量修改函数 传参方式
 * @param tableName 表名
 * @param data 需要修改的数据
 * @param field 表主键字段，通常是 id
 * @returns {Promise<unknown>}
 */
export const batchUpdate = async (tableName = '', data = [], field = '') => {

	let sql = ""
	let con = [];
	let con_sql = [];
	let fields = [];
	let value
	let temp
	try {

		if (!tableName || !data || !field) {
			return false;
		} else {
			sql = 'UPDATE ' + tableName;
		}

		for (let key in data) {
			value = data[key]
			let x = 0;
			let v
			// console.log("value",value)
			for (let k in value) {
				v = value[k]
				if (k != field && !con[x] && x == 0) {
					con[x] = ` set ${k} = (CASE ${field} `;
				} else if (k != field && !con[x] && x > 0) {
					con[x] = ` ${k} = (CASE ${field} `;
				}
				if (k != field) {
					temp = value[field];
					con_sql[x] = con_sql[x] ? con_sql[x] : ""
					con_sql[x] += ` WHEN '${temp}' THEN '${html2Escape(v)}' `;
					x++;
				}
			}
			temp = value[field];
			// console.log("temp",fields,temp)
			if (fields.indexOf(temp) === -1) {
				fields.push(temp)
			}
		}
		let num = con.length - 1;
		for (let [key, value] of con.entries()) {
			for (let [k, v] of con_sql.entries()) {
				if (k == key && key < num) {
					sql += value + v + ' end),';
				} else if (k == key && key == num) {
					sql += value + v + ' end)';
				}
			}
		}
		let str = fields.join(",");
		sql += ` where ${field} in(${str})`;
		console.log("批量更新的sql", sql)


	} catch (e) {
		console.error("批量修改报错", e)
	}
	return executeSql(sql)
}



//////////////////////////////////////////////////////////////////////






// 合并数据
export const mergeSql = (name, tableName, tabs) => {
	if (!tabs || tabs.length == 0) {
		return new Promise((resolve, reject) => {
			reject("错误")
		})
	}
	let itemValStr = ''
	tabs.forEach((item, index) => {
		let itemKey = Object.keys(item)
		let itemVal = ''
		itemKey.forEach((key, i) => {
			if (itemKey.length - 1 == i) {
				if (typeof item[key] == 'object') {
					itemVal += (`'${JSON.stringify(item[key])}'`)
				} else {
					itemVal += (`'${item[key]}'`)
				}
			} else {
				if (typeof item[key] == 'object') {
					itemVal += (`'${JSON.stringify(item[key])}',`)
				} else {
					itemVal += (`'${item[key]}',`)
				}
			}
		})
		if (tabs.length - 1 == index) {
			itemValStr += ('(' + itemVal + ')')
		} else {
			itemValStr += ('(' + itemVal + '),')
		}
	})
	let keys = Object.keys(tabs[0])
	let keyStr = keys.toString()
	let sql = `insert or ignore into ${tableName} (${keyStr}) values ${itemValStr}`
	return executeSql(sql)
}
/**
 * 过滤非数据表的字段，使其不报错
 * @param fieldList ，使用 getAllField()函数查询出来的数据
 * @param obj 数据
 * @returns []
 */
export const intersection = (fieldList = [], obj) => {
	// 获取数据库的字段
	let arrField = {}
	for (let i in fieldList) {
		arrField[fieldList[i].name] = null
	}
	// 取交集的字段，才是合法的，能存进数据库的字段
	let keys = []
	for (let i in arrField) {
		if (obj.hasOwnProperty(i)) {
			keys.push(i)
		}
	}

	return keys
}
//更新表结构
export const updateTable = async (tablename) => {
	try {
		const cols = await getAllField(tablename)
		const table = uni.getStorageSync(tablename)
		const columns = table.columns ? JSON.parse(JSON.stringify(table.columns).replace(/\s+/g, "")) : table
			.columns
		const idColName = table.idColName
		for (let i = 0; i < cols.length; i++) {
			if (!columns.hasOwnProperty(cols[i].name)) {
				if (!(cols[i].name === idColName)) {
					console.log('cols[i].name', cols[i].name)
					if (columns[cols[i].name].indexOf('NUMBER') !== -1) {
						const sql = 'ALTER TABLE ' + tablename + ' ADD ' + cols[i].name + ' INTEGER'
						await executeSql(sql)
					} else {
						const sql = 'ALTER TABLE ' + tablename + ' ADD ' + cols[i].name + ' TEXT'
						await executeSql(sql)
					}
				}
			}
		}
	} catch (e) {
		console.error("更新表，", tablename, "报错", e)
	}
}
//同步表结构
export const updateInitTable = async () => {
	try {
		await openSqlite()
		for (let i = 0; i < appConfig.entities.length; i++) {
			await updateTable(appConfig.entities[i])
			console.log('同步完成', appConfig.entities[i])
		}
		await closedb()
	} catch (e) {
		console.error("同步表结构出错", e)
	}

}
export const openInitSqlite = async () => {
	// 打开数据库
	try {
		await openSqlite()
		await deleteAppTable()
		let entities = appConfig.entities
		for (let i = 0; i < entities.length; i++) {
			await createTable(entities[i])
		}
		const tables = await getTable()
		console.log('tables', JSON.stringify(tables))
		await closedb()
	} catch (e) {
		console.error("打开数据库，报错", e)
	}
}
export const initSqlite = async () => {
	try {
		let res = await getDBConfig({})
		const tables = res.data
		for (let table in tables) {
			uni.setStorageSync(table, tables[table])
		}
		await openInitSqlite()
	} catch (e) {
		console.error("初始化出错", e)
	}

}
export const createTable = async (createTableName) => {

	const table = uni.getStorageSync(createTableName)
	if (!table) {
		console.error('表结构不存在', createTableName)
		return
	}
	try {
		const columns = table.columns
		const idName = table.idName
		let idColName = table.idColName
		const idType = table.idType
		const idGenerator = table.idGenerator
		const tableName = table.tableName
		let sql = ' CREATE TABLE IF NOT EXISTS ' + tableName + " ("
		for (const col in columns) {
			sql += ' ' + col
			if (columns[col].indexOf('NUMBER') !== -1) {
				sql += ' INTEGER,'
			} else {
				sql += ' TEXT,'
			}
		}
		idColName += ' ' + idType === 'NUMBER' ? ' INTEGER' : ' TEXT'
		sql += ' ' + idColName
		sql += ' ' + (idGenerator !== 'ID_AUTO' && idGenerator !== 'ID_SEQ') ? "" : "AUTOINCREMENT"
		sql += ' )'
		await executeSql(sql)
		console.log('创建成功', createTableName)
	} catch (e) {
		console.error("创建表出错", e)
	}
}
export const entityPartialSave = async (tableName, data) => {
	await openSqlite()
	await entity(tableName, data)
	await closedb()
}
export const entity = async (tableName, data) => {
	try {
		const table = uni.getStorageSync(tableName)
		if (!table) {
			console.error('表结构不存在', tableName)
			return
		}
		const columns = table.columns
		const idName = table.idName
		const idType = table.idType
		const idGenerator = table.idGenerator
		// delete data[idName]
		const idValue = data[idName]
		let id = ''
		if (!idValue) {
			id = await doInsert(tableName, columns, data, idGenerator, idName, idType)
		} else {
			await doUpdate(tableName, columns, data, idName, idType)
		}
		if (JSON.stringify(table.onetoone) !== '{}') {
			for (let key in table.onetoone) {
				const arr = appUtil.replaceMap(table.onetoone[key])
				if (Array.isArray(data[key])) {
					for (let i = 0; i < data[key].length; i++) {
						const nextData = data[key][i]
						nextData[arr[1]] = id
						await entity(arr[0], nextData)
					}
				} else {
					data[key][arr[1]] = id
					await entity(arr[0], data[key])
				}
			}
		}
		if (JSON.stringify(table.onetomany) !== '{}') {
			for (let key in table.onetomany) {
				const arr = appUtil.replaceMap(table.onetomany[key])
				if (Array.isArray(data[key])) {
					for (let i = 0; i < data[key].length; i++) {
						const nextData = data[key][i]
						nextData[arr[1]] = id
						await entity(arr[0], nextData)
					}
				} else {
					data[key][arr[1]] = id
					await entity(arr[0], data[key])
				}
			}
		}
		if (JSON.stringify(table.inverses) !== '{}') {
			console.log('table.inverses', table.inverses)
		}
		if (JSON.stringify(table.inverseid) !== '{}') {
			console.log('table.inverseid', table.inverseid)
		}
	} catch (e) {
		//TODO handle the exception
		console.log('entity出错', e)
	}

}
export const doInsert = async (tableName, columns, data, idGenerator, idName, idType) => {
	try {
		let sql1 = 'insert into ' + tableName + '('
		let sql2 = ') values('
		let insertId
		if (idGenerator === 'ID_GUID') {
			insertId = appUtil.uuid()
			sql1 += idName + ','
			sql2 += idType === 'NUMBER' ? insertId : "'" + insertId + "'" + ","
		} else if (idGenerator === 'ID_SEQ') {

		} else if (idGenerator === 'ID_ASSIGNED') {
			insertId = appUtil.uuid()
			sql1 += idName + ','
			sql2 += idType === 'NUMBER' ? insertId : "'" + insertId + "'" + ","
		} else if (idGenerator === 'ID_FOREIGNER') {
			insertId = appUtil.uuid()
			sql1 += idName + ','
			sql2 += idType === 'NUMBER' ? insertId : "'" + insertId + "'" + ","
		}
		for (let column in columns) {
			if (data.hasOwnProperty(column)) {
				sql1 += column + ','
				if (data[column] === null || appUtil.replaceMap(columns[column])[1] === 'NUMBER') {
					sql2 += `${data[column]},`
				} else {
					sql2 += `'${data[column]}',`
				}
			}
		}
		sql1 = sql1.substring(0, sql1.lastIndexOf(','))
		sql2 = sql2.substring(0, sql2.lastIndexOf(',')) + ')'
		var sql = sql1 + sql2
		console.log('生成的insert', sql)
		await executeSql(sql)
		return insertId
	} catch (e) {
		//TODO handle the exception
		console.log('插入表', tableName, '失败', e)
	}

}
export const doUpdate = async (tableName, columns, data, idName, idType) => {
	try {
		let sql1 = 'update ' + tableName + ' set '
		let sql2 = ` where ${idName}=${idType==='NUMBER'?data[idName]:"'"+data[idName]+"'"}`
		for (let column in columns) {
			if (data.hasOwnProperty(column)) {
				if (data[column] === null || appUtil.replaceMap(columns[column])[1] === 'NUMBER') {
					sql1 += `${column}=${data[column]},`
				} else {
					sql1 += `${column}='${data[column]}',`
				}
			}
		}
		sql1 = sql1.substring(0, sql1.lastIndexOf(','))
		let sql = sql1 + sql2
		console.log('生成的update', sql)
		await executeSql(sql)
	} catch (e) {
		//TODO handle the exception
		console.log('更新表', tableName, '失败', e)
	}
}
export const query = async (sqlName, data) => {
	return new Promise((resolve, reject) => {
		try {
			const sql = uni.getStorageSync('sqls/' + sqlName + '.sql')
			if (!sql) {
				reject({
					code: 500,
					msg: 'sql不存在'
				})
			}

			openSqlite()
			replaceCondition(sql, data).then(res => {
				resolve({
					code: 200,
					msg: res
				})
			})
		} catch (e) {
			reject({
				code: 500,
				msg: e
			})
		}
	})
}
const replaceCondition = async (sql, data) => {
	if (sql.indexOf('{') !== -1) {
		if (sql.indexOf('}') !== -1) {
			const restr = sql.substring(sql.indexOf('{'), sql.indexOf('}') + 1)
			const key = restr.replace('{', '').replace('}', '').trim()
			const restred = data[key]
			if (restred) {
				sql = sql.replace(restr, restred)
				return replaceCondition(sql, data)
			} else {
				throw new Error(key + '不存在')
			}
		} else {
			throw new Error('sql括号不匹配')
		}
	} else {
		return selectSql(sql)
	}
}

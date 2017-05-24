/* ==============================================================================
 * 功能描述：EBDapperContext   
 * 公司名称:
 * 创 建 者：000155
 * 创建日期：2016/7/04 21:19:30
 * 功能详细描述：
 * 提供基于Dapper.net的封装。
 * 使用方法：
 * 
 * 
 * 
 * 提供辅助工具类：SqlCommandBuilder用于创建常见的根据类型生成的增删改查SQL语句
 * 
 * ==============================================================================*/
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Reflection;
using Dapper;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace EB.SaleChannnel.DAL
{
    /// <summary>
    /// 东航电商 Dapper操作数据库帮助类。
    /// </summary>
    public class EBDapperHelper
    {

        public const int DefaultTimeOut = 10000000;

        public static IQueryable<T> GetIQueryable<T>(string sql, object param = null, string connectionSettingName = null, IDbTransaction trans = null) where T : class, new()
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<T>(sql, param: param, transaction: trans).AsQueryable<T>();
            }

        }


        /// <summary>
        /// 查询列表数据
        /// </summary>
        /// <typeparam name="T">需要进行匹配泛型类型</typeparam>
        /// <param name="sql">sql语句</param>
        /// <param name="param">参数支持匿名类型 example: new {ProductID=100}</param>
        /// <param name="trans"></param>
        /// <returns></returns>
        public static IEnumerable<T> QueryList<T>(string sql, object param = null, string connectionSettingName = null, IDbTransaction trans = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<T>(sql, param: param, transaction: trans);
            }
        }

        /// <summary>
        /// 执行SQL语句
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <param name="trans"></param>
        /// <returns></returns>
        public static int Execute(string sql, object param = null, string connectionSettingName = null, IDbTransaction trans = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Execute(sql, param: param, transaction: trans, commandTimeout:DefaultTimeOut);
            }
        }


        /// <summary>
        /// Dapper原生方法
        /// </summary>
        /// <param name="dataBaseName"></param>
        public static void ChangeDatabase(string dataBaseName, string connectionSettingName = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                _conn.ChangeDatabase(dataBaseName);
            }
        }
        public static void Close(string connectionSettingName = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {

                _conn.Close();
            }
        }
        public static IDbCommand CreateCommand(string connectionSettingName = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.CreateCommand();
            }
        }
        /// <summary>
        /// Dapper原生方法
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <param name="transcation"></param>
        /// <param name="commandTimeout"></param>
        /// <param name="commandType"></param>
        /// <returns></returns>
        public static int Execute(string sql, object param = null, string connectionSettingName = null, IDbTransaction transcation = null, int? commandTimeout = null, CommandType? commandType = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Execute(sql: sql, param: param, transaction: transcation, commandTimeout: commandTimeout, commandType: commandType);
            }
        }

        /// <summary>
        /// Dapper原生方法
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <param name="transcation"></param>
        /// <param name="commandTimeout"></param>
        /// <param name="commandType"></param>
        /// <returns></returns>
        public static IDataReader ExecuteReader(string sql, object param = null, string connectionSettingName = null, IDbTransaction transcation = null, int? commandTimeout = null, CommandType? commandType = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.ExecuteReader(sql: sql, param: param, transaction: transcation, commandTimeout: commandTimeout, commandType: commandType);
            }
        }

        /// <summary>
        /// Dapper原生方法
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <param name="transcation"></param>
        /// <param name="commandTimeout"></param>
        /// <param name="commandType"></param>
        /// <returns></returns>
        public static object ExecuteScalar(string sql, object param = null, string connectionSettingName = null, IDbTransaction transcation = null, int? commandTimeout = null, CommandType? commandType = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.ExecuteScalar(sql: sql, param: param, transaction: transcation, commandTimeout: commandTimeout, commandType: commandType);
            }
        }

        /// <summary>
        /// Dapper原生方法
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <param name="transcation"></param>
        /// <param name="commandTimeout"></param>
        /// <param name="commandType"></param>
        /// <returns></returns>
        public static T ExecuteScalar<T>(string sql, object param = null, string connectionSettingName = null, IDbTransaction transcation = null, int? commandTimeout = null, CommandType? commandType = null) where T : class, new()
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.ExecuteScalar<T>(sql: sql, param: param, transaction: transcation, commandTimeout: commandTimeout, commandType: commandType);
            }

        }
        /// <summary>
        /// Dapper原生方法
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <param name="transcation"></param>
        /// <param name="commandTimeout"></param>
        /// <param name="commandType"></param>
        /// <returns></returns>
        public static IEnumerable<dynamic> Query(string sql, object param = null, string connectionSettingName = null, IDbTransaction transcation = null, int? commandTimeout = null, CommandType? commandType = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<dynamic>(sql: sql, param: param, transaction: transcation, commandTimeout: commandTimeout, commandType: commandType);
            }
        }

        /// <summary>
        /// Dapper原生方法
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="param"></param>
        /// <param name="transcation"></param>
        /// <param name="commandTimeout"></param>
        /// <param name="commandType"></param>
        /// <returns></returns>
        public static IEnumerable<T> Query<T>(string sql, object param = null, string connectionSettingName = null, IDbTransaction transcation = null, int? commandTimeout = null, CommandType? commandType = null) where T : class, new()
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<T>(sql: sql, param: param, transaction: transcation, commandTimeout: commandTimeout, commandType: commandType);
            }
        }


        #region 插入操作
        /// <summary>
        /// 插入单条数据,返回新增的ID Dynamic类型
        /// </summary>
        /// <typeparam name="T">传入参数实体类类型</typeparam>
        /// <param name="sql"></param>
        /// <param name="entity"></param>
        /// <param name="connectionName"></param>
        /// <returns>成功则返回新增的Id,失败返回影响数据条数</returns>
        public static dynamic InsertSingleReturnNewId<T>(string sql, T entity, string connectionSettingName = null, IDbTransaction tansaction = null) where T : class, new()
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                int records = 0;
                long newId = 0;
                records += _conn.Execute(sql, entity, tansaction);
                if (records > 0)
                {
                    //更新对象的Id为数据库里新增的Id,假如增加之后不需要获得新增的对象，
                    //只需将对象添加到数据库里，可以将下面的一行注释掉。
                    SetIdentity<long>(id => newId = id, _conn, tansaction);
                    return newId;
                }
                else
                {
                    return records;//如果失败则返回影响记录集的条数
                }

            }
        }


        /// <summary>
        /// 插入单条数据
        /// </summary>
        /// <typeparam name="T">传入参数实体类类型</typeparam>
        /// <param name="sql">sql语句</param>
        /// <param name="entity">插入的对象</param>
        /// <param name="connectionName"></param>
        /// <returns>返回影响记录集的条数</returns>
        public static int InsertSingle(string sql, object param = null, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                int records = 0;
                records += _conn.Execute(sql, param, tansaction);
                return records;//如果失败则返回影响记录集的条数
            }
        }

        /// <summary>
        /// 插入单条数据
        /// </summary>
        /// <typeparam name="T">传入参数实体类类型</typeparam>
        /// <param name="sql"></param>
        /// <param name="entity"></param>
        /// <param name="connectionName"></param>
        /// <returns>返回影响记录集的条数</returns>
        public static int InsertSingle<T>(string sql, T entity, string connectionSettingName = null, IDbTransaction tansaction = null) where T : class, new()
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                int records = 0;
                try
                {
                    records += _conn.Execute(sql, entity, tansaction);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return records;//如果失败则返回影响记录集的条数

            }
        }
        /// <summary>
        /// 插入多条数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="entities"></param>
        /// <param name="connectionName"></param>
        /// <returns>返回影响记录集的条数</returns>
        public static int InsertMultiple<T>(string sql, IEnumerable<T> entities, string connectionSettingName = null, IDbTransaction tansaction = null) where T : class, new()
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                int recounds = _conn.Execute(sql, entities.ToArray(), tansaction);
                return recounds;
            }
        }
        public static int InsertMultiple<T>(string sql, T[] entities, string connectionSettingName = null, IDbTransaction tansaction = null) where T : class, new()
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                int recounds = _conn.Execute(sql, entities, tansaction);
                return recounds;
            }
        }
        #endregion

        #region 更新数据
        /// <summary>
        /// 更新多条数据
        /// </summary>
        /// <typeparam name="T">传入参数实体类类型</typeparam>
        /// <param name="sql"></param>
        /// <param name="entities">参数实体类</param>
        /// <param name="connectionName"></param>
        /// <returns>返回影响记录集的条数</returns>
        public static int UpdateMultiple<T>(string sql, IEnumerable<T> entities, string connectionSettingName = null, IDbTransaction tansaction = null) where T : class, new()
        {

            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {

                int records = 0;
                foreach (T entity in entities)
                {
                    records += _conn.Execute(sql, entity, tansaction);
                }
                return records;
            }
        }

        /// <summary>
        /// 更新单条数据
        /// </summary>
        /// <typeparam name="T">传入参数实体类类型</typeparam>
        /// <param name="sql"></param>
        /// <param name="entity">参数实体类</param>
        /// <param name="connectionName"></param>
        /// <returns>返回影响记录集的条数</returns>
        public static int UpdateSingle<T>(string sql, T entity, string connectionSettingName = null, IDbTransaction tansaction = null) where T : class, new()
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                int records = 0;
                records += _conn.Execute(sql, entity, tansaction);
                return records;//如果失败则返回影响记录集的条数
            }

        }
        #endregion

        #region 删除数据操作
        /// <summary>
        /// 删除操作
        /// </summary>
        /// <param name="sql">删除操作语句</param>
        /// <param name="param">传递给SQL的参数 支持匿名类型 example: new {ProductID=100}</param>
        /// <param name="transcation"></param>
        /// <param name="commandTimeout"></param>
        /// <param name="commandType"></param>
        /// <returns>返回影响行数</returns>
        public static int Delete(string sql, object param = null, string connectionSettingName = null, IDbTransaction transcation = null, int? commandTimeout = null, CommandType? commandType = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Execute(sql: sql, param: param, transaction: transcation, commandTimeout: commandTimeout, commandType: commandType);
            }
        }

        #endregion

        /// <summary>
        /// 获取刚插入表的新主键ID
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="tansaction">本地事务</param>
        /// <param name="setId"></param>
        private static void SetIdentity<T>(Action<T> setId, IDbConnection _conn, IDbTransaction tansaction = null)
        {

            dynamic identity = _conn.Query("SELECT @@IDENTITY AS Id").Single();
            T newId = (T)identity.Id;
            setId(newId);
        }


        #region  事物操作
        /// <summary>
        /// 启动本地事务操作，提示：若需要进行分布式事务，请使用TransactionScope
        /// </summary>
        /// <returns> 动态返回事务对象，若进行事务提交或回滚，请使用改返回对象直接 commit 或 rollback</returns>
        public static IDbTransaction BeginTransaction(string connectionSettingName = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.BeginTransaction();
            }
        }
        #endregion

        #region 执行SQL脚本
        /// <summary>
        /// 根据参数执行sql查询
        /// </summary>
        /// <typeparam name="T">要返回的实体类型</typeparam>
        /// <param name="sql">sql查询语句</param>
        /// <param name="parms">传给sql的参数</param>
        /// <param name="tansaction">本地事务</param>
        /// <returns>返回多条记录集</returns>
        public static IEnumerable<T> SqlWithParams<T>(string sql, dynamic parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<T>(sql, (object)parms, tansaction);
            }

        }

        /// <summary>
        /// 根据参数执行sql查询
        /// </summary>
        /// <typeparam name="T">要返回的实体类型</typeparam>
        /// <param name="sql">sql查询语句</param>
        /// <param name="parms">传给sql的参数</param>
        /// <param name="tansaction">本地事务</param>
        /// <returns>返回单条记录集</returns>
        public static T SqlWithParamsSingle<T>(string sql, dynamic parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<T>(sql, (object)parms, tansaction).FirstOrDefault();
            }
        }

        /// <summary>
        /// 执行插入，更新，删除的sql语句
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <param name="parms">传给sql的参数</param>
        /// <param name="tansaction">本地事务</param>
        /// <returns>返回影响记录集的行数</returns>
        public static int InsertUpdateOrDeleteSql(string sql, dynamic parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Execute(sql, (object)parms, tansaction);
            }
        }
        #endregion

        #region 执行存储过程
        /// <summary>
        /// 执行存储过程
        /// </summary>
        /// <typeparam name="T">要返回的实体类型</typeparam>
        /// <param name="procname">存储过程名称</param>
        /// <param name="parms">要传给存储过程的参数</param>
        /// <param name="tansaction">本地事务</param>
        /// <returns>返回多条记录集</returns>
        public static List<T> StoredProcWithParams<T>(string procname, dynamic parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<T>(procname, (object)parms, tansaction, commandType: CommandType.StoredProcedure).ToList();
            }

        }


        /// <summary>
        /// 执行存储过程，返回多条动态类列表
        /// </summary>
        /// <param name="procname">存储过程名称</param>
        /// <param name="parms">要传给存储过程的参数</param>
        /// <param name="connectionName">数据库链接字符串，不传使用默认数据库链接字符串</param>
        /// <returns>返回多条记录集</returns>
        public static List<dynamic> StoredProcWithParamsDynamic(string procname, dynamic parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query(procname, (object)parms, tansaction, commandType: CommandType.StoredProcedure).ToList();
            }
        }

        /// <summary>
        /// 执行存储过程，返回单条记录集
        /// </summary>
        /// <typeparam name="T">要返回的实体类型</typeparam>
        /// <param name="procname">存储过程名称</param>
        /// <param name="parms">要传给存储过程的参数</param>
        /// <param name="tansaction">本地事务</param>
        /// <returns>返回单条记录集</returns>
        public static T StoredProcWithParamsSingle<T>(string procname, dynamic parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<T>(procname, (object)parms, tansaction, commandType: CommandType.StoredProcedure).SingleOrDefault();
            }
        }

        /// <summary>
        /// 执行存储过程插入数据，并outpuut参数形式返回新记录集的ID
        /// </summary>
        /// <typeparam name="T">要返回的实体类型</typeparam>
        /// <typeparam name="U">数据表ID的数据类型</typeparam>
        /// <param name="procName">存储过程的名称</param>
        /// <param name="parms">动态参数. 包含了定义好的output参数</param>
        /// <returns>把刚插入的新记录的ID做为U指定的类型,以outpuut参数形式返回</returns>
        public static U StoredProcInsertWithID<T, U>(string procName, DynamicParameters parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                var x = _conn.Execute(procName, (object)parms, tansaction, commandType: CommandType.StoredProcedure);
                return parms.Get<U>("@Id");
            }
        }

        /// <summary>
        /// 执行插入，更新，删除的存储过程，返回影响记录集的行数
        /// </summary>
        /// <param name="procName">存储过程的名称</param>
        /// <param name="parms">要传给存储过程的参数</param>
        /// <returns>返回影响记录集的行数</returns>
        public static int InsertUpdateOrDeleteStoredProc(string procName, dynamic parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Execute(procName, (object)parms, tansaction, commandType: CommandType.StoredProcedure);
            }
        }


        /// <summary>
        ///  执行存储过程，返回单条动态类
        /// </summary>
        /// <typeparam name="T">要返回的实体类型</typeparam>
        /// <param name="sql">用sql方式执行存储过程，例如：EXEC StoredProc(@p1, @p2)</param>
        /// <param name="parms">要传给存储过程的参数</param>
        /// <param name="connectionName">数据库链接字符串，不传使用默认数据库链接字符串</param>
        /// <returns>返回单条记录集</returns>
        public static System.Dynamic.DynamicObject DynamicProcWithParamsSingle<T>(string sql, dynamic parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query(sql, (object)parms, tansaction, commandType: CommandType.StoredProcedure).FirstOrDefault();
            }
        }

        /// <summary>
        /// 执行存储过程，返回多条动态类列表
        /// </summary>
        /// <typeparam name="T">要返回的实体类型</typeparam>
        /// <param name="sql">用sql方式执行存储过程，例如：EXEC StoredProc(@p1, @p2)</param>
        /// <param name="parms">要传给存储过程的参数</param>
        /// <param name="connectionName">数据库链接字符串，不传使用默认数据库链接字符串</param>
        /// <returns>返回多条记录集</returns>
        public static IEnumerable<dynamic> DynamicProcWithParams<T>(string sql, dynamic parms, string connectionSettingName = null, IDbTransaction tansaction = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query(sql, (object)parms, tansaction, commandType: CommandType.StoredProcedure);
            }
        }
        #endregion

        /// <summary>
        /// 公用插入单条数据返回主键 支持自增标识类型的。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="entity"></param>
        /// <param name="Key"></param>
        /// <returns></returns>
        public static Int32 CommonInsertReturnNewId<T>(T entity, String Key, string connectionSettingName = null) where T : class, new()
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                String SqlStr = SqlCommandBuilder.GetInsertCommandFilteredIdentityColumn<T>(Key);
                int records = 0;
                dynamic newId = 0;
                records += _conn.Execute(SqlStr, entity);
                if (records > 0)
                {
                    //更新对象的Id为数据库里新增的Id,假如增加之后不需要获得新增的对象，
                    //只需将对象添加到数据库里，可以将下面的一行注释掉。
                    SetIdentity<int>(id => newId = id, _conn);
                }
                return newId;

            }
        }

        ///// <summary>
        ///// 获取分页查询数据 使用之前数据库必须创建存储过程 "CommonProcGetPageData"
        ///// </summary>
        ///// <typeparam name="T">实体模型类型</typeparam>
        ///// <param name="condition">分页查询条件信息</param>
        ///// <param name="param">参数信息</param>
        ///// <param name="connectionSettingName">链接字符串名称</param>
        ///// <returns></returns>
        //public static CommonPagedDataViewModel<T> CommonGetPagedData<T>(PageCondition condition, string connectionSettingName = null)
        //{
        //    using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
        //    {
        //        var p = new DynamicParameters();
        //        string proName = "CommonProcGetPageData";
        //        p.Add("TableName", condition.TableName);
        //        p.Add("PrimaryKey", condition.PrimaryKey);
        //        p.Add("Fields", condition.Fields);
        //        p.Add("Condition", condition.Condition);
        //        p.Add("CurrentPage", condition.CurrentPage);
        //        p.Add("PageSize", condition.PageSize);
        //        p.Add("Sort", condition.Sort);
        //        p.Add("RecordCount", dbType: DbType.Int32, direction: ParameterDirection.Output);
        //        var pageData = new CommonPagedDataViewModel<T>();
        //        pageData.Items = _conn.Query<T>(proName, p, commandType: CommandType.StoredProcedure).ToList();
        //        _conn.Close();
        //        pageData.TotalNum = p.Get<int>("RecordCount");
        //        pageData.TotalPageCount = Convert.ToInt32(Math.Ceiling(pageData.TotalNum * 1.0 / condition.PageSize));
        //        pageData.CurrentPage = condition.CurrentPage > pageData.TotalPageCount ? pageData.TotalPageCount : condition.CurrentPage;
        //        return pageData;
        //    }
        //}



        /// <summary>Query a list of data from table with specified condition.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="connection"></param>
        /// <param name="condition"></param>
        /// <param name="table"></param>
        /// <param name="columns"></param>
        /// <param name="isOr"></param>
        /// <param name="transaction"></param>
        /// <param name="commandTimeout"></param>
        /// <returns></returns>
        public static IEnumerable<T> QueryList<T>(object condition, string table, string columns = "*", string connectionSettingName = null, bool isOr = false, IDbTransaction transaction = null, int? commandTimeout = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<T>(DapperPagerUtils.BuildQuerySQL(condition, table, columns, isOr), condition, transaction, true, commandTimeout);
            }
        }
        /// <summary>Query a list of data async from table with specified condition.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="connection"></param>
        /// <param name="condition"></param>
        /// <param name="table"></param>
        /// <param name="columns"></param>
        /// <param name="isOr"></param>
        /// <param name="transaction"></param>
        /// <param name="commandTimeout"></param>
        /// <returns></returns>
        public static Task<IEnumerable<T>> QueryListAsync<T>(object condition, string table, string columns = "*", string connectionSettingName = null, bool isOr = false, IDbTransaction transaction = null, int? commandTimeout = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.QueryAsync<T>(DapperPagerUtils.BuildQuerySQL(condition, table, columns, isOr), condition, transaction, commandTimeout);
            }
        }

        /// <summary>Query paged data from a single table.
        /// </summary>
        /// <param name="condition">传入的条件中，condition仅仅支持=操作。</param>
        /// <param name="table"></param>
        /// <param name="orderBy"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="columns"></param>
        /// <param name="isOr"></param>
        /// <param name="transaction"></param>
        /// <param name="commandTimeout"></param>
        /// <returns></returns>
        public static IEnumerable<dynamic> QueryPaged(dynamic condition, string table, string orderBy, int pageIndex, int pageSize, string columns = "*", bool isOr = false, IDbTransaction transaction = null, int? commandTimeout = null, string connectionSettingName = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return QueryPaged<dynamic>(condition, table, orderBy, pageIndex, pageSize, columns, isOr, transaction, commandTimeout, connectionSettingName);
            }
        }
        /// <summary>Query paged data async from a single table.
        /// </summary>
        /// <param name="condition">传入的条件中，condition仅仅支持=操作。</param>
        /// <param name="table"></param>
        /// <param name="orderBy"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="columns"></param>
        /// <param name="isOr"></param>
        /// <param name="transaction"></param>
        /// <param name="commandTimeout"></param>
        /// <returns></returns>
        public static Task<IEnumerable<dynamic>> QueryPagedAsync(dynamic condition, string table, string orderBy, int pageIndex, int pageSize, string columns = "*", bool isOr = false, IDbTransaction transaction = null, int? commandTimeout = null, string connectionSettingName = null)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return QueryPagedAsync<dynamic>(condition, table, orderBy, pageIndex, pageSize, columns, isOr, transaction, commandTimeout, connectionSettingName);
            }
        }
        /// <summary>Query paged data from a single table.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="condition">传入的条件中，condition仅仅支持=操作。</param>
        /// <param name="condition"></param>
        /// <param name="table"></param>
        /// <param name="orderBy"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="columns"></param>
        /// <param name="isOr"></param>
        /// <param name="transaction"></param>
        /// <param name="commandTimeout"></param>
        /// <returns></returns>
        public static IEnumerable<T> QueryPaged<T>(dynamic condition, string table, string orderBy, int pageIndex, int pageSize, string columns = "*", bool isOr = false, IDbTransaction transaction = null, int? commandTimeout = null, string connectionSettingName = null)
        {
            var conditionObj = condition as object;
            var whereFields = string.Empty;
            var properties = DapperPagerUtils.GetProperties(conditionObj);
            if (properties.Count > 0)
            {
                var separator = isOr ? " OR " : " AND ";
                whereFields = " WHERE " + string.Join(separator, properties.Select(p => p + " = @" + p));
            }
            var sql = string.Format("SELECT {0} FROM (SELECT ROW_NUMBER() OVER (ORDER BY {1}) AS RowNumber, {0} FROM {2}{3}) AS Total WHERE RowNumber >= {4} AND RowNumber <= {5}", columns, orderBy, table, whereFields, (pageIndex - 1) * pageSize + 1, pageIndex * pageSize);
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.Query<T>(sql, conditionObj, transaction, true, commandTimeout);
            }
        }
        /// <summary>Query paged data async from a single table.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="condition">传入的条件中，condition仅仅支持=操作。</param>
        /// <param name="table"></param>
        /// <param name="orderBy"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="columns"></param>
        /// <param name="isOr"></param>
        /// <param name="transaction"></param>
        /// <param name="commandTimeout"></param>
        /// <returns></returns>
        public static Task<IEnumerable<T>> QueryPagedAsync<T>(dynamic condition, string table, string orderBy, int pageIndex, int pageSize, string columns = "*", bool isOr = false, IDbTransaction transaction = null, int? commandTimeout = null, string connectionSettingName = null)
        {
            var conditionObj = condition as object;
            var whereFields = string.Empty;
            var properties = DapperPagerUtils.GetProperties(conditionObj);
            if (properties.Count > 0)
            {
                var separator = isOr ? " OR " : " AND ";
                whereFields = " WHERE " + string.Join(separator, properties.Select(p => p + " = @" + p));
            }
            var sql = string.Format("SELECT {0} FROM (SELECT ROW_NUMBER() OVER (ORDER BY {1}) AS RowNumber, {0} FROM {2}{3}) AS Total WHERE RowNumber >= {4} AND RowNumber <= {5}", columns, orderBy, table, whereFields, (pageIndex - 1) * pageSize + 1, pageIndex * pageSize);
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                return _conn.QueryAsync<T>(sql, conditionObj, transaction, commandTimeout);
            }
        }



        #region 高效率批量插入数据

        /// <summary>
        /// 高效插入数据操作
        /// </summary>
        /// <param name="TableName">目标表名称</param>
        /// <param name="dt">需要插入的元数据</param>
        /// <param name="connectionSettingName">数据库连接名称</param>
        public void SqlBulkCopyByDatatable(string TableName, DataTable dt,string connectionSettingName)
        {
            using (IDbConnection _conn = DapperConnectionFactory.CreateConnection(connectionSettingName))
            {
                using (SqlBulkCopy sqlbulkcopy = new SqlBulkCopy(_conn.ConnectionString, SqlBulkCopyOptions.UseInternalTransaction))
                {
                    try
                    {
                        sqlbulkcopy.DestinationTableName = TableName;
                        for (int i = 0; i < dt.Columns.Count; i++)
                        {
                            sqlbulkcopy.ColumnMappings.Add(dt.Columns[i].ColumnName, dt.Columns[i].ColumnName);
                        }
                        sqlbulkcopy.WriteToServer(dt);
                    }
                    catch (System.Exception ex)
                    {
                        throw ex;
                    }
                }
            }
        }



        #endregion
    }
}

/* ==============================================================================
 * 功能描述：DapperConnectionFactory  
 * 创 建 者：000155
 * 创建日期：2016/7/4 20:29:42
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
using System.Collections.Concurrent;
using InterestShareDal.DbUtils;

namespace EB.SaleChannnel.DAL
{
    public class DapperConnectionFactory
    {

        /// <summary>
        /// 并发连接缓存保存；
        /// </summary>
        public static ConcurrentDictionary<string, IDbConnection> ConnectionDictionArray = new ConcurrentDictionary<string, IDbConnection>();

        /// <summary>
        /// 初始化数据库连接,生成的数据库连接对象线程内共享（支持sql、mysql、sqlite、oracle等数据库）
        /// </summary>
        /// <param name="connectionSettingName">app.config 或 webconfig中配置的数据库连接字符串名称</param>
        public static IDbConnection CreateConnection(string connectionSettingName = null)
        {

            if (string.IsNullOrEmpty(connectionSettingName))
            {
                connectionSettingName = DBConnectionConfigs._DefaultConnectionString;
            }
            ConnectionStringSettings settings = ConnectionStringReadingUtil.GetConnectionStringSettings(connectionSettingName);

            IDbConnection _conn;
            if (ConnectionDictionArray.ContainsKey(connectionSettingName))
            {
                _conn = ConnectionDictionArray[connectionSettingName];
                if (_conn.State == ConnectionState.Closed)
                {
                    _conn.ConnectionString = settings.ConnectionString;
                    _conn.Open();
                }
                return _conn;
            }
            else
            {

                DbProviderFactory dbfactory = DbProviderFactories.GetFactory(settings.ProviderName);
                _conn = dbfactory.CreateConnection();
                _conn.ConnectionString = settings.ConnectionString;
                if (_conn.State == ConnectionState.Closed)
                {
                    try
                    {
                        _conn.Open();
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
                ConnectionDictionArray.TryAdd(connectionSettingName, _conn);
                return _conn;
            }


        }
    }
}

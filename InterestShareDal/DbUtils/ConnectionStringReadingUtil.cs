using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShareDal.DbUtils
{
    public class ConnectionStringReadingUtil
    {
        public static ConnectionStringSettings GetConnectionStringSettings(string CononectionStringName)
        {
            if (ConfigurationManager.ConnectionStrings[CononectionStringName] == null)
            {
                throw new ArgumentNullException("未发现任何Dapper.Net数据库配置节点，请检查！");
            }
            ConnectionStringSettings settings = ConfigurationManager.ConnectionStrings[CononectionStringName];

            return settings;
        }
    }
    public sealed class DBConnectionConfigs
    {
        /// <summary>
        /// 默认链接字符串
        /// </summary>
        public static readonly string _DefaultConnectionString = "_DefaultConnectionString";
    }
}

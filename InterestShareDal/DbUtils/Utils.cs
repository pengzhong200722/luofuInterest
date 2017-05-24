/* ==============================================================================
 * 功能描述：DapperPagerUtils  
 * 创 建 者：000155
 * 创建日期：2016/8/2 21:24:13
 * ==============================================================================*/

using Dapper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace EB.SaleChannnel.DAL
{
    /// <summary>
    /// dapper分页帮助方法。
    /// </summary>
    public sealed class DapperPagerUtils
    {
        private static readonly ConcurrentDictionary<Type, List<PropertyInfo>> _paramCache = new ConcurrentDictionary<Type, List<PropertyInfo>>();

        /// <summary>
        /// 创建查询语句。
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="table"></param>
        /// <param name="selectPart"></param>
        /// <param name="isOr"></param>
        /// <returns></returns>
        public static string BuildQuerySQL(dynamic condition, string table, string selectPart = "*", bool isOr = false)
        {
            var conditionObj = condition as object;
            var properties = GetProperties(conditionObj);
            if (properties.Count == 0)
            {
                return string.Format("SELECT {1} FROM {0}", table, selectPart);
            }

            var separator = isOr ? " OR " : " AND ";
            var wherePart = string.Join(separator, properties.Select(p => p + " = @" + p));

            return string.Format("SELECT {2} FROM {0} WHERE {1}", table, wherePart, selectPart);
        }

        /// <summary>
        /// 获取属性名称字符串列表
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static List<string> GetProperties(object obj)
        {
            if (obj == null)
            {
                return new List<string>();
            }
            if (obj is DynamicParameters)
            {
                return (obj as DynamicParameters).ParameterNames.ToList();
            }
            return GetPropertyInfos(obj).Select(x => x.Name).ToList();
        }
        /// <summary>
        /// 获取属性对象列表
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static List<PropertyInfo> GetPropertyInfos(object obj)
        {
            if (obj == null)
            {
                return new List<PropertyInfo>();
            }

            List<PropertyInfo> properties;
            if (_paramCache.TryGetValue(obj.GetType(), out properties)) return properties.ToList();
            properties = obj.GetType().GetProperties(BindingFlags.GetProperty | BindingFlags.Instance | BindingFlags.Public).ToList();
            _paramCache[obj.GetType()] = properties;
            return properties;
        }



        /// <summary>
        /// 获取属性对象列表
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static List<PropertyInfo> GetPropertyInfosByType(Type t)
        {
            if (t == null)
            {
                return new List<PropertyInfo>();
            }
            List<PropertyInfo> properties;
            if (_paramCache.TryGetValue(t.GetType(), out properties)) return properties.ToList();
            properties=t.GetProperties().ToList();
            _paramCache[t] = properties;
            return properties;
        }

    }
}

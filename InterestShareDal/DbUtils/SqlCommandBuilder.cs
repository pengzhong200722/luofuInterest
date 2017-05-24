/* ==============================================================================
 * 功能描述：SqlCommandBuilder  
 * 创 建 者：000155
 * 创建日期：2016/7/11 21:19:53
 * ==============================================================================*/

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
    /// 根据类实体 构建SQL语句。
    /// </summary>
    public class SqlCommandBuilder
    {

        private static string selectString = "SELECT {0} FROM {1} WHERE 1=1";
        private static string selectStringWithNoLock = "SELECT {0} FROM {1} WITH (NOLOCK) WHERE 1=1";
        private static string insertString = "INSERT INTO {0}({1}) OUTPUT INSERTED.{2} VALUES (@{3})";
        private static string updateString = "UPDATE {0} SET {1} WHERE 1=1 ";
        private static string deleteString = "DELETE FROM {0} WHERE 1=1 ";
        private static string selectPageString = "SELECT {0},(SELECT COUNT(1) FROM [{1}]  WHERE 1=1 {3} ) AS COUNT FROM [{1}] WHERE {2} IN (SELECT TOP {4} {2} FROM (SELECT TOP {5} {2} FROM [{1}] WHERE 1=1 {3}  ORDER BY  {2} )TA ORDER BY {2} DESC)     ORDER BY {2}";
       
        /// <summary>
        /// 生成查询语句
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static string GetSelectCommandStringByType<T>(string conditions = "") where T : class
        {
            PropertyInfo[] properties = DapperPagerUtils.GetPropertyInfosByType(typeof(T)).ToArray();
            var columns = properties.Select(p => "" + p.Name + "").ToArray();
            string str = string.Format(selectString, String.Join(",", columns), typeof(T).Name);

            if (string.IsNullOrEmpty(conditions))
            {
                return str;
            }
            else
            {

                return str + " AND " + conditions;
            }

        }
 
        /// <summary>
        /// 生成查询 WITH NO LOCK 语句 此模式在高并发下允许脏读 （相当于READ UNCOMMITTED）无法保证数据的一致性
        /// 但是对性能较好。高并发情况下推荐使用此方法。
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static string GetSelectWithNoLockCommandStringByType<T>(string conditions = "") where T : class
        {
            PropertyInfo[] properties = DapperPagerUtils.GetPropertyInfosByType(typeof(T)).ToArray();
            var columns = properties.Select(p => ""+p.Name+"").ToArray();
            string str = string.Format(selectStringWithNoLock, String.Join(",", columns), typeof(T).Name);

            if (string.IsNullOrEmpty(conditions))
            {
                return str;
            }
            else
            {

                return str + " AND " + conditions;
            }

        }

        /// <summary>
        /// 生成插入语句 
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <returns></returns>
        public static string GetInsertCommandStringByType<T>(string keyName = "") where T : class
        {
            PropertyInfo[] properties = DapperPagerUtils.GetPropertyInfosByType(typeof(T)).ToArray();
            if (properties.Count() < 1)
            {
                throw new Exception("传入对象不具有属性，请检查传递对象！");
            }

            var columnsCommand = properties.Where(o => !o.Name.Equals(keyName)).Select(p => "[" + p.Name + "]").ToArray();
            var columnsValue = properties.Where(o => !o.Name.Equals(keyName)).Select(p => p.Name).ToArray();

            //var columns = props.Select(p => p.Name).Where(o => o != "Count" && o != keyName).ToArray();
            return string.Format(insertString,
                                  typeof(T).Name,
                                 String.Join(",", columnsCommand), properties[0].Name,
                                 String.Join(",@", columnsValue));
        }

        /// <summary>
        /// 生成过滤掉标识列的SQL插入语句命令
        /// </summary>
        /// <typeparam name="T">泛型类名</typeparam>
        /// <param name="keyName">标识列名称</param>
        /// <returns></returns>
        public static string GetInsertCommandFilteredIdentityColumn<T>(string keyName) where T : class
        {
            PropertyInfo[] properties = DapperPagerUtils.GetPropertyInfosByType(typeof(T)).ToArray();
            if (properties.Count() < 1)
            {
                throw new Exception("传入对象不具有属性，请检查传递对象！");
            }
            var columnsCommand = properties.Where(o => !o.Name.Equals(keyName)).Select(p => "[" + p.Name + "]").ToArray();
            var columnsValue = properties.Where(o => !o.Name.Equals(keyName)).Select(p => p.Name).ToArray();

            return string.Format(insertString,
                                  typeof(T).Name,
                                 String.Join(",", columnsCommand), properties[0].Name,
                                 String.Join(",@", columnsValue));
        }



        /// <summary>
        /// 根据类型生成Update 语句 必须输入条件
        /// </summary>
        /// <typeparam name="T">数据类型。</typeparam>
        /// <param name="conditions">条件 "例如：ID=@ID"</param>
        /// <param name="keyName">条件 主键列一般是不能更新的 所以要过滤掉。</param>
        /// <returns></returns>
        public static string GetUpdateCommandStringFilteredIdentityByType<T>(string conditions, string keyName) where T : class
        {
            if (string.IsNullOrEmpty(conditions) || string.IsNullOrWhiteSpace(conditions))
            {  //防止误操作 更新所有数据~
                throw new Exception("为保证数据库安全，更新语句必须提供更新范围条件！");
            }
            PropertyInfo[] properties = DapperPagerUtils.GetPropertyInfosByType(typeof(T)).ToArray();
            var columns = properties.Where(o => !o.Name.Equals(keyName)).Select(p => p.Name ).ToArray();
            var parameters = columns.Select(name => "["+name+"]" + "=@" + name).ToList();

            string str = String.Format(updateString,
                                typeof(T).Name,
                                 String.Join(",", parameters));

            if (string.IsNullOrEmpty(conditions))
            {
                return str;
            }
            else
            {
                return str + " AND " + conditions;
            }
        }


        /// <summary>
        /// 根据类型生成Update 语句 必须输入条件
        /// </summary>
        /// <typeparam name="T">数据类型。</typeparam>
        /// <param name="conditions">条件 "例如：ID=@ID"</param>
        /// <param name="keyName">条件 主键列一般是不能更新的 所以要过滤掉。</param>
        /// <returns></returns>
        public static string GetUpdateCommandStringByType<T>(string conditions, string keyName) where T : class
        {
            if (string.IsNullOrEmpty(conditions) || string.IsNullOrWhiteSpace(conditions))
            {  //防止误操作 更新所有数据~
                throw new Exception("为保证数据库安全，更新语句必须提供更新范围条件！");
            }
            PropertyInfo[] properties = DapperPagerUtils.GetPropertyInfosByType(typeof(T)).ToArray();
            var columns = properties.Where(o => !o.Name.Equals(keyName)).Select(p => p.Name).ToArray();
            var parameters = columns.Select(name => "[" + name + "]" + "=@" + name).ToList();

            string str = String.Format(updateString, typeof(T).Name, String.Join(",", parameters));

            //if (!string.IsNullOrEmpty(keyName))
            //{
            //    str = str.Replace("@" + keyName + ",", "").Replace(keyName + "=", "");
            //}

            if (string.IsNullOrEmpty(conditions))
            {
                return str;
            }
            else
            {
                return str + " AND " + conditions;
            }
        }


        /// <summary>
        /// 生成删除语句 必须输入条件
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conditions">条件 "例如：ID=@ID"</param>
        /// <returns></returns>
        public static string GetDeleteCommandStringByType<T>(string conditions) where T : class
        {
            if (string.IsNullOrEmpty(conditions) || string.IsNullOrWhiteSpace(conditions))
            {
                //防止误操作 删除所有数据~
                throw new Exception("为保证数据库安全，删除语句必须提供删除范围条件！");
            }
            string str = String.Format(deleteString,
                                typeof(T).Name);
            if (string.IsNullOrEmpty(conditions))
            {
                return str;
            }
            else
            {
                return str + " AND " + conditions;
            }
        }
    }
}

/* ==============================================================================
 * 功能描述：PageCondition  
 * 创 建 者：000155
 * 创建日期：2016/7/25 20:24:15
 * ==============================================================================*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EB.SaleChannnel.DAL
{
    /// <summary>
    /// 分页查询条件
    /// </summary>
    public class PageCondition
    {
        #region Member Field
        private string _TableName;
        private string _Fileds = "*";
        private string _PrimaryKey = "ID";
        private int _PageSize = 10;
        private int _CurrentPage = 1;
        private string _Sort = string.Empty;
        private string _Condition = string.Empty;
        private int _RecordCount;
        #endregion 


        #region Properties
        public string TableName
        {
            get { return _TableName; }
            set { _TableName = value; }
        }

        public string Fields
        {
            get { return _Fileds; }
            set { _Fileds = value; }
        }

        public string PrimaryKey
        {
            get { return _PrimaryKey; }
            set { _PrimaryKey = value; }
        }

        public int PageSize
        {
            get { return _PageSize; }
            set { _PageSize = value; }
        }

        public int CurrentPage
        {
            get { return _CurrentPage; }
            set { _CurrentPage = value; }
        }

        public string Sort
        {
            get { return _Sort; }
            set { _Sort = value; }
        }

        public string Condition
        {
            get { return _Condition; }
            set { _Condition = value; }
        }

        public int RecordCount
        {
            get { return _RecordCount; }
            set { _RecordCount = value; }
        }
        #endregion 
    }
}

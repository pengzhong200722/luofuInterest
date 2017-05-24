using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShare.Model
{
    public class CommonPagedDataViewModel<T>
    {
        private int _TotalNum;
        public CommonPagedDataViewModel()
        {
            this._Items = new List<T>();
        }
        public int TotalNum
        {
            get { return _TotalNum; }
            set { _TotalNum = value; }
        }
        private IList<T> _Items;
        public IList<T> Items
        {
            get { return _Items; }
            set { _Items = value; }
        }
        public int CurrentPage { get; set; }
        public int TotalPageCount { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShare.Model.Models
{
    public class ResourceModel: BaseModel
    {
        public int ID { get; set; }
        public string ResourceName { get; set; }
        public string ResourceLink { get; set; }
        public string ResourcePassword { get; set; }
        public string ResourceImg { get; set; }
        /// <summary>
        /// 是否启用
        /// </summary>
        private bool isEnaable = true;
        public bool IsEnable
        {
            get
            {
                return isEnaable;
            }
            set
            {
                isEnaable = value;
            }
        }
        /// <summary>
        /// 备注
        /// </summary>
        private string remark = string.Empty;
        public string Remark
        {
            get
            {
                return remark;
            }
            set
            {
                remark = value;
            }
        }

        /// <summary>
        /// 记录创建时间
        /// </summary>
        public DateTime CreateTime { get; set; }
        /// <summary>
        /// 记录最后更新时间
        /// </summary>
        public DateTime LastUpdateTime { get; set; }
    }
}

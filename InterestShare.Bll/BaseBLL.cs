using luofu_InterestShare.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShare.Bll
{
    public class BaseBLL : IBaseBLL
    {
        /// <summary>
        /// Mapping工具
        /// </summary>
        private IMapper _mapper;
        public IMapper Mapper
        {
            get
            {
                if (null == _mapper)
                {
                    _mapper = MapperUtil.GetMapper();
                }
                return _mapper;
            }
        }

    }
}

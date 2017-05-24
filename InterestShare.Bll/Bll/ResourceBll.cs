using InterestShare.Bll.IBll;
using InterestShare.Model;
using InterestShare.Model.Models;
using InterestShareDal;
using InterestShareDal.Dal;
using InterestShareDal.IDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShare.Bll.Bll
{
    public class ResourceBll: BaseBLL,IResourceBll
    {
             public IResourceDAL ResourceDal
        {
            get
            {
                return DalFactory.GetDalInstance<ResourceDAL>();
            }
        }
        public CommonPagedDataViewModel<ResourceModel> GetResourceByCondition(int pageIndex, int pageSize, string name, string code)
        {
            return ResourceDal.GetResourceByCondition(pageIndex, pageSize, name, code);
        }

        public int InsertResource(ResourceModel model)
        {
            return ResourceDal.InsertResource(model);
        }

        public ResourceModel GetResourceById(long id)
        {
            return ResourceDal.GetResourceById(id);
        }
        public List<ResourceModel> GetResource()
        {
            return ResourceDal.GetResource();
        }
        public int DeleteResource(long id)
        {
            return ResourceDal.DeleteResource(id);
        }
    }
}

using InterestShare.Model;
using InterestShare.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShareDal.IDal
{
    public interface IResourceDAL
    {
        CommonPagedDataViewModel<ResourceModel> GetResourceByCondition(int pageIndex, int pageSize,
         string name, string code);
        int InsertResource(ResourceModel model);
        ResourceModel GetResourceById(long id);
        List<ResourceModel> GetResource();
        int DeleteResource(long id);
    }
}

using EB.SaleChannnel.DAL;
using InterestShare.Model;
using InterestShare.Model.Models;
using InterestShareDal.IDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShareDal.Dal
{
    public class ResourceDAL : BaseDAL, IResourceDAL
    {
        public CommonPagedDataViewModel<ResourceModel> GetResourceByCondition(int pageIndex, int pageSize, string name, string code)
        {
            CommonPagedDataViewModel<ResourceModel> pageResult = new CommonPagedDataViewModel<ResourceModel>();
            try
            {
                StringBuilder sql = new StringBuilder();
                StringBuilder condition = new StringBuilder();
                if (!string.IsNullOrEmpty(name))
                {
                    condition.Append(" and ResourceName like '%' + @ResourceName + '%'");
                }
                sql.AppendFormat(@" 
                          set @coun=(select count(id) from Resource where 1=1 );
                         SELECT 
                           ID,
                           ResourceName 
                          ,ResourceLink
                          ,ResourcePassword,
                          ResourceImg
                          ,IsEnable
                          ,Remark
                          ,CreateTime
                          ,LastUpdateTime,@coun as Coun
                           FROM Resource bs
                            WHERE 1 = 1 {2} LIMIT {0},{1}", (pageIndex - 1) * pageSize, pageSize, condition.ToString());
                var result = EBDapperHelper.Query<ResourceModel>(sql.ToString(), new { Resource = name }).ToList();
                pageResult.Items = result;
                pageResult.CurrentPage = pageIndex;
                if (result != null && result.Count > 0)
                {
                    pageResult.TotalNum = result[0].Coun;
                    pageResult.TotalPageCount = result[0].Coun;
                }
            }
            catch (Exception ex)
            {

            }
            return pageResult;
        }

        /// <summary>
        /// 业务系统数据插入
        /// </summary>
        /// <returns></returns>
        public int InsertResource(ResourceModel model)
        {
            int result = 0;
            try
            {
                StringBuilder sql = new StringBuilder();
                if (model.ID == 0)
                {
                    sql.Append("insert  into Resource values(0,@ResourceName,@ResourceLink,@ResourcePassword,@ResourceImg,@IsEnable,@Remark,Now(),Now())");
                    result = EBDapperHelper.InsertSingle(sql.ToString(), model);
                }
                else if (model.ID > 0)
                {
                    sql.Append("update Resource set ResourceName=@ResourceName,ResourceLink=@ResourceLink,ResourcePassword=@ResourcePassword,ResourceImg=@ResourceImg,IsEnable=@IsEnable,Remark=@Remark,LastUpdateTime=Now() where ID=@ID");
                    result = EBDapperHelper.UpdateSingle<ResourceModel>(sql.ToString(), model);
                }
            }
            catch
            {

            }
            return result;
        }

        /// <summary>
        /// 根据id查询业务系统
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ResourceModel GetResourceById(long id)
        {
            ResourceModel result = new ResourceModel();
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("select * from Resource where ID=@ID");
                result = EBDapperHelper.Query<ResourceModel>(sql.ToString(), new { ID = id }).FirstOrDefault();
            }
            catch
            {

            }
            return result;
        }
        /// <summary>
        /// 查询所有平台信息
        /// </summary>
        /// <returns></returns>
        public List<ResourceModel> GetResource()
        {
            List<ResourceModel> result = new List<ResourceModel>();
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("select * from Resource where IsEnable=1");
                result = EBDapperHelper.Query<ResourceModel>(sql.ToString(), null).ToList();
            }
            catch
            {

            }
            return result;
        }
        /// <summary>
        /// 根据id删除业务系统
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int DeleteResource(long id)
        {
            int result = 0;
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("delete from Resource where ID=@ID");
                result = EBDapperHelper.Delete(sql.ToString(), new { ID = id });
            }
            catch
            {

            }
            return result;
        }
    }
}

using InterestShareDal.IDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InterestShare.Model.Models;
using EB.SaleChannnel.DAL;

namespace InterestShareDal.Dal
{
    public class UserDal : BaseDAL, IUserDal
    {
        public User Query(string account)
        {
            User result = new User();
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("select * from User where Account=@Account");
                result = EBDapperHelper.Query<User>(sql.ToString(), new { Account = account }).FirstOrDefault();
            }
            catch(Exception ex)
            {

            }
            return result;
        }

        public List<User> QueryList(string conditions, object conditionValues)
        {
            return EBDapperHelper.Query<User>(SqlCommandBuilder.GetSelectCommandStringByType<User>(conditions), conditionValues).ToList();
        }
    }
}

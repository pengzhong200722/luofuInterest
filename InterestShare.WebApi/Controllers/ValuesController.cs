using InterestShare.Bll;
using InterestShare.Bll.Bll;
using InterestShare.Bll.IBll;
using InterestShare.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace InterestShare.WebApi.Controllers
{

    public class ValuesController : ApiController
    {
        protected IUserBll userbll
        {
            get
            {
                return BllFactory.GetBLLInstance<UserBll>();
            }
        }
        // GET api/values
        public IEnumerable<string> Get()
        {
            User model=userbll.Query("test");
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}

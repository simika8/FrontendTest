using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackendSimulator
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        // GET: api/Products
        [HttpGet()]
        //public async Task<ActionResult<(IEnumerable<Product> Data, string Cursor)>> GetProducts(string keyword, int skip, int take, int minTimeMs, int maxTimeMs)
        public async Task<ActionResult<ApiResultWithPaging<IEnumerable<Product>>>> GetProducts(string keyword, string? cursor, int take = 1, int minTimeMs = 1000, int maxTimeMs = 1000)
        {
            var rndTime = new Random(keyword.GetHashCode());
            var d = rndTime.NextDouble();
            var timeMs = (int)(Math.Pow(d, 4) * (maxTimeMs - minTimeMs) + minTimeMs);


            //var firstId = ProductNameNumber.ProductNameToNumber("Aaachl", 1, 200000);


            var sw = System.Diagnostics.Stopwatch.StartNew();


            var res = RandomProduct.Generate(keyword, cursor, take);

            sw.Stop();

            if (timeMs - (int)sw.ElapsedMilliseconds > 0)
                await Task.Delay(timeMs - (int)sw.ElapsedMilliseconds);
            //var a = new { dataasd: res, cursor:  "asdf" };
            var res2 = new ApiResultWithPaging<IEnumerable<Product>>()
            {
                Data = res,
                Cursor = (res.Count > 0 && res.Count == take)
                    ? System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(res.Last().Name)) 
                    : "",
                //Keyword = keyword,
            };
            return res2;
        }

        /*// GET: api/<ProductsController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ProductsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ProductsController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ProductsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ProductsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }*/
    }
}

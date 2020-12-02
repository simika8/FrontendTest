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
        //public async Task<ActionResult<(IEnumerable<Product> Data, string Cursor)>> GetProducts(string keyword, int skip, int take, int minTimeoutMs, int maxTimeoutMs)
        public async Task<ActionResult<ApiResultWithPaging<IEnumerable<Product>>>> GetProducts(string keyword, string? cursor, int take = 1, int minTimeoutMs = 1000, int maxTimeoutMs = 1000)
        {
            var rndTime = new Random(keyword.GetHashCode());
            var d = rndTime.NextDouble();
            var timeoutMs = (int)(Math.Pow(d, 4) * (maxTimeoutMs - minTimeoutMs) + minTimeoutMs);

            using var md5 = MD5.Create();

            //var firstId = ProductNameNumber.ProductNameToNumber("Aaachl", 1, 200000);

            var cursorDecoded = cursor == null ? "" : System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(cursor));
            var range = ProductNameNumber.GetVisibleProductNumberRange(keyword, cursorDecoded, 1, 200000);

            var sw = System.Diagnostics.Stopwatch.StartNew();

            var res = new List<Product>();
            for (var x = 0; x < 1; x++)
            {
                res.Clear();


                for (var productNumber = range.first; productNumber <= Math.Min(range.first + take -1, range.last); productNumber++)
                {
                    var rnd = new Random(productNumber);
                    var name = ProductNameNumber.NumberToProductName(productNumber, 1, 200000);
                    if (name != null)
                    {
                        var id = new Guid(md5.ComputeHash(Encoding.Default.GetBytes(name)));//cikknévből generált guid. Nem jó megoldás, de teszthez megfelel
                        var p = new Product()
                        {
                            //Id = Guid.NewGuid(),
                            Id = id,
                            Name = name,
                            Price = rnd.Next(5000) + 100,
                            Stock = rnd.Next(2) * (rnd.Next(5) * rnd.Next(5) + rnd.Next(5)),
                            Description = ProductNameNumber.RandomSentences(rnd.Next(5, 10), rnd.Next(3, 10), rnd),
                        };
                        res.Add(p);
                    }
                }
            }
            sw.Stop();

            if (timeoutMs - (int)sw.ElapsedMilliseconds > 0)
                await Task.Delay(timeoutMs - (int)sw.ElapsedMilliseconds);
            //var a = new { dataasd: res, cursor:  "asdf" };
            var res2 = new ApiResultWithPaging<IEnumerable<Product>>()
            {
                Data = res,
                Cursor = (res.Count > 0 && res.Count == take)
                    ? System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(res.Last().Name)) 
                    : "",
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

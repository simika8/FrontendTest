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
    public class SalesController : ControllerBase
    {

        // GET: api/Sales?productId=3fa85f64-5717-4562-b3fc-2c963f66afa6&minTimeMs=3000&maxTimeMs=3000
        [HttpGet()]
        public async Task<ActionResult<IEnumerable<Sales>>> GetSales(Guid productId, int minTimeMs = 3000, int maxTimeMs = 3000)
        {
            var rndTime = new Random(productId.GetHashCode());
            var timeMs = (int)(Math.Pow(rndTime.NextDouble(), 4) * (maxTimeMs - minTimeMs) + minTimeMs);
            var sw = System.Diagnostics.Stopwatch.StartNew();

            var rnd = new Random(productId.GetHashCode());

            using var md5 = MD5.Create();

            var res = new List<Sales>();

            for (var m = 1; m <= 3; m++)
            {
                var sales = new Sales()
                {
                    Month = "2020.0" + m.ToString(),
                    Quantity = rnd.Next(1, 20),
                };
                res.Add(sales);
            }


            sw.Stop();

            if (timeMs - (int)sw.ElapsedMilliseconds > 0)
                await Task.Delay(timeMs - (int)sw.ElapsedMilliseconds);

            return res;
        }

    }
}

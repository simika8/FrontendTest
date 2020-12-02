using Microsoft.AspNetCore.Mvc;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackendSimulator
{
    [Route("api/[controller]")]
    [ApiController]
    public class PicturesController : ControllerBase
    {

        // GET: api/Pictures?productId=3fa85f64-5717-4562-b3fc-2c963f66afa6&minTimeoutMs=100&maxTimeoutMs=3000
        [HttpGet()]
        public async Task<ActionResult> GetPictures(Guid productId, int minTimeoutMs=100, int maxTimeoutMs=3000)
        {

            var rndTime = new Random(productId.GetHashCode());
            var timeoutMs = (int)(Math.Pow(rndTime.NextDouble(), 4) * (maxTimeoutMs - minTimeoutMs) + minTimeoutMs);
            var sw = System.Diagnostics.Stopwatch.StartNew();

            using var bmp = new System.Drawing.Bitmap(150, 150);
            using var g = Graphics.FromImage(bmp);

            var rnd = new Random(productId.GetHashCode());

            var bgcolor = Color.FromArgb((byte)rnd.Next(160, 255), (byte)rnd.Next(160, 255), (byte)rnd.Next(160, 255));

            g.Clear(bgcolor);

            Pen pen = new Pen(Color.FromArgb((byte)rnd.Next(0, 128), (byte)rnd.Next(0, 128), (byte)rnd.Next(0, 128)));
            pen.Width = 3;

            //Draw red rectangle to go behind cross
            Rectangle rect = new Rectangle(30, 30, 90, 90);
            g.FillRectangle(new SolidBrush(Color.FromArgb((byte)rnd.Next(0, 128), (byte)rnd.Next(0, 128), (byte)rnd.Next(0, 128))), rect);
            g.DrawEllipse(pen, 20, 20, 110, 110);




            var memStream = new MemoryStream();
            bmp.Save(memStream, ImageFormat.Jpeg);

            var res = File(memStream.ToArray(), "image/jpeg");
            sw.Stop();

            if (timeoutMs - (int)sw.ElapsedMilliseconds > 0)
                await Task.Delay(timeoutMs - (int)sw.ElapsedMilliseconds);//*/
            /*if (timeoutMs - (int)sw.ElapsedMilliseconds > 0)
                System.Threading.Thread.Sleep(timeoutMs - (int)sw.ElapsedMilliseconds);//*/

            return res;

        }

    }
}

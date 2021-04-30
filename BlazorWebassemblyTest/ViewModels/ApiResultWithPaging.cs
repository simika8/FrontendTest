using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackendSimulator
{
    public class ApiResultWithPaging<TData> where TData : class
    {
        public TData? Data { get; set; }
        public string Cursor { get; set; } = null!;
        //public string Keyword { get; set; } = null!;
    }


}

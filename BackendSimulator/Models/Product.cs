using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackendSimulator
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public double Price { get; set; }
        public double Stock { get; set; }
        public string Description { get; set; } = null!;
    }
}

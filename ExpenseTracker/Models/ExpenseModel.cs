using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker.Models
{
    public class ExpenseModel
    {
        public ObjectId Id { get; set; }
        public string IdString { get {
                try
                {
                    return Id.ToString();
                }
                catch (Exception)
                {

                    return "";
                }
            } }
        public string Category { get; set; }
        public string PaymentType { get; set; }
        public double Amount { get; set; }
        public string Notes { get; set; }
        public DateTime EntryDate { get; set; }
        public string Receipt_PIC { get; set; }
    }
}

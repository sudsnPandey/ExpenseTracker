using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ExpenseTracker.Models;
using ExpenseTracker;
using MongoDB.Bson;

namespace ExpenseTracker.Controllers
{
    public class HomeController : Controller
    {
        
        IMongoCollection<ExpenseModel> Expenses;
        public HomeController()
        {
            var client = new MongoClient(Properties.Resources.ResourceManager.GetString("mongoDBConnectionString"));
            Expenses = client.GetDatabase("expenses").GetCollection<ExpenseModel>("expenses");

        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Details(string payment_type)
        {
            ViewData["Title"] = payment_type + " - Expenses";
            var field_filter = Builders<ExpenseModel>.Projection.Include(p => p.Category)
                                                                    .Include(p => p.Amount)
                                                                    .Include(p => p.Notes)
                                                                    .Include(p => p.EntryDate);
            var expenses = Expenses.Find(Builders<ExpenseModel>.Filter.Eq(e => e.PaymentType, payment_type)).ToListAsync().Result;
            //remove images from expenses
            foreach(var e in expenses)
            {
                e.Receipt_PIC = null;
            }
            return View(expenses);
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }

        #region create
        [HttpPost]
        public IActionResult InsertExpense(ExpenseModel em)
        {
            try
            {
                Expenses.InsertOneAsync(em).Wait();
                //return RedirectToAction("Index");
                return Json(true);
            }
            catch
            {
                //return RedirectToAction("Error");
                return Json(false);
            }
        }
        #endregion
        #region Get
        [HttpPost]
        public IActionResult GetSpendings()
        {
            try
            {
                var field_filter = Builders<ExpenseModel>.Projection.Include(p => p.PaymentType)
                                                                    .Include(p => p.Amount);
                var expenses = Expenses.Find(new BsonDocument()).Project<ExpenseModel>(field_filter).ToListAsync().Result;
                double ae_expenses = 0; double dscvr_expense = 0; double visa_expense = 0;
                if(expenses != null) { 
                foreach(var e in expenses)
                {
                    switch (e.PaymentType)
                    {
                        case "AE":
                            ae_expenses += e.Amount;
                            break;
                        case "DSCVR":
                            dscvr_expense += e.Amount;
                            break;
                        case "CHASEVISA":
                            visa_expense += e.Amount;
                            break;
                    }
                }
                }
                //create a Json String
                var json_string = "{\"AE\":\""+ ae_expenses +"\", \"DSCVR\":\"" +dscvr_expense+ "\", \"CHASEVISA\":\""+visa_expense+"\" }";
                return Json(json_string);
            }
            catch (Exception)
            {

                return RedirectToAction("Error");
            }
        }
        #endregion
    }
}

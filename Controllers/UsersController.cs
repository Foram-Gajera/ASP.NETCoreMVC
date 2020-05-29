using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using UserListMVC.Models;

namespace UserListMVC.Controllers
{
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext _db;
        public UsersController(ApplicationDbContext db)
        {
            _db = db;
        }

        [BindProperty]
        public User User { get; set; }
       
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Upsert(int? id)
        {
            User = new User();
            if (id == null)
            {
                return View(User);
            }
            User = _db.Users.FirstOrDefault(u => u.Id == id);
            if(User==null)
            {
                return NotFound();
            }
            return View(User);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Upsert()
        {
            if (ModelState.IsValid)
            {
                if (User.Id == 0)
                {
                    _db.Users.Add(User);
                }
                else
                {
                    _db.Users.Update(User);
                }
                _db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(User);
        }


        #region API Calls

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Json(new { data = await _db.Users.ToListAsync()});
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var UserFromDB = await _db.Users.FindAsync(id);
            if (UserFromDB == null)
            {
                return Json(new { success=false, message="Error while deleting"});
            }
            _db.Users.Remove(UserFromDB);
            await _db.SaveChangesAsync();
            return Json(new { success = true, message = "Delete Successfull" });
        }
        #endregion
    }
}
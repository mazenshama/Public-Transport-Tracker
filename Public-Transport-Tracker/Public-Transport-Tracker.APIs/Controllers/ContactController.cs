using Microsoft.AspNetCore.Mvc;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.APIs.Models; // للوصول إلى CreateContactRequest

namespace Public_Transport_Tracker.APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // المسار هو: /api/contact
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost] // المسار هو: /api/contact
        public async Task<IActionResult> CreateContact([FromBody] CreateContactRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }

                // التحقق من الحقول المطلوبة (Name, Email, Message)
                if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Message))
                {
                    return BadRequest(new { success = false, message = "Name, email, and message are required" });
                }

                var contact = await _contactService.CreateContactAsync(
                    request.Name,
                    request.Email,
                    request.Phone,
                    request.Subject,
                    request.Message
                );

                // إرجاع استجابة نجاح (200 OK)
                return Ok(new
                {
                    success = true,
                    message = "Message sent successfully!",
                    contact = new
                    {
                        id = contact.Id.ToString(),
                        submittedAt = contact.SubmittedAt.ToString("O")
                    }
                });
            }
            // يمكن أن يحدث هذا الخطأ إذا فشل الحفظ في قاعدة البيانات
            catch (InvalidOperationException ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                // تسجيل الخطأ الداخلي
                Console.WriteLine($"Error creating public contact: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An internal error occurred." });
            }
        }
    }
}
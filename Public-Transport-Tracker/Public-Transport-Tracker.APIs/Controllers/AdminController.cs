using Microsoft.AspNetCore.Mvc;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.APIs.Models;
using Microsoft.AspNetCore.Authorization; // NEW: يجب استيراد هذا

namespace Public_Transport_Tracker.APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // NEW: تقييد الوصول لدور "Admin"
    public class AdminController : ControllerBase
    {
        private readonly IBusService _busService;
        private readonly IRouteService _routeService;
        private readonly IContactService _contactService;

        public AdminController(IBusService busService, IRouteService routeService, IContactService contactService)
        {
            _busService = busService;
            _routeService = routeService;
            _contactService = contactService;
        }

        [HttpGet("buses")]
        public async Task<IActionResult> GetBuses()
        {
            try
            {
                var buses = await _busService.GetAllBusesAsync();
                return Ok(new
                {
                    buses = buses.Select(b => new
                    {
                        id = b.Id.ToString(),
                        number = b.Number,
                        capacity = b.Capacity,
                        routeName = b.Route?.RouteName,
                        status = b.Status
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error fetching buses: {ex.Message}" });
            }
        }

        [HttpGet("routes")]
        public async Task<IActionResult> GetRoutes()
        {
            try
            {
                var routes = await _routeService.GetAllRoutesAsync();
                return Ok(new
                {
                    routes = routes.Select(r => new
                    {
                        id = r.Id.ToString(),
                        busNumber = r.BusNumber,
                        routeName = r.RouteName,
                        // استخدام string.IsNullOrWhiteSpace للتعامل مع السلسلة الفارغة
                        stops = string.IsNullOrWhiteSpace(r.Stops) ? Array.Empty<string>() : r.Stops.Split(',').Select(s => s.Trim()).ToArray(),
                        startTime = r.StartTime,
                        endTime = r.EndTime,
                        frequency = r.Frequency
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error fetching routes: {ex.Message}" });
            }
        }

        [HttpPost("buses")]
        public async Task<IActionResult> CreateBus([FromBody] CreateBusRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }

                if (string.IsNullOrWhiteSpace(request.Number) || request.Capacity <= 0)
                {
                    return BadRequest(new { success = false, message = "Number and capacity are required. Capacity must be greater than 0." });
                }

                var bus = await _busService.CreateBusAsync(request.Number, request.Capacity, request.RouteName);

                return Ok(new
                {
                    success = true,
                    bus = new
                    {
                        id = bus.Id.ToString(),
                        number = bus.Number,
                        capacity = bus.Capacity,
                        status = bus.Status,
                        routeName = bus.Route?.RouteName
                    }
                });
            }
            catch (InvalidOperationException ex)
            {
                // يتم إرجاع الأخطاء من طبقة الخدمة مباشرة (مثل فشل الحفظ)
                return StatusCode(500, new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred while creating the bus: {ex.Message}" });
            }
        }

        [HttpDelete("buses/{id}")]
        public async Task<IActionResult> DeleteBus(string id)
        {
            if (!Guid.TryParse(id, out var busId))
            {
                return BadRequest(new { success = false, message = "Invalid bus ID" });
            }

            var result = await _busService.DeleteBusAsync(busId);
            if (!result)
            {
                return NotFound(new { success = false, message = "Bus not found" });
            }

            return Ok(new { success = true });
        }

        [HttpPost("routes")]
        public async Task<IActionResult> CreateRoute([FromBody] CreateRouteRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }

                if (string.IsNullOrWhiteSpace(request.RouteName) || string.IsNullOrWhiteSpace(request.BusNumber))
                {
                    return BadRequest(new { success = false, message = "Route name and bus number are required" });
                }

                var stops = string.Join(",", request.Stops ?? Array.Empty<string>());
                var route = await _routeService.CreateRouteAsync(
                    request.RouteName,
                    request.BusNumber,
                    stops,
                    request.StartTime ?? string.Empty,
                    request.EndTime ?? string.Empty,
                    request.Frequency ?? string.Empty
                );

                return Ok(new
                {
                    success = true,
                    route = new
                    {
                        id = route.Id.ToString(),
                        busNumber = route.BusNumber,
                        routeName = route.RouteName,
                        stops = route.Stops.Split(',').Select(s => s.Trim()).ToArray(),
                        startTime = route.StartTime,
                        endTime = route.EndTime,
                        frequency = route.Frequency
                    }
                });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred while creating the route: {ex.Message}" });
            }
        }

        [HttpDelete("routes/{id}")]
        public async Task<IActionResult> DeleteRoute(string id)
        {
            try
            {
                if (!Guid.TryParse(id, out var routeId))
                {
                    return BadRequest(new { success = false, message = "Invalid route ID" });
                }

                var result = await _routeService.DeleteRouteAsync(routeId);
                if (!result)
                {
                    return NotFound(new { success = false, message = "Route not found" });
                }

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error deleting route: {ex.Message}" });
            }
        }

        // تم حذف [HttpPost("seed-data")] لأنه يجب أن لا يكون في بيئة الإنتاج/التطبيق
        // إذا كنت تحتاجه للتطوير، يجب وضعه في مكان آمن أو تقييده بـ [Authorize(Roles = "Admin")]

        [HttpGet("tracking")]
        public async Task<IActionResult> GetAllTracking()
        {
            try
            {
                var buses = await _busService.GetAllBusesAsync();
                var tracking = buses
                    .Where(b => b.CurrentLatitude.HasValue && b.CurrentLongitude.HasValue)
                    .Select(b => new
                    {
                        busId = b.Id.ToString(),
                        latitude = b.CurrentLatitude,
                        longitude = b.CurrentLongitude,
                        heading = b.CurrentHeading,
                        timestamp = b.LastLocationUpdate?.ToString("O")
                    });

                return Ok(new { tracking });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error fetching tracking data: {ex.Message}" });
            }
        }

        [HttpGet("contacts")]
        public async Task<IActionResult> GetContacts()
        {
            try
            {
                var contacts = await _contactService.GetAllContactsAsync();
                return Ok(new
                {
                    contacts = contacts.Select(c => new
                    {
                        id = c.Id.ToString(),
                        name = c.Name,
                        email = c.Email,
                        phone = c.Phone,
                        subject = c.Subject,
                        message = c.Message,
                        submittedAt = c.SubmittedAt.ToString("O")
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error fetching contacts: {ex.Message}" });
            }
        }

        [HttpPost("contacts")]
        public async Task<IActionResult> CreateContact([FromBody] CreateContactRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }

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

                return Ok(new
                {
                    success = true,
                    contact = new
                    {
                        id = contact.Id.ToString(),
                        name = contact.Name,
                        email = contact.Email,
                        phone = contact.Phone,
                        subject = contact.Subject,
                        message = contact.Message,
                        submittedAt = contact.SubmittedAt.ToString("O")
                    }
                });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred while creating the contact: {ex.Message}" });
            }
        }

        [HttpDelete("contacts/{id}")]
        public async Task<IActionResult> DeleteContact(string id)
        {
            try
            {
                if (!Guid.TryParse(id, out var contactId))
                {
                    return BadRequest(new { success = false, message = "Invalid contact ID" });
                }

                var result = await _contactService.DeleteContactAsync(contactId);
                if (!result)
                {
                    return NotFound(new { success = false, message = "Contact not found" });
                }

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error deleting contact: {ex.Message}" });
            }
        }
    }
}
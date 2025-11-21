using Microsoft.AspNetCore.Mvc;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.APIs.Models;

namespace Public_Transport_Tracker.APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusController : ControllerBase
    {
        private readonly IBusService _busService;

        public BusController(IBusService busService)
        {
            _busService = busService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBuses()
        {
            try
            {
                var buses = await _busService.GetAllBusesAsync();
                return Ok(new { buses = buses.Select(b => new
                {
                    id = b.Id.ToString(),
                    number = b.Number,
                    capacity = b.Capacity,
                    routeName = b.Route?.RouteName,
                    status = b.Status,
                    currentLatitude = b.CurrentLatitude,
                    currentLongitude = b.CurrentLongitude,
                    currentHeading = b.CurrentHeading,
                    lastLocationUpdate = b.LastLocationUpdate?.ToString("O")
                })});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error fetching buses: {ex.Message}" });
            }
        }

        [HttpPost]
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
                
                return Ok(new { 
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
                return StatusCode(500, new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred while creating the bus: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
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
    }
}

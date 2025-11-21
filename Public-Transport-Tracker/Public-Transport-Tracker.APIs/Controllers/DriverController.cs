using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.APIs.Models;

namespace Public_Transport_Tracker.APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class DriverController : ControllerBase
    {
        private readonly IDriverService _driverService;
        private readonly IBusService _busService;

        public DriverController(IDriverService driverService, IBusService busService)
        {
            _driverService = driverService;
            _busService = busService;
        }

        [HttpGet("buses")]
        public async Task<IActionResult> GetBuses()
        {
            try
            {
                var buses = await _busService.GetAllBusesAsync();
                return Ok(new { buses = buses.Select(b => new
                {
                    id = b.Id.ToString(),
                    number = b.Number,
                    status = b.Status,
                    routeName = b.Route?.RouteName,
                    currentDriverId = b.CurrentDriverId?.ToString()
                })});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error fetching buses: {ex.Message}" });
            }
        }

        [HttpPost("start-trip")]
        public async Task<IActionResult> StartTrip([FromBody] StartTripRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }

                if (!Guid.TryParse(request.BusId, out var busId) || !Guid.TryParse(request.DriverId, out var driverId))
                {
                    return BadRequest(new { success = false, message = "Invalid bus or driver ID" });
                }

                var result = await _driverService.StartTripAsync(busId, driverId);
                return result ? Ok(new { success = true }) : BadRequest(new { success = false, message = "Failed to start trip" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error starting trip: {ex.Message}" });
            }
        }

        [HttpPost("end-trip")]
        public async Task<IActionResult> EndTrip([FromBody] EndTripRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }

                if (!Guid.TryParse(request.BusId, out var busId))
                {
                    return BadRequest(new { success = false, message = "Invalid bus ID" });
                }

                var result = await _driverService.EndTripAsync(busId);
                return result ? Ok(new { success = true }) : BadRequest(new { success = false, message = "Failed to end trip" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error ending trip: {ex.Message}" });
            }
        }

        [HttpPost("update-location")]
        public async Task<IActionResult> UpdateLocation([FromBody] UpdateLocationRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }

                if (!Guid.TryParse(request.BusId, out var busId))
                {
                    return BadRequest(new { success = false, message = "Invalid bus ID" });
                }

                var result = await _driverService.UpdateLocationAsync(busId, request.Latitude, request.Longitude, request.Heading);
                return result ? Ok(new { success = true }) : BadRequest(new { success = false, message = "Failed to update location" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error updating location: {ex.Message}" });
            }
        }

        [HttpPost("report-issue")]
        public async Task<IActionResult> ReportIssue([FromBody] ReportIssueRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }

                if (!Guid.TryParse(request.BusId, out var busId))
                {
                    return BadRequest(new { success = false, message = "Invalid bus ID" });
                }

                if (string.IsNullOrWhiteSpace(request.IssueType) || string.IsNullOrWhiteSpace(request.Description))
                {
                    return BadRequest(new { success = false, message = "Issue type and description are required" });
                }

                var result = await _driverService.ReportIssueAsync(busId, request.IssueType, request.Description);
                return result ? Ok(new { success = true }) : BadRequest(new { success = false, message = "Failed to report issue" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error reporting issue: {ex.Message}" });
            }
        }

        [HttpPost("record-station")]
        public async Task<IActionResult> RecordStation([FromBody] RecordStationRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { success = false, message = "Request body is required" });
                }

                if (!Guid.TryParse(request.BusId, out var busId))
                {
                    return BadRequest(new { success = false, message = "Invalid bus ID" });
                }

                if (string.IsNullOrWhiteSpace(request.StationName))
                {
                    return BadRequest(new { success = false, message = "Station name is required" });
                }

                var result = await _driverService.RecordStationAsync(busId, request.StationName);
                return result ? Ok(new { success = true }) : BadRequest(new { success = false, message = "Failed to record station" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error recording station: {ex.Message}" });
            }
        }
    }
}

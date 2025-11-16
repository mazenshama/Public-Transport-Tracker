using Microsoft.AspNetCore.Mvc;
using Public_Transport_Tracker.Application.Abstraction.Services;

namespace Public_Transport_Tracker.APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { success = false, message = "Email and password are required" });
            }

            var result = await _authService.LoginAsync(request.Email, request.Password);

            if (!result.Success)
            {
                return Unauthorized(new { success = false, message = result.Error });
            }

            return Ok(new
            {
                success = true,
                token = result.Token,
                user = new
                {
                    id = result.User!.Id,
                    name = result.User.Name,
                    email = result.User.Email,
                    role = result.User.Role
                }
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email) || 
                string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.Role))
            {
                return BadRequest(new { success = false, message = "All fields are required" });
            }

            var result = await _authService.RegisterAsync(
                request.Name,
                request.Email,
                request.Password,
                request.Phone ?? string.Empty,
                request.Role
            );

            if (!result.Success)
            {
                return BadRequest(new { success = false, message = result.Error });
            }

            return Ok(new
            {
                success = true,
                token = result.Token,
                user = new
                {
                    id = result.User!.Id,
                    name = result.User.Name,
                    email = result.User.Email,
                    role = result.User.Role
                }
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = string.Empty;
    }
}

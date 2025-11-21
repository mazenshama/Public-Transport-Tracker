using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.Domain.Contracts;
using Public_Transport_Tracker.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using JwtRegisteredClaimNames = System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames;

namespace Public_Transport_Tracker.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public AuthService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<(bool Success, string? Token, User? User, string? Error)> LoginAsync(string email, string password)
        {
            try
            {
                var users = await _unitOfWork.Users.FindAsync(u => u.Email == email);
                var user = users.FirstOrDefault();

                if (user == null)
                {
                    return (false, null, null, "Invalid email or password");
                }

                // Verify password
                if (!VerifyPassword(password, user.PasswordHash, user.PasswordSalt))
                {
                    return (false, null, null, "Invalid email or password");
                }

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return (true, token, user, null);
            }
            catch (Exception ex)
            {
                return (false, null, null, $"Error during login: {ex.Message}");
            }
        }

        public async Task<(bool Success, string? Token, User? User, string? Error)> RegisterAsync(string name, string email, string password, string phone, string role)
        {
            try
            {
                // Check if user already exists
                var existingUsers = await _unitOfWork.Users.FindAsync(u => u.Email == email);
                if (existingUsers.Any())
                {
                    return (false, null, null, "Email already exists");
                }

                // Validate role
                if (!new[] { "Admin", "Driver", "User" }.Contains(role))
                {
                    return (false, null, null, "Invalid role. Must be Admin, Driver, or User");
                }

                // Hash password
                var (hash, salt) = HashPassword(password);

                // Create new user
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Name = name,
                    Email = email,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    Phone = phone,
                    Role = role,
                    CreatedAt = DateTime.UtcNow
                };

                // NEW LOGIC: Create a Driver entity if the role is 'Driver'
                if (role.Equals("Driver", StringComparison.OrdinalIgnoreCase))
                {
                    var driver = new Driver
                    {
                        // Use the same ID to link User and Driver entities
                        Id = user.Id,
                        Name = name,
                        Email = email,
                        PasswordHash = hash,
                        PasswordSalt = salt,
                        Phone = phone,
                        Role = "Driver",
                        CreatedAt = DateTime.UtcNow
                    };
                    await _unitOfWork.Drivers.AddAsync(driver);
                }

                await _unitOfWork.Users.AddAsync(user);
                await _unitOfWork.SaveChangesAsync();

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return (true, token, user, null);
            }
            catch (Exception ex)
            {
                return (false, null, null, $"Error during registration: {ex.Message}");
            }
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            var users = await _unitOfWork.Users.FindAsync(u => u.Email == email);
            return users.FirstOrDefault();
        }

        private (string Hash, string Salt) HashPassword(string password)
        {
            using var hmac = new HMACSHA512();
            var salt = Convert.ToBase64String(hmac.Key);
            var hash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            return (hash, salt);
        }

        private bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            try
            {
                var saltBytes = Convert.FromBase64String(storedSalt);
                using var hmac = new HMACSHA512(saltBytes);
                var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
                return computedHash == storedHash;
            }
            catch
            {
                return false;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyForJWTTokenGenerationThatShouldBeAtLeast32Characters";
            var issuer = jwtSettings["Issuer"] ?? "PublicTransportTracker";
            var audience = jwtSettings["Audience"] ?? "PublicTransportTrackerUsers";
            var expiryMinutes = int.Parse(jwtSettings["ExpiryMinutes"] ?? "60");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
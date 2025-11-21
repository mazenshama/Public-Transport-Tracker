namespace Public_Transport_Tracker.Domain.Entities
{
    public class Driver
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PasswordSalt { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = "Driver";
        public ICollection<Bus> AssignedBuses { get; set; } = new List<Bus>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

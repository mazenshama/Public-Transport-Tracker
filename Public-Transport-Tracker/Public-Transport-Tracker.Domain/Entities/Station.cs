namespace Public_Transport_Tracker.Domain.Entities
{
    public class Station
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public Guid RouteId { get; set; }
        public Route Route { get; set; } = null!;
        public bool Reached { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

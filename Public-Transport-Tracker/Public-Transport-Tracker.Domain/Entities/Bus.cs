namespace Public_Transport_Tracker.Domain.Entities
{
    public class Bus
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string Status { get; set; } = "available"; // available, active, out-of-service
        public Guid? CurrentDriverId { get; set; }
        public Driver? CurrentDriver { get; set; }
        public Guid? RouteId { get; set; }
        public Route? Route { get; set; }
        public double? CurrentLatitude { get; set; }
        public double? CurrentLongitude { get; set; }
        public double? CurrentHeading { get; set; }
        public DateTime? LastLocationUpdate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

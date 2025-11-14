namespace Public_Transport_Tracker.Domain.Entities
{
    public class Route
    {
        public Guid Id { get; set; }
        public string RouteName { get; set; } = string.Empty;
        public string BusNumber { get; set; } = string.Empty;
        public string Stops { get; set; } = string.Empty; // JSON string or comma-separated
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public List<Station> Stations { get; set; } = new();
        public List<Bus> Buses { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

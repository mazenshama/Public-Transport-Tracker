namespace Public_Transport_Tracker.APIs.Models
{
    public class CreateBusRequest
    {
        public string Number { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string? RouteName { get; set; }
    }

    public class CreateRouteRequest
    {
        public string BusNumber { get; set; } = string.Empty;
        public string RouteName { get; set; } = string.Empty;
        public string[]? Stops { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public string? Frequency { get; set; }
    }

    public class StartTripRequest
    {
        public string BusId { get; set; } = string.Empty;
        public string DriverId { get; set; } = string.Empty;
    }

    public class EndTripRequest
    {
        public string BusId { get; set; } = string.Empty;
    }

    public class UpdateLocationRequest
    {
        public string BusId { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Heading { get; set; }
    }

    public class ReportIssueRequest
    {
        public string BusId { get; set; } = string.Empty;
        public string IssueType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class RecordStationRequest
    {
        public string BusId { get; set; } = string.Empty;
        public string StationName { get; set; } = string.Empty;
    }

    public class CreateContactRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Subject { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
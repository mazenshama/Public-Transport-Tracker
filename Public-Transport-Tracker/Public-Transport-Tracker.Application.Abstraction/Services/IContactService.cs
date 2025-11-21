using Public_Transport_Tracker.Domain.Entities;

namespace Public_Transport_Tracker.Application.Abstraction.Services
{
    public interface IContactService
    {
        Task<IEnumerable<Contact>> GetAllContactsAsync();
        Task<Contact?> GetContactByIdAsync(Guid id);
        Task<Contact> CreateContactAsync(string name, string email, string? phone, string? subject, string message);
        Task<bool> DeleteContactAsync(Guid id);
    }
}


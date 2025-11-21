using Microsoft.EntityFrameworkCore;
using Public_Transport_Tracker.Application.Abstraction.Services;
using Public_Transport_Tracker.Domain.Contracts;
using Public_Transport_Tracker.Domain.Entities;
using Public_Transport_Tracker.Persistence.Data;

namespace Public_Transport_Tracker.Application.Services
{
    public class ContactService : IContactService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly PublicTransportTrackerContext _context;

        public ContactService(IUnitOfWork unitOfWork, PublicTransportTrackerContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<IEnumerable<Contact>> GetAllContactsAsync()
        {
            return await _context.Contacts
                .OrderByDescending(c => c.SubmittedAt)
                .ToListAsync();
        }

        public async Task<Contact?> GetContactByIdAsync(Guid id)
        {
            return await _context.Contacts
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Contact> CreateContactAsync(string name, string email, string? phone, string? subject, string message)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name))
                {
                    throw new ArgumentException("Name cannot be empty.", nameof(name));
                }

                if (string.IsNullOrWhiteSpace(email))
                {
                    throw new ArgumentException("Email cannot be empty.", nameof(email));
                }

                if (string.IsNullOrWhiteSpace(message))
                {
                    throw new ArgumentException("Message cannot be empty.", nameof(message));
                }

                var contact = new Contact
                {
                    Id = Guid.NewGuid(),
                    Name = name.Trim(),
                    Email = email.Trim(),
                    Phone = phone?.Trim(),
                    Subject = subject?.Trim(),
                    Message = message.Trim(),
                    SubmittedAt = DateTime.UtcNow
                };

                _context.Contacts.Add(contact);
                var savedChanges = await _context.SaveChangesAsync();

                if (savedChanges <= 0)
                {
                    throw new InvalidOperationException("Failed to save contact to database. No changes were persisted.");
                }

                Console.WriteLine($"✅ Contact created successfully: {contact.Name} ({contact.Email})");
                return contact;
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"❌ Database error creating contact: {dbEx.Message}");
                throw new InvalidOperationException($"Database error while creating contact: {dbEx.Message}", dbEx);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating contact: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteContactAsync(Guid id)
        {
            try
            {
                var contact = await _context.Contacts.FirstOrDefaultAsync(c => c.Id == id);
                if (contact == null) return false;

                _context.Contacts.Remove(contact);
                var savedChanges = await _context.SaveChangesAsync();

                return savedChanges > 0;
            }
            catch
            {
                return false;
            }
        }
    }
}


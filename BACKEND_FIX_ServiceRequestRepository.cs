// ✅ FIXED VERSION - ServiceRequestRepository.cs

using ElAnis.DataAccess.ApplicationContext;
using ElAnis.DataAccess.Interfaces;
using ElAnis.Entities.Models;
using ElAnis.Utilities.Enum;
using Microsoft.EntityFrameworkCore;

namespace ElAnis.DataAccess.Repositories
{
    public class ServiceRequestRepository : GenericRepository<ServiceRequest>, IServiceRequestRepository
    {
        public ServiceRequestRepository(AuthContext context) : base(context) { }

        // ✅ Get all requests for a specific user (client side)
        public async Task<List<ServiceRequest>> GetUserRequestsAsync(string userId)
        {
            return await _dbSet
                .Where(r => r.UserId == userId)
                .Include(r => r.Category)                    // ✅ Include Category
                .Include(r => r.ServiceProvider)             // ✅ Include Provider
                    .ThenInclude(p => p.User)                // ✅ Include Provider's User
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // ✅ Get all requests for a specific provider (provider side)
        public async Task<List<ServiceRequest>> GetProviderRequestsAsync(Guid providerId)
        {
            return await _dbSet
                .Where(r => r.ServiceProviderId == providerId)
                .Include(r => r.Category)                    // ✅ Include Category
                .Include(r => r.User)                        // ✅ Include User (Client)
                .Include(r => r.ServiceProvider)             // ✅ Include Provider
                    .ThenInclude(p => p.User)                // ✅ Include Provider's User
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // ✅ Get request with full details (for updates/responses)
        public async Task<ServiceRequest?> GetRequestWithDetailsAsync(Guid requestId)
        {
            return await _dbSet
                .Include(r => r.User)
                .Include(r => r.Category)
                .Include(r => r.ServiceProvider)
                    .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(r => r.Id == requestId);
        }

        // ✅ Check if user has pending request with provider on specific date
        public async Task<bool> HasPendingRequestAsync(string userId, Guid providerId, DateTime date)
        {
            return await _dbSet
                .AnyAsync(r => r.UserId == userId
                    && r.ServiceProviderId == providerId
                    && r.PreferredDate.Date == date.Date
                    && r.Status == ServiceRequestStatus.Pending);
        }
    }
}


// ✅ في IServiceRequestRepository.cs - أضف التواقيع:

namespace ElAnis.DataAccess.Interfaces
{
    public interface IServiceRequestRepository : IGenericRepository<ServiceRequest>
    {
        Task<List<ServiceRequest>> GetUserRequestsAsync(string userId);
        Task<List<ServiceRequest>> GetProviderRequestsAsync(Guid providerId);
        Task<ServiceRequest?> GetRequestWithDetailsAsync(Guid requestId);
        Task<bool> HasPendingRequestAsync(string userId, Guid providerId, DateTime date);
    }
}

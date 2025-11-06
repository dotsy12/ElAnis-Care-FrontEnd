// ✅ FIXED VERSION - ServiceRequestService.cs

public async Task<Response<List<ServiceRequestResponse>>> GetProviderRequestsAsync(Guid providerId)
{
    try
    {
        // Verify provider exists
        var provider = await _unitOfWork.ServiceProviderProfiles.GetByIdAsync(providerId);
        if (provider == null)
            return _responseHandler.NotFound<List<ServiceRequestResponse>>("Provider not found");

        // ✅ Get requests with PROPER INCLUDES
        var requests = await _unitOfWork.ServiceRequests.GetProviderRequestsAsync(providerId);
        
        // ✅ Map each request individually with proper null checks
        var responses = requests.Select(r => MapToResponse(
            r,
            r.Category,
            // ✅ Use USER name (client who made the request), not provider name!
            r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Unknown User",
            r.User?.ProfilePicture  // ✅ Use user's profile picture
        )).ToList();

        return _responseHandler.Success(responses, "Provider requests retrieved successfully");
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting provider requests for providerId: {ProviderId}", providerId);
        return _responseHandler.ServerError<List<ServiceRequestResponse>>("Error retrieving provider requests");
    }
}

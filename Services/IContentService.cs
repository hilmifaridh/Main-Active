using WebApiCore.Api;

namespace WebApiCore.Services;

public interface IContentService
{
    Task<SiteContentResponse> GetAsync(CancellationToken cancellationToken);

    Task<SiteContentResponse> ReplaceAsync(
        UpdateSiteContentRequest content,
        CancellationToken cancellationToken);
}

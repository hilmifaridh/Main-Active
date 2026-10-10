using Microsoft.AspNetCore.Http.HttpResults;
using WebApiCore.Services;

namespace WebApiCore.Api;

public static class ContentEndpoints
{
    public static IEndpointRouteBuilder MapContentEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/content", async Task<Ok<SiteContentResponse>> (
            IContentService contentService,
            CancellationToken cancellationToken) =>
            TypedResults.Ok(await contentService.GetAsync(cancellationToken)))
            .WithName("GetSiteContent")
            .WithSummary("Get public landing-page content and product catalog")
            .WithDescription("Returns the currently published Main Active landing page and products.")
            .Produces<SiteContentResponse>(StatusCodes.Status200OK);

        return endpoints;
    }
}

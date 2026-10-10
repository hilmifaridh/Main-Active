using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using WebApiCore.Services;

namespace WebApiCore.Api;

public static class AdminEndpoints
{
    public static IEndpointRouteBuilder MapAdminEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/admin/login", async Task<Results<Ok<AdminLoginResponse>, UnauthorizedHttpResult, ProblemHttpResult>> (
            AdminLoginRequest request,
            HttpContext context,
            IConfiguration configuration,
            ILoggerFactory loggerFactory) =>
        {
            var username = configuration["Admin:Username"];
            var password = configuration["Admin:Password"];
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                loggerFactory.CreateLogger("AdminEndpoints")
                    .LogError("Admin login is unavailable because Admin:Username or Admin:Password is not configured.");
                return TypedResults.Problem(
                    title: "CMS admin belum dikonfigurasi.",
                    detail: "Atur kredensial admin pada environment aplikasi.",
                    statusCode: StatusCodes.Status503ServiceUnavailable);
            }

            if (!FixedTimeEquals(request.Username, username) ||
                !FixedTimeEquals(request.Password, password))
            {
                return TypedResults.Unauthorized();
            }

            var identity = new ClaimsIdentity(
                [new Claim(ClaimTypes.Name, username), new Claim(ClaimTypes.Role, "Admin")],
                CookieAuthenticationDefaults.AuthenticationScheme);
            await context.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity));

            return TypedResults.Ok(new AdminLoginResponse("Berhasil masuk."));
        })
        .AllowAnonymous()
        .RequireRateLimiting("admin-login")
        .WithName("AdminLogin")
        .WithSummary("Sign in to the CMS")
        .WithDescription("Creates an HTTP-only admin session using credentials configured by the server.")
        .Produces<AdminLoginResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .ProducesProblem(StatusCodes.Status503ServiceUnavailable);

        endpoints.MapPost("/api/admin/logout", async Task<NoContent> (HttpContext context) =>
        {
            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return TypedResults.NoContent();
        })
        .RequireAuthorization()
        .WithName("AdminLogout")
        .WithSummary("Sign out of the CMS")
        .Produces(StatusCodes.Status204NoContent);

        endpoints.MapGet("/api/admin/content", async Task<Ok<SiteContentResponse>> (
            IContentService contentService,
            CancellationToken cancellationToken) =>
            TypedResults.Ok(await contentService.GetAsync(cancellationToken)))
            .RequireAuthorization()
            .WithName("GetEditableSiteContent")
            .WithSummary("Get landing-page content for the CMS")
            .Produces<SiteContentResponse>(StatusCodes.Status200OK);

        endpoints.MapPut("/api/admin/content", async Task<Results<Ok<SiteContentResponse>, BadRequest<ProblemDetails>>> (
            UpdateSiteContentRequest request,
            IContentService contentService,
            CancellationToken cancellationToken) =>
        {
            var validationError = ContentValidation.GetError(request);
            if (validationError is not null)
            {
                return TypedResults.BadRequest(new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Konten tidak valid.",
                    Detail = validationError
                });
            }

            var updated = await contentService.ReplaceAsync(request, cancellationToken);
            return TypedResults.Ok(updated);
        })
        .RequireAuthorization()
        .WithName("UpdateSiteContent")
        .WithSummary("Publish landing-page content and product catalog")
        .WithDescription("Validates and atomically saves the complete landing page and catalog.")
        .Produces<SiteContentResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest);

        return endpoints;
    }

    private static bool FixedTimeEquals(string supplied, string configured)
    {
        var suppliedHash = SHA256.HashData(Encoding.UTF8.GetBytes(supplied));
        var configuredHash = SHA256.HashData(Encoding.UTF8.GetBytes(configured));
        return CryptographicOperations.FixedTimeEquals(suppliedHash, configuredHash);
    }
}

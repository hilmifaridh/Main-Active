using Microsoft.Extensions.Options;
using WebApiCore.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddOptions<SiteSettings>()
    .Bind(builder.Configuration.GetSection(SiteSettings.SectionName))
    .Validate(settings => !string.IsNullOrWhiteSpace(settings.BrandName), "Site:BrandName is required.")
    .Validate(settings => !string.IsNullOrWhiteSpace(settings.Email), "Site:Email is required.")
    .Validate(settings => SiteSettings.IsHexColor(settings.PrimaryColor), "Site:PrimaryColor must be a six-digit hex color.")
    .Validate(settings => SiteSettings.IsHexColor(settings.AccentColor), "Site:AccentColor must be a six-digit hex color.")
    .ValidateOnStart();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/api/site-config", (IOptions<SiteSettings> options) => Results.Ok(options.Value));

app.Run();

using System.Text.Json;
using WebApiCore.Api;

namespace WebApiCore.Services;

public sealed class JsonContentService(
    IWebHostEnvironment environment,
    ILogger<JsonContentService> logger) : IContentService
{
    private static readonly SemaphoreSlim FileLock = new(1, 1);
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true
    };

    private readonly string _filePath = Path.Combine(
        environment.ContentRootPath,
        "App_Data",
        "site-content.json");

    public async Task<SiteContentResponse> GetAsync(CancellationToken cancellationToken)
    {
        await FileLock.WaitAsync(cancellationToken);
        try
        {
            if (!File.Exists(_filePath))
            {
                var defaultContent = DefaultContent;
                return defaultContent with
                {
                    Banners = [CreateInitialBanner(defaultContent)]
                };
            }

            var json = await File.ReadAllTextAsync(_filePath, cancellationToken);
            var content = JsonSerializer.Deserialize<SiteContentResponse>(json, JsonOptions)
                ?? throw new InvalidDataException("The persisted landing-page content is empty.");
            using var document = JsonDocument.Parse(json);
            var texts = content.Texts;
            var banners = content.Banners ?? [];
            if (!document.RootElement.TryGetProperty("banners", out _))
            {
                banners = [CreateInitialBanner(content)];
            }

            if (!document.RootElement.TryGetProperty("texts", out _) &&
                document.RootElement.TryGetProperty("runningText", out var legacyRunningText))
            {
                var legacyText = legacyRunningText.GetString();
                if (!string.IsNullOrWhiteSpace(legacyText))
                {
                    var legacyItems = legacyText.Split(" · ", StringSplitOptions.TrimEntries);
                    texts = legacyItems.Length == 4
                        ? texts with
                        {
                            RunningText1 = legacyItems[0],
                            RunningText2 = legacyItems[1],
                            RunningText3 = legacyItems[2],
                            RunningText4 = legacyItems[3]
                        }
                        : texts with { RunningText1 = legacyText };
                }
            }

            return content with
            {
                Products = content.Products
                    .Select(product => string.IsNullOrWhiteSpace(product.ProductUrl)
                        ? product with { ProductUrl = content.ShopUrl }
                        : product)
                    .ToArray(),
                LogoUrl = content.LogoUrl ?? string.Empty,
                RunningText = string.IsNullOrWhiteSpace(content.RunningText)
                    ? "MADE FOR MOVEMENT · 100% LOCAL PRIDE · LIGHTWEIGHT · BREATHABLE"
                    : content.RunningText,
                Texts = texts,
                Banners = banners
            };
        }
        catch (JsonException exception)
        {
            logger.LogError(exception, "The persisted landing-page content could not be parsed.");
            throw new InvalidDataException("The persisted landing-page content is invalid.", exception);
        }
        finally
        {
            FileLock.Release();
        }
    }

    public async Task<SiteContentResponse> ReplaceAsync(
        UpdateSiteContentRequest content,
        CancellationToken cancellationToken)
    {
        var response = new SiteContentResponse(
            content.BrandName.Trim(),
            content.Eyebrow.Trim(),
            content.Headline.Trim(),
            content.Description.Trim(),
            content.StoryHeadline.Trim(),
            content.StoryDescription.Trim(),
            content.HeroImageUrl.Trim(),
            content.ShopUrl.Trim(),
            content.InstagramUrl.Trim(),
            content.Products.Select(product => new ProductResponse(
                product.Id,
                product.Name.Trim(),
                product.Category.Trim(),
                product.Price,
                product.Description.Trim(),
                product.ImageUrl.Trim(),
                product.Badge.Trim(),
                product.IsAvailable,
                product.ProductUrl.Trim())).ToArray(),
            content.LogoUrl.Trim(),
            content.RunningText.Trim())
        {
            Texts = content.Texts,
            Banners = content.Banners.Select(banner => new BannerSlideResponse(
                banner.Id,
                banner.ImageUrl.Trim(),
                banner.AltText.Trim(),
                banner.LinkUrl.Trim())).ToArray()
        };

        await FileLock.WaitAsync(cancellationToken);
        try
        {
            var directory = Path.GetDirectoryName(_filePath)
                ?? throw new InvalidOperationException("The content storage directory is invalid.");
            Directory.CreateDirectory(directory);
            var temporaryPath = $"{_filePath}.{Guid.NewGuid():N}.tmp";
            try
            {
                await File.WriteAllTextAsync(
                    temporaryPath,
                    JsonSerializer.Serialize(response, JsonOptions),
                    cancellationToken);
                File.Move(temporaryPath, _filePath, overwrite: true);
            }
            finally
            {
                if (File.Exists(temporaryPath))
                {
                    File.Delete(temporaryPath);
                }
            }
        }
        finally
        {
            FileLock.Release();
        }

        return response;
    }

    private static SiteContentResponse DefaultContent => new(
        "MAIN ACTIVE",
        "100% LOCAL PRIDE · BUILT TO MOVE",
        "Gerak bebas. Tampil beda.",
        "Sportswear lokal dengan desain minimal, bahan ringan, dan sirkulasi udara yang nyaman untuk setiap permainan.",
        "Dibuat untuk setiap versi dirimu.",
        "Dari sesi latihan pagi sampai pertandingan akhir pekan, Main Active merancang sportswear yang mengikuti gerakmu. Dibuat dengan kebanggaan lokal, detail yang fungsional, dan kenyamanan yang terasa sejak pertama dipakai.",
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1500&q=85",
        "https://shopee.co.id/main.inc",
        "https://www.instagram.com/maininc.id/",
        [
            new ProductResponse(
                Guid.Parse("4ec0eafb-6976-4ed4-9e23-44b4f56f34cd"),
                "Core Match Jersey",
                "Matchday",
                189000,
                "Jersey ringan dengan potongan atletik dan sirkulasi udara untuk permainan intens.",
                "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=85",
                "BEST SELLER",
                true),
            new ProductResponse(
                Guid.Parse("2eb88fa6-4765-41f2-917d-858141764afe"),
                "Motion Training Tee",
                "Training",
                149000,
                "Tee serbaguna dengan material breathable, nyaman untuk latihan maupun aktivitas harian.",
                "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=85",
                "LIGHTWEIGHT",
                true),
            new ProductResponse(
                Guid.Parse("ba17cc38-8218-4390-88dd-8d3ef67747e0"),
                "Everyday Sport Top",
                "Essentials",
                129000,
                "Siluet minimal yang mudah dipadukan dan siap menemani gerakmu sepanjang hari.",
                "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=85",
                string.Empty,
                true)
        ],
        RunningText: "MADE FOR MOVEMENT · 100% LOCAL PRIDE · LIGHTWEIGHT · BREATHABLE");

    private static BannerSlideResponse CreateInitialBanner(SiteContentResponse content) => new(
        Guid.Parse("58381294-7de0-40c7-9e24-e7c561c511cb"),
        content.HeroImageUrl,
        "Banner Main Active",
        content.ShopUrl);
}

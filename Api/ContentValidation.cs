namespace WebApiCore.Api;

internal static class ContentValidation
{
    public static string? GetError(UpdateSiteContentRequest content)
    {
        if (!IsHttpUrl(content.HeroImageUrl) ||
            !IsHttpUrl(content.ShopUrl) ||
            !IsHttpUrl(content.InstagramUrl) ||
            (!string.IsNullOrWhiteSpace(content.LogoUrl) && !IsHttpUrl(content.LogoUrl)))
        {
            return "Tautan gambar, toko, Instagram, dan logo harus menggunakan URL HTTP atau HTTPS.";
        }

        if (string.IsNullOrWhiteSpace(content.RunningText))
        {
            return "Running text tidak boleh kosong.";
        }

        if (content.Products.Any(product =>
                product.Id == Guid.Empty ||
                !IsHttpUrl(product.ImageUrl) ||
                !IsHttpUrl(product.ProductUrl)))
        {
            return "Setiap produk harus memiliki ID serta URL gambar dan halaman produk HTTP atau HTTPS yang valid.";
        }

        if (content.Products.Select(product => product.Id).Distinct().Count() != content.Products.Count)
        {
            return "ID produk harus unik.";
        }

        if (content.Banners is null || content.Banners.Count > 12 ||
            content.Banners.Any(banner =>
                banner is null ||
                banner.Id == Guid.Empty ||
                banner.ImageUrl is null ||
                !IsHttpUrl(banner.ImageUrl) ||
                banner.ImageUrl.Length > 500 ||
                (!string.IsNullOrWhiteSpace(banner.LinkUrl) && !IsHttpUrl(banner.LinkUrl)) ||
                (banner.LinkUrl?.Length ?? 0) > 500 ||
                string.IsNullOrWhiteSpace(banner.AltText) ||
                banner.AltText.Length > 300))
        {
            return "Maksimal 12 banner; setiap banner harus memiliki ID, URL gambar HTTP atau HTTPS yang valid, dan teks alternatif. URL tujuan bersifat opsional.";
        }

        if (content.Banners.Select(banner => banner.Id).Distinct().Count() != content.Banners.Count)
        {
            return "ID banner harus unik.";
        }

        return null;
    }

    private static bool IsHttpUrl(string value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) &&
        (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
}

using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Options;

namespace WebApiCore.Api;

/// <summary>Public landing-page content and product catalog.</summary>
public sealed record SiteContentResponse(
    string BrandName,
    string Eyebrow,
    string Headline,
    string Description,
    string StoryHeadline,
    string StoryDescription,
    string HeroImageUrl,
    string ShopUrl,
    string InstagramUrl,
    IReadOnlyList<ProductResponse> Products,
    string LogoUrl = "",
    string RunningText = "MADE FOR MOVEMENT · 100% LOCAL PRIDE · LIGHTWEIGHT · BREATHABLE")
{
    public SiteTextContent Texts { get; init; } = new();
    public IReadOnlyList<BannerSlideResponse> Banners { get; init; } = [];
}

/// <summary>A product displayed in the public catalog.</summary>
public sealed record ProductResponse(
    Guid Id,
    string Name,
    string Category,
    decimal Price,
    string Description,
    string ImageUrl,
    string Badge,
    bool IsAvailable,
    string ProductUrl = "");

/// <summary>Complete editable content submitted by the CMS.</summary>
public sealed record UpdateSiteContentRequest
{
    [Required, StringLength(80)]
    public required string BrandName { get; init; }

    [Required, StringLength(120)]
    public required string Eyebrow { get; init; }

    [Required, StringLength(180)]
    public required string Headline { get; init; }

    [Required, StringLength(500)]
    public required string Description { get; init; }

    [Required, StringLength(120)]
    public required string StoryHeadline { get; init; }

    [Required, StringLength(800)]
    public required string StoryDescription { get; init; }

    [Required, Url, StringLength(500)]
    public required string HeroImageUrl { get; init; }

    [Required, Url, StringLength(500)]
    public required string ShopUrl { get; init; }

    [Required, Url, StringLength(500)]
    public required string InstagramUrl { get; init; }

    [StringLength(500)]
    public string LogoUrl { get; init; } = string.Empty;

    [Required, StringLength(300)]
    public string RunningText { get; init; } =
        "MADE FOR MOVEMENT · 100% LOCAL PRIDE · LIGHTWEIGHT · BREATHABLE";

    [Required, MinLength(1), MaxLength(40)]
    public required List<UpdateProductRequest> Products { get; init; }

    [ValidateObjectMembers]
    public SiteTextContent Texts { get; init; } = new();

    [MaxLength(12)]
    public List<UpdateBannerSlideRequest> Banners { get; init; } = [];
}

/// <summary>A banner image and optional destination displayed in the homepage carousel.</summary>
public sealed record BannerSlideResponse(
    Guid Id,
    string ImageUrl,
    string AltText,
    string LinkUrl = "");

/// <summary>Editable content for one homepage banner slide.</summary>
public sealed record UpdateBannerSlideRequest
{
    [Required]
    public required Guid Id { get; init; }

    [Required, Url, StringLength(500)]
    public required string ImageUrl { get; init; }

    [Required, StringLength(300)]
    public required string AltText { get; init; }

    [StringLength(500)]
    public string LinkUrl { get; init; } = string.Empty;
}

/// <summary>Editable labels and copy displayed across the public landing page.</summary>
public sealed record SiteTextContent
{
    [StringLength(80)]
    public string AnnouncementShopLabel { get; init; } = "SHOP ONLINE";
    [StringLength(100)]
    public string BrandHomeAriaLabel { get; init; } = "beranda";
    [StringLength(100)]
    public string PrimaryNavigationAriaLabel { get; init; } = "Navigasi utama";
    [StringLength(60)]
    public string NavCatalogLabel { get; init; } = "Koleksi";
    [StringLength(60)]
    public string NavStoryLabel { get; init; } = "Cerita kami";
    [StringLength(60)]
    public string NavInstagramLabel { get; init; } = "Instagram";
    [StringLength(80)]
    public string NavShopLabel { get; init; } = "Belanja sekarang";
    [StringLength(80)]
    public string MenuOpenLabel { get; init; } = "Buka navigasi";
    [StringLength(180)]
    public string HeroPrimaryActionLabel { get; init; } = "Jelajahi koleksi";
    [StringLength(180)]
    public string HeroSecondaryActionLabel { get; init; } = "Kenali Main Active";
    [StringLength(300)]
    public string HeroImageAltText { get; init; } = "Atmosfer olahraga dan gerak aktif";
    [StringLength(100)]
    public string HeroVerticalLabel { get; init; } = "MAIN ACTIVE · INDONESIA";
    [StringLength(40)]
    public string HeroStampTop { get; init; } = "LOCAL";
    [StringLength(40)]
    public string HeroStampBottom { get; init; } = "PRIDE";
    [StringLength(40)]
    public string HeroStampDate { get; init; } = "EST. 2020";
    [StringLength(100)]
    public string HeroSideNote { get; init; } = "LIGHTWEIGHT / ALL DAY LONG";
    [StringLength(100)]
    public string HeroCoordinate { get; init; } = "06°12' S 106°49' E";
    [StringLength(100)]
    public string ScrollCueLabel { get; init; } = "SCROLL TO EXPLORE";
    [StringLength(100)]
    public string HeroFootnoteLabel { get; init; } = "DESIGNED TO MOVE";
    [StringLength(40)]
    public string HeroFootnoteIndex { get; init; } = "01 / 03";
    [StringLength(120)]
    public string RunningText1 { get; init; } = "MADE FOR MOVEMENT";
    [StringLength(120)]
    public string RunningText2 { get; init; } = "100% LOCAL PRIDE";
    [StringLength(120)]
    public string RunningText3 { get; init; } = "LIGHTWEIGHT";
    [StringLength(120)]
    public string RunningText4 { get; init; } = "BREATHABLE";
    [StringLength(100)]
    public string CatalogKicker { get; init; } = "01 — THE COLLECTION";
    [StringLength(100)]
    public string CatalogTitleLine1 { get; init; } = "Gear up.";
    [StringLength(100)]
    public string CatalogTitleLine2 { get; init; } = "Go further.";
    [StringLength(500)]
    public string CatalogDescription { get; init; } = "Dibuat untuk permainanmu. Didesain untuk gerakmu. Temukan apparel yang terasa nyaman sejak peluit pertama.";
    [StringLength(60)]
    public string CatalogAllFilterLabel { get; init; } = "Semua";
    [StringLength(100)]
    public string CatalogFilterAriaLabel { get; init; } = "Filter kategori produk";
    [StringLength(60)]
    public string CatalogCountLabel { get; init; } = "PRODUCTS";
    [StringLength(180)]
    public string ProductViewLabel { get; init; } = "VIEW ITEM";
    [StringLength(180)]
    public string ProductBuyLabel { get; init; } = "BELI SEKARANG";
    [StringLength(180)]
    public string ProductUnavailableLabel { get; init; } = "SEGERA HADIR";
    [StringLength(180)]
    public string CatalogFooterNote { get; init; } = "MADE WITH INTENTION. WORN WITH PURPOSE.";
    [StringLength(180)]
    public string CatalogShopLinkLabel { get; init; } = "Temukan lebih banyak di Shopee";
    [StringLength(300)]
    public string StoryImageAltText { get; init; } = "Semangat bermain dan bergerak bersama";
    [StringLength(100)]
    public string StoryImageCaption { get; init; } = "THE SPIRIT OF THE GAME — 001";
    [StringLength(100)]
    public string StoryKicker { get; init; } = "02 — OUR POINT OF VIEW";
    [StringLength(180)]
    public string StoryFeature1Title { get; init; } = "Ringan saat bergerak";
    [StringLength(300)]
    public string StoryFeature1Description { get; init; } = "Nyaman mengikuti ritme permainanmu.";
    [StringLength(180)]
    public string StoryFeature2Title { get; init; } = "Breathable by design";
    [StringLength(300)]
    public string StoryFeature2Description { get; init; } = "Lebih siap menghadapi sesi yang panjang.";
    [StringLength(180)]
    public string StoryFeature3Title { get; init; } = "Local, with pride";
    [StringLength(300)]
    public string StoryFeature3Description { get; init; } = "Dibuat dengan semangat Indonesia.";
    [StringLength(180)]
    public string StoryActionLabel { get; init; } = "Ikuti perjalanan kami";
    [StringLength(120)]
    public string ClosingKicker { get; init; } = "YOUR GAME. YOUR MOVE.";
    [StringLength(100)]
    public string ClosingTitleLine1 { get; init; } = "Siap bergerak";
    [StringLength(100)]
    public string ClosingTitleLine2 { get; init; } = "lebih jauh?";
    [StringLength(180)]
    public string ClosingActionLabel { get; init; } = "Temukan gear-mu";
    [StringLength(300)]
    public string FooterTaglineLine1 { get; init; } = "Sportswear made for movement.";
    [StringLength(300)]
    public string FooterTaglineLine2 { get; init; } = "Built with local pride in Indonesia.";
    [StringLength(100)]
    public string FooterCatalogLabel { get; init; } = "Koleksi";
    [StringLength(100)]
    public string FooterInstagramLabel { get; init; } = "Instagram";
    [StringLength(100)]
    public string FooterShopLabel { get; init; } = "Shopee";
    [StringLength(100)]
    public string FooterCopyrightLabel { get; init; } = "ALL RIGHTS RESERVED.";
    [StringLength(100)]
    public string FooterAdminLabel { get; init; } = "ADMIN CMS";
    [StringLength(100)]
    public string FooterTopLabel { get; init; } = "BACK TO TOP";
}

/// <summary>Editable product data submitted by the CMS.</summary>
public sealed record UpdateProductRequest
{
    [Required]
    public required Guid Id { get; init; }

    [Required, StringLength(100)]
    public required string Name { get; init; }

    [Required, StringLength(60)]
    public required string Category { get; init; }

    [Range(1, 100_000_000)]
    public required decimal Price { get; init; }

    [Required, StringLength(300)]
    public required string Description { get; init; }

    [Required, Url, StringLength(500)]
    public required string ImageUrl { get; init; }

    [Required, Url, StringLength(500)]
    public required string ProductUrl { get; init; }

    [StringLength(40)]
    public string Badge { get; init; } = string.Empty;

    public bool IsAvailable { get; init; } = true;
}

/// <summary>Credentials used to sign in to the CMS.</summary>
public sealed record AdminLoginRequest
{
    [Required, StringLength(100)]
    public required string Username { get; init; }

    [Required, StringLength(256)]
    public required string Password { get; init; }
}

/// <summary>Confirmation that an administrator has signed in.</summary>
public sealed record AdminLoginResponse(string Message);

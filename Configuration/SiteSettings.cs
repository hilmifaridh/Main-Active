using System.Text.RegularExpressions;

namespace WebApiCore.Configuration;

public sealed class SiteSettings
{
    public const string SectionName = "Site";

    public string BrandName { get; set; } = string.Empty;
    public string BrandMark { get; set; } = string.Empty;
    public string Eyebrow { get; set; } = string.Empty;
    public string Headline { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string PrimaryColor { get; set; } = "#183A37";
    public string AccentColor { get; set; } = "#C8F169";
    public List<ServiceItem> Services { get; set; } = [];
    public List<ProjectItem> Projects { get; set; } = [];
    public List<StatItem> Stats { get; set; } = [];

    public static bool IsHexColor(string value) =>
        Regex.IsMatch(value, "^#[0-9A-Fa-f]{6}$", RegexOptions.CultureInvariant);
}

public sealed class ServiceItem
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public sealed class ProjectItem
{
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public sealed class StatItem
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
}

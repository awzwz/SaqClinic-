using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using SaqClinic.Api.Models;
using SaqClinic.Api.Entities;

namespace SaqClinic.Api.Services;

public class GoogleSheetsService
{
    private readonly string[] _scopes = { SheetsService.Scope.Spreadsheets };
    private readonly string _applicationName;
    private readonly string _spreadsheetId;
    private readonly string _credentialsPath;

    public GoogleSheetsService(IConfiguration configuration)
    {
        _spreadsheetId = configuration["GoogleSheets:SpreadsheetId"] 
                         ?? throw new ArgumentNullException("GoogleSheets:SpreadsheetId is missing");
        _applicationName = configuration["GoogleSheets:ApplicationName"] ?? "SaqClinic";
        
        // Allow overriding path via config/env var (e.g. "GoogleSheets:CredentialsPath" or "GOOGLE_SHEETS_CREDENTIALS_PATH")
        var configPath = configuration["GoogleSheets:CredentialsPath"];
        if (!string.IsNullOrWhiteSpace(configPath))
        {
            _credentialsPath = configPath;
        }
        else
        {
            // Fallback to current directory
            _credentialsPath = Path.Combine(Directory.GetCurrentDirectory(), "credentials.json");
            
            // If not found in current directory, check Render's default secret path
            if (!File.Exists(_credentialsPath) && File.Exists("/etc/secrets/credentials.json"))
            {
                _credentialsPath = "/etc/secrets/credentials.json";
            }
        }
    }

    public async Task AppendSubmissionAsync(ContactSubmission submission)
    {
        try
        {
            if (!File.Exists(_credentialsPath))
            {
                Console.WriteLine($"[GoogleSheets] Error: Credentials file NOT found at: {_credentialsPath}");
                Console.WriteLine($"[GoogleSheets] Checked also: /etc/secrets/credentials.json");
                Console.WriteLine($"[GoogleSheets] Current Directory: {Directory.GetCurrentDirectory()}");
                return;
            }

            GoogleCredential credential;
            using (var stream = new FileStream(_credentialsPath, FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream).CreateScoped(_scopes);
            }

            var service = new SheetsService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = _applicationName,
            });

            // 1. Get the spreadsheet metadata to find the name of the first sheet
            var spreadsheetRequest = service.Spreadsheets.Get(_spreadsheetId);
            var spreadsheet = await spreadsheetRequest.ExecuteAsync();
            var sheetName = spreadsheet.Sheets.FirstOrDefault()?.Properties.Title ?? "Sheet1";

            // 2. Use the correct sheet name
            var range = $"'{sheetName}'!A:F"; 
            var valueRange = new ValueRange();
            
            // Format: Date, Name, Phone, Email, Service, Message
            var objectList = new List<object>() { 
                submission.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                submission.FullName,
                submission.PhoneNumber,
                submission.Email ?? "",
                submission.PreferredService ?? "",
                submission.Message ?? ""
            };
            
            valueRange.Values = new List<IList<object>> { objectList };

            var appendRequest = service.Spreadsheets.Values.Append(valueRange, _spreadsheetId, range);
            appendRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.AppendRequest.ValueInputOptionEnum.USERENTERED;

            await appendRequest.ExecuteAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error appending to Google Sheets: {ex.Message}");
            // We don't want to break the main flow if Sheets fails, so we just log it
        }
    }
}

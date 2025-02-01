using System.Text.Json;

namespace Banking.Common.Helpers
{
    public static class CommonHelper
    {
        private static readonly Random _random = new();
        private const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        private const string numberics = "0123456789";
        public static T DeepClone<T>(this T obj)
        {
            var json = JsonSerializer.Serialize(obj);
            return JsonSerializer.Deserialize<T>(json);
        }
        public static string RandomString(int length, string? sourceString=chars)
        {

            return new string(Enumerable.Repeat(sourceString ?? chars, length)
             .Select(s => s[_random.Next(s.Length)]).ToArray());
        }

        public static string GenerateAccountNumber(long accountId)
        {
            return $"{RandomString(4, numberics)}{accountId.ToString().PadLeft(10, '0')}";
        }


    }
}

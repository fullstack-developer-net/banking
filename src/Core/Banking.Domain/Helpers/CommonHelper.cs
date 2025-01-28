using System.Text.Json;

namespace Banking.Domain.Helpers
{
    public static class CommonHelper
    {
        private static readonly Random _random = new();
        private const long BaseNumber = 100000000000000L;

        public static T DeepClone<T>(this T obj)
        {
            var json = JsonSerializer.Serialize(obj);
            return JsonSerializer.Deserialize<T>(json);
        }
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[_random.Next(s.Length)]).ToArray());
        }

        public static string GenerateAccountNumber(long accountId)
        {
            return (BaseNumber + accountId).ToString();
        }


    }
}

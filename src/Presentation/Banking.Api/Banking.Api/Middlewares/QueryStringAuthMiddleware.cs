namespace Banking.Api.Middlewares
{
    public class QueryStringAuthMiddleware(RequestDelegate next)
    {
        public async Task Invoke(HttpContext context)
        {
            var userId = context.Request.Query["userId"].ToString();
            if (!string.IsNullOrEmpty(userId))
            {
                context.Items["userId"] = userId;
            }
            await next(context);
        }
    }
}

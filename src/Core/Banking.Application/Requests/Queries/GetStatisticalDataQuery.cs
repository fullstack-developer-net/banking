using System.Globalization;
using Banking.Application.Dtos;
using Banking.Common.Constants;
using Banking.Core;
using Banking.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Banking.Application.Requests.Queries;

public record GetStatisticalDataQuery : IRequest<Dictionary<string, string>>;

public class GetStatisticalDataQueryHandler(CurrentLoginUser loginUser, BankingDbContext context)
    : IRequestHandler<GetStatisticalDataQuery, Dictionary<string, string>>
{
    public async Task<Dictionary<string, string>> Handle(GetStatisticalDataQuery request,
        CancellationToken cancellationToken)
    {
        var isAdmin = loginUser.Roles?.Contains("Admin") ?? false;

        return isAdmin ? await GetAdminStatisticalData() : await GetUserStatisticalData();
    }

    private async Task<Dictionary<string, string>> GetUserStatisticalData()
    {
        var spendingThisMonth = context.Transactions
            .Where(x => x.FromAccountId == loginUser.Account!.AccountId &&
                        x.TransactionTime.Month == DateTime.Now.Month && x.TransactionTime.Year == DateTime.Now.Year &&
                        x.Status == TransactionStatus.Completed)
            .Sum(x => x.Amount);

        var receivingThisMonth = context.Transactions
            .Where(x => x.ToAccountId == loginUser.Account!.AccountId &&
                        x.TransactionTime.Month == DateTime.Now.Month && x.TransactionTime.Year == DateTime.Now.Year &&
                        x.Status == TransactionStatus.Completed)
            .Sum(x => x.Amount);
        return new Dictionary<string, string>
        {
            { "SpendingThisMonth", spendingThisMonth.ToString(CultureInfo.InvariantCulture) },
            { "ReceivingThisMonth", receivingThisMonth.ToString(CultureInfo.InvariantCulture) }
        };
    }

    private async Task<Dictionary<string, string>> GetAdminStatisticalData()
    {
        var totalActiveAccounts = await context.Accounts.Where(x => x.IsActive).CountAsync();
        var totalInactiveAccounts = await context.Accounts.Where(x => !x.IsActive).CountAsync();
        var totalAdmins =
            await context.Roles.CountAsync(x => x.Name == "Admin");

        return new Dictionary<string, string>
        {
            { "TotalActiveAccounts", totalActiveAccounts.ToString() },
            { "TotalInactiveAccounts", totalInactiveAccounts.ToString() },
            { "TotalAdmins", totalAdmins.ToString() }
        };
    }
}
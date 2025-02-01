using Banking.Application.Requests.Commands;
using FluentValidation;

namespace Banking.Application.Validations
{
    public class TransferMoneyCommandValidator : AbstractValidator<ProcessTransactionCommand>
    {
        public TransferMoneyCommandValidator()
        {
            RuleFor(x => x.FromAccountId).GreaterThan(0);
            RuleFor(x => x.FromAccountId).GreaterThan(0);
            RuleFor(x => x.Amount).GreaterThan(0);
        }
    }
}

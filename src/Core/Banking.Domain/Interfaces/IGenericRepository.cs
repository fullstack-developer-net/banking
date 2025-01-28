namespace Banking.Domain.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync<TRequest>(TRequest id);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync<TRequest>(TRequest id);
        Task<bool> AnyAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate);
        IQueryable<T> AsQueryable();

    }
}

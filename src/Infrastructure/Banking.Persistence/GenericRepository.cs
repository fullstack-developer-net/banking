using Banking.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Banking.Persistence
{
    public class GenericRepository<T>(DbContext context) : IGenericRepository<T> where T : class
    {
 
        public async Task<T> GetByIdAsync<TRequest>(TRequest id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await context.Set<T>().ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await context.Set<T>().AddAsync(entity);
        }

        public async Task UpdateAsync(T entity)
        {
            context.Set<T>().Update(entity);
        }

        public async Task DeleteAsync<TRequest>(TRequest id)
        {
            var entity = await context.Set<T>().FindAsync(id);
            if (entity != null)
            {
                context.Set<T>().Remove(entity);
            }
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return await context.Set<T>().AnyAsync(predicate);
        }

        public IQueryable<T> AsQueryable()
        {
            return context.Set<T>().AsQueryable();
        }
    }
}

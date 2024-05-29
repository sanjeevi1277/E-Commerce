using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsManagerAPI.Auth;
using ProductsManagerAPI.Models;
using System.Linq.Expressions;

namespace ProductsManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductContext _context;

        public ProductsController(ProductContext context)
        {
            _context = context;
        }
             private readonly UserManager<IdentityUser> _userManager;


        // GET: api/Products
        [HttpGet]
        [EnableCors("alloworigin")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            /*try
            {
                var productsQuery = _context.Products.AsQueryable();
                var totalRecords = await productsQuery.CountAsync();

                var products = await productsQuery
                    .Skip((_page - 1) * _limit)
                    .Take(_limit)
                    .ToListAsync();

                Response.Headers.Add("X-Total-Count", totalRecords.ToString()); // Include total count in response headers

                return products;
            }*/
            try
            {
                var products = await _context.Products
                    .OrderByDescending(p => p.ProductId)
                    .ToListAsync();
                var a = _userManager;
                return products;
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        /*[HttpGet]
        [EnableCors("alloworigin")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        [FromQuery] int? page = 1,
        [FromQuery] int? limit = 5,
        [FromQuery] string? sortField = "ProductId",
        [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                // Validate page and limit values
                page ??= 1;
                limit ??= 5;
                if (page <= 0)
                    page = 1;
                if (limit <= 0)
                    limit = 5;

                // Apply sorting based on user input
                var sortExpression = GetSortExpression(sortField!);
                IQueryable<Product> productsQuery = sortOrder!.ToLower() switch
                {
                    "desc" => _context.Products.OrderByDescending(sortExpression),
                    _ => _context.Products.OrderBy(sortExpression),
                };

                // Paginate the results
                var totalRecords = await productsQuery.CountAsync();
                var products = await productsQuery
                    .Skip((page.Value - 1) * limit.Value)
                    .Take(limit.Value)
                    .ToListAsync(); // Ensure you're using IQueryable and ToListAsync here

                // Include total count in response headers
                Response.Headers["X-Total-Count"] = totalRecords.ToString();

                return products;
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"Error fetching products: {ex.Message}");
                return StatusCode(500); // Consider returning a more detailed error response
            }
        }

        private Expression<Func<Product, object>> GetSortExpression(string sortField)
        {
            // Define sorting expressions based on the field name
            return sortField.ToLower() switch
            {
                "name" => p => p.Name,
                "description" => p => p.Description,
                "price" => p => p.Price,
                "quantity" => p => p.Quantity,
                _ => p => p.ProductId, // Default sorting by ProductId
            };
        }*/

        // GET: api/Products/5
        [Authorize(Roles = UserRoles.Admin)]
        [HttpGet("{id}")]
        [EnableCors("alloworigin")]
        public async Task<IActionResult> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == id);

                if (product == null)
                {
                    return NotFound(); // Product not found
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Internal server error
            }
        }

        // POST: api/Products
        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [EnableCors("alloworigin")]
        public async Task<IActionResult> PostProduct([FromBody] Product product)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState); // Validation error
                }
                // Check if a product with the same name already exists
                var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Name == product.Name);
                if (existingProduct != null)
                {
                    //return Conflict("A product with the same name already exists."); // Conflict status code (409)
                    return StatusCode(StatusCodes.Status409Conflict, new Response { Status = "Error", Message = "Product already exists!" });
                }
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Internal server error
            }
        }

        // PUT: api/Products/5
        [Authorize(Roles = UserRoles.Admin)]
        [HttpPut("{id}")]
        [EnableCors("alloworigin")]
        public async Task<IActionResult> PutProduct(int id, [FromBody] Product product)
        {
            try
            {
                if (id != product.ProductId)
                {
                    return BadRequest("Product ID mismatch"); // ID mismatch
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState); // Validation error
                }

                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent(); // Successful update (no content to return)
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound(); // Product not found
                }
                else
                {
                    return StatusCode(500, "The product record could not be saved. Try again later."); // Concurrency conflict
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Internal server error
            }
        }

        // DELETE: api/Products/5
        [Authorize(Roles = UserRoles.Admin)]
        [HttpDelete("{id}")]
        [EnableCors("alloworigin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == id);

                if (product == null)
                {
                    return NotFound(); // Product not found
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return NoContent(); // Successful deletion (no content to return)
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Internal server error
            }
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}

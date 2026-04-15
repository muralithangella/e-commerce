import { Link } from 'react-router-dom';
import { useAddToCart } from '@/features/cart/api/mutations';

function StarRating({ rating }) {
  const full  = Math.round(rating);
  const empty = 5 - full;
  return (
    <span aria-label={`Rating: ${rating} out of 5 stars`} style={{ color: 'var(--clr-warning)', fontSize: 13 }}>
      {'★'.repeat(full)}{'☆'.repeat(empty)}
      <span aria-hidden="true" style={{ color: 'var(--clr-muted)', marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ProductCard({ product, priority = false }) {
  const addToCart = useAddToCart();
  const discount  = product.discountPercentage;

  return (
    <article className="product-card card">
      <Link
        to={`/product/${product.id}`}
        aria-label={`View details for ${product.title}`}
        className="product-card__image-wrap"
      >
        {/* Explicit width+height prevents CLS. objectFit:cover handles aspect ratio visually. */}
        <img
          src={product.thumbnail}
          alt={product.title}
          width="400"
          height="300"
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          className="product-card__img"
        />
        {discount > 5 && (
          <span aria-label={`${Math.round(discount)}% discount`} className="product-card__badge">
            -{Math.round(discount)}%
          </span>
        )}
      </Link>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
          <h3 className="product-card__title">{product.title}</h3>
        </Link>
        <StarRating rating={product.rating} />
        <div className="product-card__price-row">
          <span className="product-card__price">${product.price}</span>
          {discount > 5 && (
            <span className="product-card__original-price" aria-label="Original price">
              ${(product.price / (1 - discount / 100)).toFixed(2)}
            </span>
          )}
        </div>
        <button
          className="btn btn-primary product-card__cta"
          onClick={() => addToCart.mutate(product)}
          disabled={addToCart.isPending}
          aria-label={`Add ${product.title} to cart`}
        >
          {addToCart.isPending ? 'Adding…' : '+ Add to Cart'}
        </button>
      </div>
    </article>
  );
}

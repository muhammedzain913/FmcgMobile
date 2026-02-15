import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { addToCart } from "../redux/reducer/cartReducer";

/**
 * Custom hook for adding products to cart
 * Returns a function that can be passed to ProductCard component
 * 
 * @returns {Function} addItemToCart - Function to add product to cart
 * 
 * @example
 * const addItemToCart = useAddToCart();
 * 
 * <ProductCard 
 *   product={product} 
 *   addToCart={addItemToCart}
 *   navigation={navigation}
 * />
 */
export const useAddToCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  const addItemToCart = (product: any) => {
    console.log("adding items..");
    dispatch(
      addToCart({
        id: product?.id,
        image: product?.imageUrl,
        title: product?.title,
        price: product?.salePrice,
        slug: product?.slug,
        color: false,
        hascolor: false,
        vendorId: product?.userId,
      } as any),
    );
  };

  return addItemToCart;
};

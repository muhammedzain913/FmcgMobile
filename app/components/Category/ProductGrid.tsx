import React, { useEffect } from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import ProductCard from "../../screens/Product/ProductCard";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Variant } from "../../types/product";

interface ProductGridProps {
  products: any[];
  addToCart: (product: any, selectedVariant: Variant) => void;
  navigation: NavigationProp<RootStackParamList>;
  productCardImageHeight?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  addToCart,
  navigation,
  productCardImageHeight,
}) => {
  useEffect(() => {
    console.log("products in product grid", products);
  }, [products]);
  return (
    <View style={{ flex: 1, padding: 5, backgroundColor: "#fff" }}>
      <FlashList
        data={products}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        estimatedItemSize={200}
        contentContainerStyle={{
          paddingHorizontal: 6,
          paddingBottom: 10,
        }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, paddingHorizontal: 6, paddingVertical: 6, minWidth: 0 }}>
            <ProductCard
              addToCart={addToCart}
              product={item}
              navigation={navigation}
              imageContainerHeight={productCardImageHeight}
            />
          </View>
        )}
      />
    </View>
  );
};

export default ProductGrid;

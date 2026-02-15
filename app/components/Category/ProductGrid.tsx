import React from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import ProductCard from "../../screens/Product/ProductCard";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootStackParamList";

interface ProductGridProps {
  products: any[];
  addToCart: (product: any) => void;
  navigation: NavigationProp<RootStackParamList>;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  addToCart,
  navigation,
}) => {
  return (
    <View style={{ flex: 1, padding: 5, backgroundColor: "#F9F9F9" }}>
      <FlashList
        data={products}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        estimatedItemSize={200}
        contentContainerStyle={{
          paddingBottom: 10,
        }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 2, minWidth: 0 }}>
            <ProductCard
              addToCart={addToCart}
              product={item}
              navigation={navigation}
            />
          </View>
        )}
      />
    </View>
  );
};

export default ProductGrid;

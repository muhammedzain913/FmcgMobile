import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AddressCard from './AddressCard';
import Button from '../Button/Button';
import { AddressResponse } from '../../types/response/addressResponse';

interface AddressListProps {
  addresses: AddressResponse[];
  onEdit: (address: AddressResponse) => void;
  onRemove: (address: AddressResponse) => void;
  onAddNew: () => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onEdit,
  onRemove,
  onAddNew,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.addressList}>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => onEdit(address)}
              onRemove={() => onRemove(address)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          variant="non"
          title="Add New Address"
          color="#1E123D"
          text="#FFFFFF"
          onPress={onAddNew}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 10,
  },
  addressList: {
    gap: 10,
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 10,
  },
});

export default AddressList;

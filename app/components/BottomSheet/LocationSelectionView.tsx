import React from 'react';
import { View, StyleSheet } from 'react-native';
import LocationDropdown from '../Home/LocationDropdown';
import Button from '../Button/Button';

interface LocationSelectionViewProps {
  governorates: any[];
  cities: any[];
  blocks: any[];
  governorate?: { name: string } | null;
  city?: { name: string } | null;
  block?: { name: string } | null;
  govVisible: boolean;
  cityVisible: boolean;
  blockVisible: boolean;
  onGovOpen: () => void;
  onGovClose: () => void;
  onCityOpen: () => void;
  onCityClose: () => void;
  onBlockOpen: () => void;
  onBlockClose: () => void;
  onGovernorateSelect: (item: any) => void;
  onCitySelect: (item: any) => void;
  onBlockSelect: (item: any) => void;
  onContinue: () => void;
}

const LocationSelectionView: React.FC<LocationSelectionViewProps> = ({
  governorates,
  cities,
  blocks,
  governorate,
  city,
  block,
  govVisible,
  cityVisible,
  blockVisible,
  onGovOpen,
  onGovClose,
  onCityOpen,
  onCityClose,
  onBlockOpen,
  onBlockClose,
  onGovernorateSelect,
  onCitySelect,
  onBlockSelect,
  onContinue,
}) => {
  return (
    <>
      <View style={styles.dropdownsContainer}>
        <LocationDropdown
          label="Choose governorate"
          visible={govVisible}
          onOpen={onGovOpen}
          onClose={onGovClose}
          selectedValue={governorate?.name}
          placeholder="Select Governerate"
          options={governorates}
          onSelect={onGovernorateSelect}
        />

        <LocationDropdown
          label="Choose city"
          visible={cityVisible}
          onOpen={onCityOpen}
          onClose={onCityClose}
          selectedValue={city?.name}
          placeholder="Select City"
          options={cities}
          onSelect={onCitySelect}
          scrollable={true}
        />

        <LocationDropdown
          label="Choose block"
          visible={blockVisible}
          onOpen={onBlockOpen}
          onClose={onBlockClose}
          selectedValue={block?.name}
          placeholder="Select Block"
          options={blocks}
          onSelect={onBlockSelect}
          scrollable={true}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="non"
          color={"#1E123D"}
          title="Continue"
          onPress={onContinue}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownsContainer: {
    // gap: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default LocationSelectionView;

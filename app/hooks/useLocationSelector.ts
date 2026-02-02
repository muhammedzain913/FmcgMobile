import { useEffect, useState } from "react";

import { Url } from "../redux/userConstant";
import { ApiClient } from "../redux/api";
import { useSelector } from "react-redux";

const apiPath = ApiClient();

export const useLocationSelector = () => {
  const defaultAddress = useSelector((x: any) => x?.user?.defaultAddress);
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);

  const [governorate, setGovernorate] = useState<any>(null);
  const [city, setCity] = useState<any>(null);
  const [block, setBlock] = useState<any>( null);

  const [govVisible, setGovVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [blockVisible, setBlockVisible] = useState(false);

  useEffect(() => {
    console.log("fetching governorates changed", defaultAddress);
    const fetchGovernorates = async () => {
      const response = await apiPath.get(`${Url}/api/governorates`);
      setGovernorates(response.data);
    };

    fetchGovernorates();
  }, []);

  /** Fetch cities when governorate changes */
  useEffect(() => {
    if (!governorate?.id) return;

    const fetchCities = async () => {
      const response = await apiPath.get(
        `${Url}/api/governorates/${governorate.id}/cities`
      );
      setCities(response.data);
      // setCity(null);
      // setBlock(null);
    };

    fetchCities();
  }, [governorate]);

  /** Fetch blocks when city changes */
  useEffect(() => {
    if (!city?.id) return;

    const fetchBlocks = async () => {
      const response = await apiPath.get(`${Url}/api/cities/${city.id}/blocks`);
      setBlocks(response.data);
      // setBlock(null);
    };

    fetchBlocks();
  }, [city]);


  useEffect(() => {
  if (!defaultAddress) return;

  setGovernorate(defaultAddress.governorate);
  setCity(defaultAddress.city);
  setBlock(defaultAddress.block);
}, [defaultAddress]);




  return {
    governorates,
    cities,
    blocks,

    governorate,
    city,
    block,

    setGovernorate,
    setCity,
    setBlock,

    govVisible,
    cityVisible,
    blockVisible,

    setGovVisible,
    setCityVisible,
    setBlockVisible,
  };
};

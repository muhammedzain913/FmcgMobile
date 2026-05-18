import React, { useRef, useEffect } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectCartTotalQuantity } from '../redux/reducer/cartReducer';
import { IMAGES } from '../constants/Images';

const BRAND = '#1E123D';
const INACTIVE = '#B0B7C3';
const BAR_HEIGHT = 78;
const FLOAT_SIDE = 20;

const LABELS: Record<string, string> = {
    Home: 'Home',
    Categories: 'Browse',
    'My Orders': 'Orders',
    'My Cart': 'Cart',
};

type IconDef = { outline: string; filled: string };
const ICONS: Record<string, IconDef> = {
    Categories: { outline: 'grid-outline',    filled: 'grid' },
    'My Orders': { outline: 'receipt-outline', filled: 'receipt' },
    'My Cart':   { outline: 'bag-outline',     filled: 'bag' },
};

// ─── Tab Item ────────────────────────────────────────────────────────────────

type TabItemProps = { label: string; isFocused: boolean; onPress: () => void; cartCount?: number };

const TabItem = ({ label, isFocused, onPress, cartCount = 0 }: TabItemProps) => {
    const anim        = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
    const bounceAnim  = useRef(new Animated.Value(1)).current;
    const prevCount   = useRef(cartCount);

    useEffect(() => {
        Animated.spring(anim, {
            toValue: isFocused ? 1 : 0,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
        }).start();
    }, [isFocused]);

    // Bounce cart icon when a new item is added
    useEffect(() => {
        if (label === 'My Cart' && cartCount > prevCount.current) {
            Animated.sequence([
                Animated.spring(bounceAnim, {
                    toValue: 1.4,
                    useNativeDriver: true,
                    tension: 300,
                    friction: 5,
                }),
                Animated.spring(bounceAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 120,
                    friction: 6,
                }),
            ]).start();
        }
        prevCount.current = cartCount;
    }, [cartCount]);

    const inactiveOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
    const bubbleScale     = anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
    const iconScale       = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

    const isHome = label === 'Home';
    const isCart = label === 'My Cart';
    const iconDef = ICONS[label];
    const shortLabel = LABELS[label] ?? label;

    const combinedScale = isCart
        ? Animated.multiply(iconScale, bounceAnim)
        : iconScale;

    return (
        <TouchableOpacity onPress={onPress} style={styles.tabItem} activeOpacity={0.8}>
            <Animated.View style={[styles.iconWrap, { transform: [{ scale: combinedScale }] }]}>
                <Animated.View
                    style={[styles.bubble, { opacity: anim, transform: [{ scale: bubbleScale }] }]}
                />

                {/* Active icon */}
                <Animated.View style={[StyleSheet.absoluteFill, styles.center, { opacity: anim }]}>
                    {isHome
                        ? <Image source={IMAGES.Home} style={styles.logo} resizeMode="contain" />
                        : <Ionicons name={iconDef.filled as any} size={22} color="#FFFFFF" />
                    }
                </Animated.View>

                {/* Inactive icon */}
                <Animated.View style={[styles.center, { opacity: inactiveOpacity }]}>
                    {isHome
                        ? <Image source={IMAGES.Home} style={[styles.logo, { tintColor: INACTIVE }]} resizeMode="contain" />
                        : <Ionicons name={iconDef.outline as any} size={22} color={INACTIVE} />
                    }
                </Animated.View>

                {/* Cart badge */}
                {isCart && cartCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {cartCount > 99 ? '99+' : cartCount}
                        </Text>
                    </View>
                )}
            </Animated.View>

            <Animated.Text style={[styles.label, { opacity: anim }]} numberOfLines={1}>
                {shortLabel}
            </Animated.Text>
        </TouchableOpacity>
    );
};

// ─── Bottom Menu ─────────────────────────────────────────────────────────────

type Props = { state: any; navigation: any; descriptors: any };

const BottomMenu = ({ state, navigation, descriptors }: Props) => {
    const insets    = useSafeAreaInsets();
    const cartCount = useSelector(selectCartTotalQuantity);

    return (
        <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
            <View style={styles.bar}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    };

                    return (
                        <TabItem
                            key={route.key}
                            label={label}
                            isFocused={isFocused}
                            onPress={onPress}
                            cartCount={label === 'My Cart' ? cartCount : undefined}
                        />
                    );
                })}
            </View>
        </View>
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#FFFFFF',
        shadowColor: BRAND,
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 16,
    },
    bar: {
        height: BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: FLOAT_SIDE,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        paddingBottom: 10,
    },
    iconWrap: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bubble: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 22,
        backgroundColor: BRAND,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 22,
        height: 22,
    },
    label: {
        position: 'absolute',
        top: 60,
        fontSize: 10,
        fontFamily: 'Lato-SemiBold',
        color: BRAND,
        letterSpacing: 0.3,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -4,
        backgroundColor: 'rgba(5, 155, 93, 1)',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'Lato-Bold',
        lineHeight: 12,
    },
});

export default BottomMenu;

import { Dimensions } from "react-native";
const {width,height} = Dimensions.get('screen');

export const COLORS = {
	primary: "#000",
	primaryLight: "rgba(0, 0, 0, 0.1)",
	secondary: "#EFE7DC",
	success: "#159E42",
	danger: "#FF3131",
	warning: "#ffb02c",
	dark: "#2f2f2f",
	light: "#E6E6E6",
	info: "#2B39B9",
	white: "#fff",
	label: "#8A8A8A",
	backgroundColor: "#fff",
	black: "#000",
	
	//light theme
	card : "#fff",
	background : "#F6F6F6",
	text : "rgba(0,0,0,.6)",
	title : "#000",
	borderColor : "rgba(0,0,0,.1)",
	input : "rgba(0,0,0,.03)",
	
	//dark theme
	darkCard : "rgba(255,255,255,.05)",
	darkBackground : "#000303",
	darkText : "rgba(255,255,255,.6)",
	darkTitle : "#fff",
	darkBorder : "rgba(255,255,255,.2)",
	darkInput : "rgba(255,255,255,.05)",
}

export const SIZES = {
	fontLg: 16,
	font: 14,
	fontSm: 13,
	fontXs: 12,

	//radius
	radius_sm: 8,
	radius: 6,
	radius_lg: 15,

	//space
	padding: 15,
	margin: 15,

	//Font Sizes
	h1: 40,
	h2: 28,
	h3: 24,
	h4: 20,
	h5: 18,
	h6: 16,

	//App dimensions
	width,
	height,

	container: 800,
};

export const FONTS = {
	fontLg: { fontSize: SIZES.fontLg, color: COLORS.text, lineHeight: 20, fontFamily: 'JostRegular' },
	font: { fontSize: SIZES.font, color: COLORS.card, lineHeight: 20, fontFamily: 'JostRegular' },
	fontSm: { fontSize: SIZES.fontSm, color: COLORS.text, lineHeight: 18, fontFamily: 'JostRegular' },
	fontXs: { fontSize: SIZES.fontXs, color: COLORS.text, lineHeight: 14, fontFamily: 'JostRegular' },
	h1: { fontSize: SIZES.h1, color: COLORS.title, fontFamily: 'JostSemiBold' },
	h2: { fontSize: SIZES.h2, color: COLORS.title, fontFamily: 'JostSemiBold' },
	h3: { fontSize: SIZES.h3, color: COLORS.title, fontFamily: 'JostSemiBold' },
	h4: { fontSize: SIZES.h4, color: COLORS.title, fontFamily: 'JostSemiBold' },
	h5: { fontSize: SIZES.h5, color: COLORS.title, fontFamily: 'JostSemiBold' },
	h6: { fontSize: SIZES.h6, color: COLORS.title, fontFamily: 'JostSemiBold' },
	fontBold: { fontFamily: 'JostBold' },
	fontMedium: { fontFamily: 'JostMedium' },
	fontTitle: { fontFamily: 'JostMedium' },
	fontRegular: { fontFamily: 'JostRegular' },
	fontSemiBold: { fontFamily: 'JostSemiBold' },
	fontJostLight: { fontFamily: 'JostLight' },
	fontJostExtraLight: { fontFamily: 'JostExtraLight' },
	Marcellus: { fontFamily: 'Marcellus-Regular' },
	fontJostItalic: { fontFamily: 'Jost-Italic' },
	fontJostSemiBoldItalic: { fontFamily: 'Jost-SemiBoldItalic' },
	fontJostLightItalic: { fontFamily: 'Jost-LightItalic' },
	fontJostMediumItalic: { fontFamily: 'Jost-MediumItalic' },
}


const appTheme = {COLORS, SIZES, FONTS}

export default appTheme;
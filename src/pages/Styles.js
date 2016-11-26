// vim: sw=2:paste

import { lightBlack, blue500, grey100, grey500, darkBlack, white, grey300 }
from 'material-ui/styles/colors';


const cssTextColor = '#ffffff';
const cssLineColor = '#dddddd';
// const cssBgColorBody = '#4682b4';
const cssBgColorBody = '#00517E';

const basicDarkColor = '#104DA1';

const Styles = {
  palette: {
    backgroundColor: '#607d8b',
    primary1Color: basicDarkColor,
    primary2Color: '#E22A23',
    primary3Color: lightBlack,
    accent1Color: blue500,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
  },
  appBar: {
    height: 50,
  },
  paper: {
    margin: '10px auto auto auto',
  },
  title: {
    margin: 10,
  },
  menuButton: {
    color: cssTextColor,
  },
  button: {
    backgroundColor: cssBgColorBody,
    borderColor: cssLineColor,
    borderRadius: 2,
    borderWidth: 2,
    color: cssTextColor,
    fontSize: 16,
    margin: 4,
    padding: '12px 24px',
    textAlign: 'center',
  },
  mainAppBar: {
    menuButton: {
      color: grey300,
    },
    badge: {
      color: basicDarkColor,
      borderColor: grey300,
      right: 20,
      top: 20,
      verticalAlign: 'middle',
    },
    badgeIconColor: grey300,
    badgeIconHoverColor: grey500,
    iconStyles: {
      marginRight: 24,
    },
  },
  tabs: {
    background: '#1565C0',
    fontVariant: 'normal',
  },
  avatarIconMenu: {
  },
  iconMenu: {
    targetOrigin: {
      horizontal: 'right',
      vertical: 'top',
    },
    anchorOrigin: {
      horizontal: 'right',
      vertical: 'top',
    },
  }
};

export default Styles;


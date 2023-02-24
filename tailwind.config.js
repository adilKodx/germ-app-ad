module.exports = {
  theme: {
    screens: {
      xs: "640px",
      sm: "750px", //'640px',
      md: "992px", //'768px',
      lg: "1200px", //'1024px',
      xl: "1640px", //'1280px',
    },
    extend: {
      gridTemplateRows: {
        // Simple 8 row grid
        '1': '	grid-template-rows: repeat(1, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',
        'layout': '200px minmax(900px, 1fr) 100px',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '1': 'grid-template-columns: repeat(1, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        'footer': '200px minmax(900px, 1fr) 100px',
      },
      borderRadius: {
        lg: "0.625rem",
        xl: "0.75rem",
        "3xl": "1.5rem",
        "2xl": "1rem"
      },
      colors: {
        black: {
          default: "#312525",
        },
        red: {
          default: "#EEB8BB",
          100: "#db3c42",
          200: "#644B96",
          300: "#C11718",
          400: '#ebd0d0',
        },
        blue: {
          default: "#E5F0F9",
          100: "#2C91DC",
          //   200: "#1b3f92",
          200: "#00a3a1", //color sent by br Imad
        },
        gray: {
          default: "#696969",
          0: "#E5E5E5",
          100: "#D2D2D2",
          200: "#B3B3B3",
          300: "#727272",
          //   400: "#696969",
          400: "black", //color sent by br Imad
          500: "#969696",
        },
        white: {
          default: "#FFFFFF",
          100: "rgba(255,255,255,0.8)",
        },
        green: {
          //   default: "#1d9868",
          default: "#27a350",
          50: "#A7F3D0",
          100: "#F2F9F6",
          //   200: "#37A479",
          200: "#27a350", //color sent by br Imad
          //   300: "#289576",
          300: "#27a350", //color sent by br Imad
          400: "#00a3a1",
        },
        purple: {
          100: "#F9F8FA",
        },
      },
      width: {
        "12/25": "48%",
        "1/4": "25%",
      },
      lineHeight: {
        zero: 0,
      },
      fontSize: {
        "2xs": ".5rem",
        "1-5xl": "1.38rem",
        "2-5xl": "1.75rem",
        "3-5xl": "2rem",
        "3-7xl": "2.13rem",
        "4-5xl": "2.75rem",
        "5-5xl": "3.5rem",
      },
      spacing: {
        "4": "1rem",
        "0-5": "0.3rem",
        "18": "4.5rem",
        "16": "4rem",
        "44": "11rem",
      },
      inset: {
        "1/2": "50%",
        "16": "4rem",
        "4": "1rem",
        "44": "11rem",
        "60": "15rem",
      }
    },
    boxShadow: {
      default: "0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06)",
      lg: "0px 0px 10px #4A348533",
      outline: "0 0 0 3px rgba(102,102,102,0.5)",
      nav: "0px 3px 6px #00000029",
    },
  },
  variants: {
    lineHeight: ["responsive"],
  },
};

# 3D Spirograph

An interactive 3D Spirograph visualization built with Three.js. Create beautiful mathematical patterns in three dimensions.

![3D Spirograph](https://raw.githubusercontent.com/username/3d-spirograph/main/screenshot.png)

## Features

- Create classic spirograph patterns in 3D space
- Adjust parameters in real-time:
  - Outer radius
  - Inner radius
  - Pen offset
  - 3D height amplitude
  - Drawing speed
  - Line thickness
- Customize colors
- Toggle gear visualization to see the mechanics
- Rotate and zoom the 3D view

## How to Run

### Option 1: Direct in Browser
1. Clone or download this repository
2. Open the `index.html` file in any modern web browser
3. That's it! No server or build process required

### Option 2: Using Local Server (Recommended)
1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Clone or download this repository
3. Open a terminal in the project directory
4. Run `npm install` to install dependencies
5. Run `npm start` to start the server
6. Open your browser and go to `http://localhost:3000`

## How It Works

A spirograph creates patterns by rolling a small circle inside or outside a larger circle. The pen is attached to a point on the small circle, and as the small circle rolls, the pen traces a curve called a hypotrochoid or epitrochoid.

This implementation extends the classic 2D spirograph into 3D space by adding height variation based on mathematical functions.

## Controls

- **Outer Radius**: Size of the fixed outer circle
- **Inner Radius**: Size of the moving inner circle
- **Pen Offset**: Distance of the pen from the center of the inner circle
- **3D Height**: Amplitude of the vertical (y-axis) variation
- **Speed**: Drawing speed
- **Line Thickness**: Thickness of the drawn line
- **Primary Color**: Color of the main line
- **Secondary Color**: Color of the particles
- **Show Gears**: Toggle visibility of the mechanical gears

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Three.js for 3D rendering
- Express.js for the optional local server

## License

MIT

## Author

Created by [Your Name]

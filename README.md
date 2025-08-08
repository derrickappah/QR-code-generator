

# QR Code Generator and Scanner

A web-based application for generating and scanning QR codes. Users can create QR codes for text, URLs, Wi-Fi credentials, or vCard contacts, customize their appearance with colors and logos, save them to history, and scan QR codes using a device camera. The application is built using HTML, CSS (with Tailwind CSS), and JavaScript, leveraging the `qrcode.js` and `html5-qrcode` libraries.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Generate QR Codes**: Create QR codes for:
  - Plain text
  - URLs
  - Wi-Fi credentials (SSID, password, encryption type, hidden network)
  - vCard contact information (name, phone, email)
- **Customize QR Codes**: Adjust foreground and background colors and add a custom logo.
- **Download QR Codes**: Save generated QR codes as PNG images.
- **History**: View and manage previously generated QR codes, with options to re-generate or download.
- **Search History**: Filter history entries by text content.
- **Scan QR Codes**: Use the device camera to scan QR codes and display the decoded content.
- **Torch Support**: Toggle the camera's flashlight (if supported) during scanning.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.

## Technologies
- **HTML5**: Structure of the web application.
- **CSS**: Styling with Tailwind CSS and custom styles.
- **JavaScript**: Logic for QR code generation, scanning, and UI interactions.
- **Libraries**:
  - [qrcode.js](https://davidshimjs.github.io/qrcodejs/) (v1.0.0) for QR code generation.
  - [html5-qrcode](https://github.com/mebjas/html5-qrcode) for QR code scanning.
  - [Tailwind CSS](https://tailwindcss.com/) (via CDN) for responsive styling.
- **Fonts**: Google Fonts (Inter and Noto Sans).
- **LocalStorage**: For persisting QR code history and settings.

## Installation
1. **Clone or Download the Repository**:
   ```bash
   git clone <repository-url>
   cd qr-code-app
   ```
   Alternatively, download the project files and extract them to a directory.

2. **File Structure**:
   Ensure the following files are in the project directory:
   ```
   qr-code-app/
   ├── index.html
   ├── styles.css
   ├── script.js
   └── README.md
   ```

3. **Serve the Application**:
   Since the application uses external CDNs and local files, you need to serve it via a web server to avoid CORS issues and enable camera access:
   - **Option 1: Local Development Server**:
     Use a simple HTTP server, such as Python's `http.server`:
     ```bash
     python -m http.server 8000
     ```
     Then, open `http://localhost:8000` in your browser.
   - **Option 2: VS Code Live Server**:
     Use the Live Server extension in Visual Studio Code to serve the files.
   - **Option 3: Deploy to a Hosting Service**:
     Deploy to services like Netlify, Vercel, or GitHub Pages for public access.

4. **Browser Requirements**:
   - A modern browser (Chrome, Firefox, Safari, Edge) with camera access enabled for scanning.
   - Ensure HTTPS or `localhost` is used for camera access due to browser security restrictions.

## Usage
1. **Open the Application**:
   Navigate to the served URL (e.g., `http://localhost:8000`) in your browser.

2. **Generate QR Codes**:
   - Select a QR code type (Text, URL, Wi-Fi, or vCard) from the dropdown.
   - Enter the required information (e.g., text, URL, Wi-Fi credentials, or contact details).
   - Click **Generate** to create the QR code.
   - Click **Download QR Code** to save the generated QR code as a PNG file.

3. **Customize QR Codes**:
   - Go to the **Settings** tab.
   - Adjust the foreground and background colors using the color pickers.
   - Upload an optional logo image to embed in the QR code.
   - Click **Save Settings** to apply and persist changes.

4. **View History**:
   - Navigate to the **History** tab to see previously generated QR codes.
   - Use the search bar to filter history entries.
   - Click **Re-generate** to populate the generator with saved data or **Download** to save the QR code image.
   - Click **Clear History** to remove all history entries.

5. **Scan QR Codes**:
   - Go to the **Scan** tab.
   - Grant camera access when prompted.
   - Point the camera at a QR code to scan it. The decoded text will appear in the result section.
   - Use the **Toggle Torch** button (if supported) to enable/disable the camera flashlight.
   - Click **Re-scan** to scan another QR code.

## File Structure
```
qr-code-app/
├── index.html       # Main HTML file with the application structure
├── styles.css       # Custom CSS styles for the application
├── script.js        # JavaScript logic for QR code generation, scanning, and UI
└── README.md        # Documentation for the project
```

## Dependencies
The application relies on the following external resources, loaded via CDN:
- **Tailwind CSS**: For styling and responsive design.
- **qrcode.js**: For generating QR codes.
- **html5-qrcode**: For scanning QR codes.
- **Google Fonts**: For Inter and Noto Sans fonts.

For production, consider downloading these dependencies locally to reduce reliance on external servers:
1. Download `qrcode.min.js` from [qrcode.js](https://davidshimjs.github.io/qrcodejs/) and place it in the project directory.
2. Download `html5-qrcode.min.js` from [html5-qrcode](https://github.com/mebjas/html5-qrcode) and place it in the project directory.
3. Compile Tailwind CSS locally using a build tool like PostCSS and include the output in `styles.css`.

Update `index.html` to reference local files instead of CDNs if you choose this approach.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request with a description of your changes.

Please ensure your code follows the existing style and includes appropriate comments.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

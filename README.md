# Portfolio Website

A modern, responsive portfolio website built with React and Vite, featuring a clean design and smooth animations.

## Features

- 🌓 Dark/Light mode toggle
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- 📝 Sections for About, Skills, Projects, Education, Achievements, and Contact
- 🔗 Social media integration
- 🎯 Smooth scrolling navigation
- ✨ Framer Motion animations for enhanced user experience

## Tech Stack

- React.js
- Vite
- Bootstrap
- CSS3
- React Type Animation
- React Bootstrap
- React Anchor Link Smooth Scroll
- Framer Motion

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## Project Structure

```
portfolio/
├── src/
│   ├── components/     # React components
│   ├── assets/        # Images and other static files
│   ├── context/       # React context providers
│   ├── App.jsx        # Main App component
│   └── main.jsx       # Entry point
├── public/            # Static files
└── index.html         # HTML template
```

## Deployment Guide

### Deploying to GitHub Pages

1. Install GitHub Pages package:
```bash
npm install gh-pages --save-dev
```

2. Update package.json (already configured):
```json
{
  "homepage": "https://your-username.github.io/portfolio/",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Build and deploy:
```bash
npm run build
npm run deploy
```

4. Configure GitHub Repository:
   - Go to repository Settings > Pages
   - Select "gh-pages" branch as source
   - Wait for deployment (usually takes a few minutes)

### Alternative Deployment Options

#### Netlify
1. Create a Netlify account
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Vercel
1. Install Vercel CLI:
```bash
npm install -g vercel
```
2. Deploy:
```bash
vercel
```

## Customization

### Changing Content
- Update text content in respective component files
- Modify images in the `src/assets` directory
- Update project details in `src/assets/files/ProjectDetails.js`
- Update skills in `src/assets/files/SkillsDetails.js`
- Update achievements in `src/assets/files/AchievementsDetails.js`

### Styling
- Main styles are in individual component CSS files
- Global styles in `src/App.css`
- Theme colors can be modified in CSS variables
- Animation configurations can be adjusted in component files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/portfolio](https://github.com/your-username/portfolio) 